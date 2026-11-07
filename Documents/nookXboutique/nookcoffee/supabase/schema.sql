-- =====================================================================
--  NOOK COFFEE BOUTIQUE — Supabase schema (orders & payment verification)
-- =====================================================================
--  Cara pakai:
--  1. Buka https://supabase.com/dashboard -> pilih project -> SQL Editor
--  2. Klik "New query", paste SELURUH isi file ini, lalu klik "Run".
--  3. Ambil Project URL & anon public key di Project Settings -> API,
--     lalu isi di file .env (lihat .env.example) / environment variable
--     Cloudflare Pages:  VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY
--
--  Alur pembayaran:
--  - Pembeli klik "Saya Sudah Bayar"  -> order masuk dengan
--      payment_status = 'waiting_verification'   (BUKAN otomatis sukses)
--  - Admin cek mutasi GoPay / BSI, lalu di Table Editor ubah kolom
--      payment_status -> 'paid'      (pembayaran diterima)  atau
--      payment_status -> 'rejected'  (isi admin_note alasannya)
--  - Halaman pembeli otomatis mengecek status setiap beberapa detik.
--
--  File ini aman dijalankan berulang kali (idempotent).
-- =====================================================================

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------
--  Tabel ORDERS
-- ---------------------------------------------------------------------
create table if not exists public.orders (
  id              uuid primary key default gen_random_uuid(),
  order_code      text not null unique,                 -- contoh: NOOK-20261105-AB12
  customer_name   text not null,
  customer_email  text not null,
  customer_phone  text not null,
  shipping_address text not null,
  payment_method  text not null check (payment_method in ('gopay', 'bsi')),
  subtotal        integer not null check (subtotal >= 0),
  shipping_cost   integer not null default 0 check (shipping_cost >= 0),   -- diisi admin
  total           integer not null check (total >= 0),
  payment_status  text not null default 'waiting_verification'
                  check (payment_status in ('unpaid', 'waiting_verification', 'paid', 'rejected', 'refunded')),
  order_status    text not null default 'new'
                  check (order_status in ('new', 'processing', 'shipped', 'completed', 'cancelled')),
  tracking_number text,                                 -- no. resi (opsional, diisi admin)
  admin_note      text,                                 -- catatan untuk pembeli (mis. alasan ditolak)
  paid_at         timestamptz,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists idx_orders_created_at on public.orders (created_at desc);
create index if not exists idx_orders_payment_status on public.orders (payment_status);
create index if not exists idx_orders_phone on public.orders (customer_phone);

-- ---------------------------------------------------------------------
--  Tabel ORDER_ITEMS
-- ---------------------------------------------------------------------
create table if not exists public.order_items (
  id            bigint generated always as identity primary key,
  order_id      uuid not null references public.orders (id) on delete cascade,
  product_id    text not null,
  product_name  text not null,
  variant       text not null,          -- sachet / 100g / 200g / 250g / 1kg / box-classic / box-premium
  variant_label text not null,
  price         integer not null check (price >= 0),
  compare_price integer,                -- harga coret saat order dibuat (opsional)
  qty           integer not null check (qty > 0),
  subtotal      integer not null check (subtotal >= 0),
  created_at    timestamptz not null default now()
);

create index if not exists idx_order_items_order_id on public.order_items (order_id);

-- ---------------------------------------------------------------------
--  Trigger: updated_at & paid_at otomatis
-- ---------------------------------------------------------------------
create or replace function public.nook_orders_touch()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  if new.payment_status = 'paid' and (old.payment_status is distinct from 'paid') then
    new.paid_at := coalesce(new.paid_at, now());
    if new.order_status = 'new' then
      new.order_status := 'processing';
    end if;
  end if;
  if new.payment_status <> 'paid' and old.payment_status = 'paid' then
    new.paid_at := null;
  end if;
  -- total selalu = subtotal + ongkir
  new.total := new.subtotal + coalesce(new.shipping_cost, 0);
  return new;
end;
$$;

drop trigger if exists trg_orders_touch on public.orders;
create trigger trg_orders_touch
  before update on public.orders
  for each row execute function public.nook_orders_touch();

-- ---------------------------------------------------------------------
--  Row Level Security
--  Pengunjung (anon) TIDAK bisa membaca / mengubah tabel secara langsung.
--  Mereka hanya bisa memanggil 2 fungsi aman di bawah (create_order &
--  get_order_status). Admin mengelola data lewat Supabase Dashboard.
-- ---------------------------------------------------------------------
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

revoke all on public.orders from anon, authenticated;
revoke all on public.order_items from anon, authenticated;

-- ---------------------------------------------------------------------
--  RPC: create_order(p_order jsonb)
--  Dipanggil website saat pembeli klik "Saya Sudah Bayar".
-- ---------------------------------------------------------------------
create or replace function public.create_order(p_order jsonb)
returns table (order_code text, payment_status text, order_status text, total integer, created_at timestamptz)
language plpgsql
security definer
set search_path = public
as $$
#variable_conflict use_column
declare
  v_id       uuid;
  v_code     text := trim(p_order->>'order_code');
  v_name     text := trim(p_order->>'customer_name');
  v_email    text := trim(p_order->>'customer_email');
  v_phone    text := trim(p_order->>'customer_phone');
  v_address  text := trim(p_order->>'shipping_address');
  v_method   text := p_order->>'payment_method';
  v_items    jsonb := coalesce(p_order->'items', '[]'::jsonb);
  v_item     jsonb;
  v_subtotal integer := 0;
  v_count    integer;
begin
  -- validasi dasar
  if v_code is null or v_code !~ '^NOOK-[0-9]{8}-[A-Z0-9]{4,8}$' then
    raise exception 'Kode pesanan tidak valid';
  end if;
  if v_name is null or length(v_name) < 3 or length(v_name) > 120 then
    raise exception 'Nama tidak valid';
  end if;
  if v_email is null or v_email !~* '^[^@\s]+@[^@\s]+\.[^@\s]{2,}$' then
    raise exception 'Email tidak valid';
  end if;
  if v_phone is null or length(regexp_replace(v_phone, '\D', '', 'g')) not between 10 and 15 then
    raise exception 'Nomor telepon tidak valid';
  end if;
  if v_address is null or length(v_address) < 15 or length(v_address) > 500 then
    raise exception 'Alamat tidak valid';
  end if;
  if v_method not in ('gopay', 'bsi') then
    raise exception 'Metode pembayaran tidak valid';
  end if;

  v_count := jsonb_array_length(v_items);
  if v_count = 0 or v_count > 50 then
    raise exception 'Item pesanan tidak valid';
  end if;

  -- hitung ulang subtotal di server (jangan percaya total dari browser)
  for v_item in select * from jsonb_array_elements(v_items) loop
    if (v_item->>'qty')::int <= 0 or (v_item->>'qty')::int > 999 or (v_item->>'price')::int < 0 then
      raise exception 'Item pesanan tidak valid';
    end if;
    v_subtotal := v_subtotal + (v_item->>'price')::int * (v_item->>'qty')::int;
  end loop;

  -- kode sudah pernah dikirim -> kembalikan data lama (aman untuk klik ganda)
  if exists (select 1 from public.orders o where o.order_code = v_code) then
    return query
      select o.order_code, o.payment_status, o.order_status, o.total, o.created_at
      from public.orders o where o.order_code = v_code;
    return;
  end if;

  insert into public.orders (order_code, customer_name, customer_email, customer_phone, shipping_address,
                             payment_method, subtotal, total, payment_status)
  values (v_code, v_name, v_email, v_phone, v_address, v_method, v_subtotal, v_subtotal, 'waiting_verification')
  returning id into v_id;

  insert into public.order_items (order_id, product_id, product_name, variant, variant_label, price, compare_price, qty, subtotal)
  select v_id,
         left(coalesce(i->>'product_id', '-'), 80),
         left(coalesce(i->>'product_name', '-'), 160),
         left(coalesce(i->>'variant', '-'), 40),
         left(coalesce(i->>'variant_label', '-'), 40),
         (i->>'price')::int,
         nullif(i->>'compare_price', '')::int,
         (i->>'qty')::int,
         (i->>'price')::int * (i->>'qty')::int
  from jsonb_array_elements(v_items) as i;

  return query
    select o.order_code, o.payment_status, o.order_status, o.total, o.created_at
    from public.orders o where o.id = v_id;
end;
$$;

-- ---------------------------------------------------------------------
--  RPC: get_order_status(p_order_code, p_phone)
--  Dipakai halaman pembeli untuk mengecek status pembayaran.
--  Butuh kode pesanan + no. telepon agar orang lain tidak bisa mengintip.
-- ---------------------------------------------------------------------
create or replace function public.get_order_status(p_order_code text, p_phone text)
returns table (order_code text, payment_status text, order_status text, total integer,
               shipping_cost integer, tracking_number text, admin_note text, paid_at timestamptz, updated_at timestamptz)
language sql
security definer
set search_path = public
stable
as $$
  select o.order_code, o.payment_status, o.order_status, o.total, o.shipping_cost,
         o.tracking_number, o.admin_note, o.paid_at, o.updated_at
  from public.orders o
  where o.order_code = trim(p_order_code)
    and regexp_replace(o.customer_phone, '\D', '', 'g') = regexp_replace(coalesce(p_phone, ''), '\D', '', 'g')
  limit 1;
$$;

revoke all on function public.create_order(jsonb) from public;
revoke all on function public.get_order_status(text, text) from public;
grant execute on function public.create_order(jsonb) to anon, authenticated;
grant execute on function public.get_order_status(text, text) to anon, authenticated;

-- ---------------------------------------------------------------------
--  View untuk admin (lihat di Table Editor / SQL Editor)
-- ---------------------------------------------------------------------
create or replace view public.admin_orders_overview
with (security_invoker = true) as
select o.order_code,
       o.created_at,
       o.customer_name,
       o.customer_phone,
       o.payment_method,
       o.total,
       o.payment_status,
       o.order_status,
       o.tracking_number,
       string_agg(i.product_name || ' (' || i.variant_label || ') x' || i.qty, ', ' order by i.id) as items
from public.orders o
left join public.order_items i on i.order_id = o.id
group by o.id
order by o.created_at desc;

revoke all on public.admin_orders_overview from anon, authenticated;

-- =====================================================================
--  CONTOH QUERY ADMIN (jalankan manual di SQL Editor bila perlu)
-- =====================================================================
-- Lihat pesanan yang menunggu verifikasi:
--   select * from public.admin_orders_overview where payment_status = 'waiting_verification';
--
-- Tandai pembayaran DITERIMA:
--   update public.orders set payment_status = 'paid' where order_code = 'NOOK-20261105-AB12';
--
-- Tolak pembayaran + alasan:
--   update public.orders set payment_status = 'rejected',
--          admin_note = 'Nominal transfer tidak sesuai, silakan hubungi admin.'
--   where order_code = 'NOOK-20261105-AB12';
--
-- Isi ongkir & no. resi:
--   update public.orders set shipping_cost = 18000, order_status = 'shipped',
--          tracking_number = 'JNE1234567890' where order_code = 'NOOK-20261105-AB12';
