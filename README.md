# LegalCraft

## Project Overview
- **Goal**: Website jasa pengurusan legalitas usaha (NPWP, NIB, PT Perorangan) dengan login wajib dan pembayaran yang diverifikasi otomatis.
- **Stack**: Hono + Cloudflare Pages/Workers + D1 (SQLite) + Vanilla JS/CSS

## Fitur yang Sudah Jadi
- Splash/onboarding → Login / Register (email + password, Google Sign-In jika `GOOGLE_CLIENT_ID` diisi)
- **Tidak ada dashboard.** Setelah login/register user langsung masuk ke **/beranda**. `/dashboard` di-redirect permanen ke `/beranda`.
- Navbar beranda menampilkan nama user + tombol **Keluar** (dulu tombol Dashboard)
- **Konsultasi** dan **Price List** wajib login (modal "Login Dulu" untuk tamu, harga di-blur)
- **Pembayaran otomatis** (BSI / GoPay) dengan kode unik:
  - Dana masuk dengan nominal tepat → status `paid` → **popup sukses** + struk
  - Dana tidak masuk sampai batas waktu → status `rejected` → **popup ditolak otomatis**

## Entry URI
| Path | Keterangan |
|---|---|
| `GET /` | Splash (redirect ke /beranda jika sudah login) |
| `GET /beranda` | Halaman utama |
| `GET /login`, `GET /register` | Auth (jika sudah login → redirect ke `next` / beranda) |
| `GET /pembayaran?layanan=npwp\|nib\|pt` | Pembayaran (wajib login) |
| `POST /api/auth/register` `login` `google` `logout`, `GET /api/auth/me` `config` | Auth |
| `POST /api/orders` | Buat tagihan (harga + kode unik, berlaku 10 menit) |
| `GET /api/orders/:id` | Status (otomatis ditolak jika lewat batas waktu) |
| `POST /api/orders/:id/confirm` | "Saya Sudah Bayar" → mulai jendela verifikasi |
| `POST /api/orders/:id/cancel` | Batalkan |
| `POST /api/orders/:id/simulate-payment` / `simulate-reject` | Khusus mode demo |
| `POST /api/webhooks/mutasi` | Webhook mutasi rekening (header `X-Webhook-Secret`) |

## Alur Status Pembayaran
`pending` (10 menit) → `waiting` (setelah klik "Saya Sudah Bayar", default 5 menit) → `paid` **atau** `rejected`.
Penolakan otomatis dihitung saat ada request (polling halaman tiap 5 detik), jadi tidak butuh cron.

## Menghubungkan ke Rekening Asli
Rekening BSI pribadi / GoPay tidak punya API resmi untuk cek dana masuk, jadi perlu layanan cek mutasi pihak ketiga
(mis. Moota, Mutasibank, dll.) yang mengirim webhook:
1. Set secret: `wrangler pages secret put MUTASI_WEBHOOK_SECRET`
2. Di dashboard penyedia mutasi, isi URL webhook: `https://<domain>/api/webhooks/mutasi?secret=<secret>`
3. Body yang diterima: objek / array / `{data:[...]}` dengan field `amount`, `type` (`CR`), `bank`/`method`, `description`.
Begitu secret diisi, mode demo (tombol simulasi) mati otomatis.

## Data (D1)
`users`, `sessions`, `orders`, `mutations` — lihat `migrations/0001_initial_schema.sql`.

## Environment
- `GOOGLE_CLIENT_ID` (opsional), `MUTASI_WEBHOOK_SECRET` (produksi), `VERIFY_WINDOW_MS` (default 300000)
- Lokal: `.dev.vars`

## Development
```bash
npm run build
npm run db:migrate:local
pm2 start ecosystem.config.cjs
```

## Deployment
- **Status**: Belum di-deploy (preview sandbox saja)
- Sebelum deploy: buat D1 produksi dan ganti `database_id` di `wrangler.jsonc`.

## Belum Dikerjakan / Langkah Berikutnya
- Hubungkan penyedia cek mutasi rekening asli (lihat di atas)
- Panel admin untuk melihat pesanan masuk
- Deploy ke produksi
