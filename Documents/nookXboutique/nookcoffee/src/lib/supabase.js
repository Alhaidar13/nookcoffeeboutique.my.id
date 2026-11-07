// Supabase client ringan (tanpa SDK) — memanggil fungsi RPC yang dibuat
// oleh supabase/schema.sql lewat REST API.
//
// Isi environment variable (file .env lokal / Cloudflare Pages > Settings > Variables):
//   VITE_SUPABASE_URL=https://xxxxx.supabase.co
//   VITE_SUPABASE_ANON_KEY=eyJhbGciOi...   (anon public key, AMAN untuk frontend)

const URL = (import.meta.env.VITE_SUPABASE_URL || '').replace(/\/$/, '')
const KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabaseEnabled = Boolean(URL && KEY)

async function rpc(fn, args) {
  if (!supabaseEnabled) throw new Error('Supabase belum dikonfigurasi')
  const res = await fetch(`${URL}/rest/v1/rpc/${fn}`, {
    method: 'POST',
    headers: {
      apikey: KEY,
      Authorization: `Bearer ${KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(args),
  })
  const text = await res.text()
  const data = text ? JSON.parse(text) : null
  if (!res.ok) throw new Error(data?.message || `Supabase error ${res.status}`)
  return Array.isArray(data) ? data[0] || null : data
}

// Simpan pesanan -> status awal SELALU 'waiting_verification'
export function createOrder(order) {
  return rpc('create_order', {
    p_order: {
      order_code: order.id,
      customer_name: order.customer.name,
      customer_email: order.customer.email,
      customer_phone: order.customer.phone,
      shipping_address: order.customer.address,
      payment_method: order.method,
      items: order.items.map((it) => ({
        product_id: it.productId,
        product_name: it.name,
        variant: it.variant,
        variant_label: it.variantLabel,
        price: it.price,
        compare_price: it.comparePrice || null,
        qty: it.qty,
      })),
    },
  })
}

// Cek status pembayaran (butuh kode pesanan + no. telepon pemesan)
export function getOrderStatus(orderCode, phone) {
  return rpc('get_order_status', { p_order_code: orderCode, p_phone: phone })
}
