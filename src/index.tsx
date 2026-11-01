import { Hono } from 'hono'
import type { Context } from 'hono'
import { getCookie, setCookie, deleteCookie } from 'hono/cookie'
import { serveStatic } from 'hono/cloudflare-workers'

import splashHtml from './pages/splash.html?raw'
import loginHtml from './pages/login.html?raw'
import registerHtml from './pages/register.html?raw'
import berandaHtml from './pages/beranda.html?raw'
import pembayaranHtml from './pages/pembayaran.html?raw'

type Bindings = {
  DB: D1Database
  GOOGLE_CLIENT_ID?: string
  /** Secret untuk webhook mutasi rekening (Moota / Mutasibank / dll). Jika kosong => mode demo/simulator */
  MUTASI_WEBHOOK_SECRET?: string
  /** Batas waktu verifikasi setelah user klik "Saya Sudah Bayar" (ms). Default 5 menit */
  VERIFY_WINDOW_MS?: string
}
type User = { id: string; name: string; email: string; phone: string; avatar: string | null }
type Env = { Bindings: Bindings; Variables: { user: User | null } }

const app = new Hono<Env>()

/* ============================================================
   KONFIGURASI
   ============================================================ */
const SESSION_COOKIE = 'lc_session'
const SESSION_TTL = 30 * 24 * 60 * 60 * 1000 // 30 hari
const PAYMENT_WINDOW = 10 * 60 * 1000 // tagihan berlaku 10 menit
const DEFAULT_VERIFY_WINDOW = 5 * 60 * 1000 // setelah klik "sudah bayar", dana harus masuk dalam 5 menit

const SERVICES: Record<string, { name: string; price: number; oldPrice: number }> = {
  npwp: { name: 'Pengurusan NPWP', price: 149000, oldPrice: 399000 },
  nib: { name: 'Pengurusan NIB', price: 149000, oldPrice: 399000 },
  pt: { name: 'Pendirian PT Perorangan', price: 499000, oldPrice: 899000 }
}
const METHODS = ['bsi', 'gopay']

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/
const PHONE_RE = /^(\+62|62|0)8[0-9]{7,12}$/

const verifyWindow = (env: Bindings) => Number(env.VERIFY_WINDOW_MS) > 0 ? Number(env.VERIFY_WINDOW_MS) : DEFAULT_VERIFY_WINDOW
const isSimulator = (env: Bindings) => !env.MUTASI_WEBHOOK_SECRET

/* ============================================================
   UTIL: crypto (Web Crypto API)
   ============================================================ */
const enc = new TextEncoder()
const toHex = (buf: ArrayBuffer | Uint8Array) =>
  Array.from(buf instanceof Uint8Array ? buf : new Uint8Array(buf)).map((b) => b.toString(16).padStart(2, '0')).join('')
const fromHex = (hex: string) => new Uint8Array(hex.match(/.{2}/g)!.map((h) => parseInt(h, 16)))
const randomHex = (bytes: number) => toHex(crypto.getRandomValues(new Uint8Array(bytes)))

async function hashPassword(password: string, saltHex = randomHex(16)) {
  const key = await crypto.subtle.importKey('raw', enc.encode(password), 'PBKDF2', false, ['deriveBits'])
  const bits = await crypto.subtle.deriveBits({ name: 'PBKDF2', hash: 'SHA-256', salt: fromHex(saltHex), iterations: 100000 }, key, 256)
  return `pbkdf2$${saltHex}$${toHex(bits)}`
}
async function verifyPassword(password: string, stored: string | null) {
  if (!stored) return false
  const [, salt, hash] = stored.split('$')
  if (!salt || !hash) return false
  const again = await hashPassword(password, salt)
  // perbandingan konstan
  const a = again.split('$')[2]
  let diff = a.length ^ hash.length
  for (let i = 0; i < Math.min(a.length, hash.length); i++) diff |= a.charCodeAt(i) ^ hash.charCodeAt(i)
  return diff === 0
}

/* ============================================================
   SESI
   ============================================================ */
const isHttps = (c: Context) => c.req.url.startsWith('https:') || c.req.header('x-forwarded-proto') === 'https'

async function createSession(c: Context<Env>, userId: string) {
  const token = randomHex(32)
  await c.env.DB.prepare('INSERT INTO sessions (token, user_id, expires_at) VALUES (?, ?, ?)')
    .bind(token, userId, Date.now() + SESSION_TTL).run()
  setCookie(c, SESSION_COOKIE, token, {
    httpOnly: true, sameSite: 'Lax', path: '/', secure: isHttps(c), maxAge: SESSION_TTL / 1000
  })
}

async function loadUser(c: Context<Env>): Promise<User | null> {
  const token = getCookie(c, SESSION_COOKIE)
  if (!token) return null
  const row = await c.env.DB.prepare(
    `SELECT u.id, u.name, u.email, u.phone, u.avatar, s.expires_at FROM sessions s
     JOIN users u ON u.id = s.user_id WHERE s.token = ?`
  ).bind(token).first<User & { expires_at: number }>()
  if (!row || row.expires_at < Date.now()) return null
  return { id: row.id, name: row.name, email: row.email, phone: row.phone, avatar: row.avatar }
}

app.use('*', async (c, next) => {
  c.set('user', null)
  const p = c.req.path
  if (!p.startsWith('/static/')) {
    try { c.set('user', await loadUser(c)) } catch (_) { /* DB belum siap */ }
  }
  await next()
})

const safeNext = (n?: string | null) => (n && n.startsWith('/') && !n.startsWith('//') ? n : '/beranda')

/* ============================================================
   STATIC
   ============================================================ */
app.use('/static/*', serveStatic({ root: './public' }))

/* ============================================================
   HALAMAN
   ============================================================ */
const html = (c: Context<Env>, body: string) => {
  c.header('Cache-Control', 'no-store')
  return c.html(body)
}

app.get('/', (c) => (c.get('user') ? c.redirect('/beranda') : html(c, splashHtml)))
app.get('/beranda', (c) => html(c, berandaHtml))
app.get('/login', (c) => (c.get('user') ? c.redirect(safeNext(c.req.query('next'))) : html(c, loginHtml)))
app.get('/register', (c) => (c.get('user') ? c.redirect(safeNext(c.req.query('next'))) : html(c, registerHtml)))
app.get('/pembayaran', (c) => {
  if (!c.get('user')) {
    const url = new URL(c.req.url)
    return c.redirect('/login?next=' + encodeURIComponent(url.pathname + url.search))
  }
  return html(c, pembayaranHtml)
})
// Dashboard sudah dihapus — arahkan permanen ke beranda
app.get('/dashboard', (c) => c.redirect('/beranda', 301))

/* ============================================================
   API: AUTH
   ============================================================ */
app.get('/api/auth/config', (c) => c.json({ googleClientId: c.env.GOOGLE_CLIENT_ID || null }))
app.get('/api/auth/me', (c) => c.json({ user: c.get('user') }))

app.post('/api/auth/register', async (c) => {
  const b = await c.req.json().catch(() => ({} as any))
  const name = String(b.name || '').trim()
  const phone = String(b.phone || '').trim().replace(/[\s-]/g, '')
  if (name.length < 3) return c.json({ error: 'Nama minimal 3 karakter.', field: 'name' }, 400)
  if (!PHONE_RE.test(phone)) return c.json({ error: 'Nomor WhatsApp tidak valid.', field: 'phone' }, 400)

  let email: string, passwordHash: string | null = null, googleSub: string | null = null, avatar: string | null = null
  if (b.credential) {
    const g = await verifyGoogle(c, String(b.credential))
    if (!g) return c.json({ error: 'Sesi Google tidak valid atau kedaluwarsa.' }, 401)
    email = g.email; googleSub = g.sub; avatar = g.picture || null
  } else {
    email = String(b.email || '').trim().toLowerCase()
    const password = String(b.password || '')
    if (!EMAIL_RE.test(email)) return c.json({ error: 'Email tidak valid.', field: 'email' }, 400)
    if (password.length < 8) return c.json({ error: 'Password minimal 8 karakter.', field: 'password' }, 400)
    passwordHash = await hashPassword(password)
  }

  const exists = await c.env.DB.prepare('SELECT id FROM users WHERE email = ?').bind(email).first()
  if (exists) return c.json({ error: 'Email sudah terdaftar.', code: 'exists' }, 409)

  const id = crypto.randomUUID()
  await c.env.DB.prepare(
    'INSERT INTO users (id, name, email, phone, password_hash, google_sub, avatar, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)'
  ).bind(id, name, email, phone, passwordHash, googleSub, avatar, Date.now()).run()
  await createSession(c, id)
  return c.json({ ok: true, redirect: '/beranda' })
})

app.post('/api/auth/login', async (c) => {
  const b = await c.req.json().catch(() => ({} as any))
  const email = String(b.email || '').trim().toLowerCase()
  const password = String(b.password || '')
  const u = await c.env.DB.prepare('SELECT id, password_hash FROM users WHERE email = ?').bind(email).first<{ id: string; password_hash: string | null }>()
  if (!u) return c.json({ error: 'Email belum terdaftar.', code: 'not_registered' }, 404)
  if (!u.password_hash) return c.json({ error: 'Akun ini terdaftar dengan Google. Silakan login dengan Google.' }, 400)
  if (!(await verifyPassword(password, u.password_hash))) return c.json({ error: 'Email atau password salah.' }, 401)
  await createSession(c, u.id)
  return c.json({ ok: true, redirect: '/beranda' })
})

async function verifyGoogle(c: Context<Env>, credential: string) {
  const clientId = c.env.GOOGLE_CLIENT_ID
  if (!clientId) return null
  const r = await fetch('https://oauth2.googleapis.com/tokeninfo?id_token=' + encodeURIComponent(credential))
  if (!r.ok) return null
  const t: any = await r.json()
  if (t.aud !== clientId || String(t.email_verified) !== 'true' || Number(t.exp) * 1000 < Date.now()) return null
  return { sub: String(t.sub), email: String(t.email).toLowerCase(), name: String(t.name || ''), picture: t.picture as string | undefined }
}

app.post('/api/auth/google', async (c) => {
  const b = await c.req.json().catch(() => ({} as any))
  const g = await verifyGoogle(c, String(b.credential || ''))
  if (!g) return c.json({ error: 'Login Google gagal diverifikasi.' }, 401)
  const u = await c.env.DB.prepare('SELECT id, google_sub FROM users WHERE google_sub = ? OR email = ?')
    .bind(g.sub, g.email).first<{ id: string; google_sub: string | null }>()
  if (!u) return c.json({ code: 'not_registered', profile: { name: g.name, email: g.email, avatar: g.picture || null } }, 404)
  if (!u.google_sub) await c.env.DB.prepare('UPDATE users SET google_sub = ?, avatar = COALESCE(avatar, ?) WHERE id = ?').bind(g.sub, g.picture || null, u.id).run()
  await createSession(c, u.id)
  return c.json({ ok: true, redirect: '/beranda' })
})

app.post('/api/auth/logout', async (c) => {
  const token = getCookie(c, SESSION_COOKIE)
  if (token) await c.env.DB.prepare('DELETE FROM sessions WHERE token = ?').bind(token).run()
  deleteCookie(c, SESSION_COOKIE, { path: '/' })
  return c.json({ ok: true })
})

/* ============================================================
   API: PEMBAYARAN OTOMATIS
   Alur status:
     pending  -> tagihan dibuat, menunggu transfer (10 menit)
     waiting  -> user klik "Saya Sudah Bayar", sistem cek mutasi rekening
     paid     -> dana dengan nominal tepat masuk ke rekening  => popup SUKSES
     rejected -> dana TIDAK masuk dalam batas waktu            => DITOLAK otomatis
     cancelled-> dibatalkan user
   ============================================================ */
type OrderRow = {
  id: string; user_id: string; service: string; service_name: string; customer_name: string; phone: string
  method: string; base_amount: number; unique_code: number; amount: number; status: string
  created_at: number; expires_at: number; confirmed_at: number | null; verify_deadline: number | null
  paid_at: number | null; rejected_at: number | null; reject_reason: string | null
}

const orderJson = (o: OrderRow) => ({
  id: o.id, service: o.service, serviceName: o.service_name, customerName: o.customer_name, phone: o.phone,
  method: o.method, baseAmount: o.base_amount, uniqueCode: o.unique_code, amount: o.amount, status: o.status,
  createdAt: o.created_at, expiresAt: o.expires_at, confirmedAt: o.confirmed_at, verifyDeadline: o.verify_deadline,
  paidAt: o.paid_at, rejectedAt: o.rejected_at, rejectReason: o.reject_reason, serverTime: Date.now()
})

/** Tolak otomatis tagihan yang lewat batas waktu tanpa dana masuk (dievaluasi lazy di setiap request). */
async function autoReject(db: D1Database, o: OrderRow): Promise<OrderRow> {
  const now = Date.now()
  if (o.status === 'pending' && now > o.expires_at) {
    o.status = 'rejected'; o.rejected_at = now; o.reject_reason = 'expired'
  } else if (o.status === 'waiting' && o.verify_deadline && now > o.verify_deadline) {
    o.status = 'rejected'; o.rejected_at = now; o.reject_reason = 'not_received'
  } else return o
  await db.prepare("UPDATE orders SET status = 'rejected', rejected_at = ?, reject_reason = ? WHERE id = ? AND status IN ('pending','waiting')")
    .bind(o.rejected_at, o.reject_reason, o.id).run()
  return o
}

async function markPaid(db: D1Database, orderId: string) {
  const now = Date.now()
  await db.prepare("UPDATE orders SET status = 'paid', paid_at = ? WHERE id = ? AND status IN ('pending','waiting')").bind(now, orderId).run()
}

const requireUser = (c: Context<Env>) => c.get('user')

app.get('/api/payment/config', (c) => c.json({
  simulator: isSimulator(c.env), paymentWindow: PAYMENT_WINDOW, verifyWindow: verifyWindow(c.env)
}))

app.post('/api/orders', async (c) => {
  const user = requireUser(c)
  if (!user) return c.json({ error: 'Silakan login terlebih dahulu.' }, 401)
  const b = await c.req.json().catch(() => ({} as any))
  const svc = SERVICES[b.service]
  const name = String(b.name || '').trim()
  const phone = String(b.phone || '').trim().replace(/[\s-]/g, '')
  if (!svc) return c.json({ error: 'Layanan tidak valid.' }, 400)
  if (!METHODS.includes(b.method)) return c.json({ error: 'Metode pembayaran tidak valid.' }, 400)
  if (name.length < 3) return c.json({ error: 'Nama minimal 3 karakter.' }, 400)
  if (!PHONE_RE.test(phone)) return c.json({ error: 'Nomor WhatsApp tidak valid.' }, 400)

  const db = c.env.DB
  // Batalkan tagihan aktif lama milik user ini untuk layanan yang sama
  await db.prepare("UPDATE orders SET status = 'cancelled' WHERE user_id = ? AND service = ? AND status = 'pending'").bind(user.id, b.service).run()

  // Kode unik 1..999 yang tidak bentrok dengan tagihan aktif lain (agar mutasi bisa dicocokkan otomatis)
  const now = Date.now()
  const active = await db.prepare(
    "SELECT unique_code FROM orders WHERE method = ? AND base_amount = ? AND status IN ('pending','waiting') AND (expires_at > ? OR verify_deadline > ?)"
  ).bind(b.method, svc.price, now, now).all<{ unique_code: number }>()
  const used = new Set((active.results || []).map((r) => r.unique_code))
  let code = 0
  for (let i = 0; i < 50 && !code; i++) { const k = 1 + Math.floor(Math.random() * 999); if (!used.has(k)) code = k }
  if (!code) return c.json({ error: 'Sistem sedang sibuk, coba lagi sebentar.' }, 503)

  const d = new Date(now + 7 * 3600 * 1000) // WIB
  const id = `LC${d.toISOString().slice(2, 10).replace(/-/g, '')}${randomHex(3).toUpperCase()}`
  await db.prepare(
    `INSERT INTO orders (id, user_id, service, service_name, customer_name, phone, method, base_amount, unique_code, amount, status, created_at, expires_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'pending', ?, ?)`
  ).bind(id, user.id, b.service, svc.name, name, phone, b.method, svc.price, code, svc.price + code, now, now + PAYMENT_WINDOW).run()

  const o = await db.prepare('SELECT * FROM orders WHERE id = ?').bind(id).first<OrderRow>()
  return c.json(orderJson(o!))
})

async function getOwnOrder(c: Context<Env>) {
  const user = requireUser(c)
  if (!user) return { err: c.json({ error: 'Silakan login terlebih dahulu.' }, 401) }
  const o = await c.env.DB.prepare('SELECT * FROM orders WHERE id = ? AND user_id = ?').bind(c.req.param('id'), user.id).first<OrderRow>()
  if (!o) return { err: c.json({ error: 'Tagihan tidak ditemukan.' }, 404) }
  return { o: await autoReject(c.env.DB, o) }
}

app.get('/api/orders/:id', async (c) => {
  const r = await getOwnOrder(c); if (r.err) return r.err
  return c.json(orderJson(r.o!))
})

// User klik "Saya Sudah Bayar" => sistem mulai cek dana. Jika tidak masuk dalam batas waktu => DITOLAK otomatis.
app.post('/api/orders/:id/confirm', async (c) => {
  const r = await getOwnOrder(c); if (r.err) return r.err
  const o = r.o!
  if (o.status === 'pending') {
    const now = Date.now()
    o.status = 'waiting'; o.confirmed_at = now; o.verify_deadline = now + verifyWindow(c.env)
    await c.env.DB.prepare("UPDATE orders SET status = 'waiting', confirmed_at = ?, verify_deadline = ? WHERE id = ? AND status = 'pending'")
      .bind(o.confirmed_at, o.verify_deadline, o.id).run()
  }
  return c.json(orderJson(o))
})

app.post('/api/orders/:id/cancel', async (c) => {
  const r = await getOwnOrder(c); if (r.err) return r.err
  const o = r.o!
  if (o.status === 'pending' || o.status === 'waiting') {
    await c.env.DB.prepare("UPDATE orders SET status = 'cancelled' WHERE id = ?").bind(o.id).run()
    o.status = 'cancelled'
  }
  return c.json(orderJson(o))
})

// MODE DEMO saja (aktif jika webhook mutasi belum dikonfigurasi)
app.post('/api/orders/:id/simulate-payment', async (c) => {
  if (!isSimulator(c.env)) return c.json({ error: 'Simulator nonaktif.' }, 403)
  const r = await getOwnOrder(c); if (r.err) return r.err
  const o = r.o!
  if (o.status === 'pending' || o.status === 'waiting') {
    await c.env.DB.prepare('INSERT INTO mutations (method, amount, description, order_id, raw, received_at) VALUES (?, ?, ?, ?, ?, ?)')
      .bind(o.method, o.amount, 'SIMULASI', o.id, null, Date.now()).run()
    await markPaid(c.env.DB, o.id)
  }
  const fresh = await c.env.DB.prepare('SELECT * FROM orders WHERE id = ?').bind(o.id).first<OrderRow>()
  return c.json(orderJson(fresh!))
})

app.post('/api/orders/:id/simulate-reject', async (c) => {
  if (!isSimulator(c.env)) return c.json({ error: 'Simulator nonaktif.' }, 403)
  const r = await getOwnOrder(c); if (r.err) return r.err
  const o = r.o!
  if (o.status === 'pending' || o.status === 'waiting') {
    await c.env.DB.prepare("UPDATE orders SET status = 'rejected', rejected_at = ?, reject_reason = 'not_received' WHERE id = ?").bind(Date.now(), o.id).run()
  }
  const fresh = await c.env.DB.prepare('SELECT * FROM orders WHERE id = ?').bind(o.id).first<OrderRow>()
  return c.json(orderJson(fresh!))
})

/* ------------------------------------------------------------
   WEBHOOK MUTASI REKENING (otomatis)
   Hubungkan ke penyedia cek mutasi (mis. Moota / Mutasibank / BukuWarung, dll).
   URL   : POST /api/webhooks/mutasi
   Auth  : header  "X-Webhook-Secret: <MUTASI_WEBHOOK_SECRET>"  atau  ?secret=<...>
   Body  : satu objek / array / { data: [...] } dengan field
           amount (wajib), type ("CR"/"credit" = dana masuk), method/bank ("bsi"/"gopay", opsional), description
   Dana masuk dengan nominal TEPAT (harga + kode unik) => tagihan otomatis "paid".
   ------------------------------------------------------------ */
app.post('/api/webhooks/mutasi', async (c) => {
  const secret = c.env.MUTASI_WEBHOOK_SECRET
  const given = c.req.header('x-webhook-secret') || c.req.query('secret') || ''
  if (!secret || given !== secret) return c.json({ error: 'unauthorized' }, 401)

  const body: any = await c.req.json().catch(() => null)
  if (!body) return c.json({ error: 'invalid json' }, 400)
  const list: any[] = Array.isArray(body) ? body : Array.isArray(body.data) ? body.data : Array.isArray(body.mutations) ? body.mutations : [body]

  const db = c.env.DB
  const results: any[] = []
  for (const m of list) {
    const amount = Math.round(Number(String(m.amount ?? m.nominal ?? '').toString().replace(/[^\d.]/g, '')))
    const type = String(m.type ?? m.mutation_type ?? 'CR').toUpperCase()
    if (!amount || !(type === 'CR' || type === 'CREDIT' || type === 'IN' || type === 'K')) { results.push({ amount, matched: false, reason: 'not_credit' }); continue }
    const rawMethod = String(m.method ?? m.bank ?? m.bank_type ?? m.channel ?? '').toLowerCase()
    const method = rawMethod.includes('gopay') || rawMethod.includes('gojek') ? 'gopay' : rawMethod.includes('bsi') || rawMethod.includes('syariah') ? 'bsi' : null
    const now = Date.now()

    const sql = `SELECT * FROM orders WHERE amount = ? AND status IN ('pending','waiting')
                 AND ((status = 'pending' AND expires_at >= ?) OR (status = 'waiting' AND verify_deadline >= ?))
                 ${method ? 'AND method = ?' : ''} ORDER BY created_at DESC LIMIT 1`
    const stmt = method ? db.prepare(sql).bind(amount, now, now, method) : db.prepare(sql).bind(amount, now, now)
    const o = await stmt.first<OrderRow>()
    await db.prepare('INSERT INTO mutations (method, amount, description, order_id, raw, received_at) VALUES (?, ?, ?, ?, ?, ?)')
      .bind(method, amount, String(m.description ?? m.note ?? ''), o?.id ?? null, JSON.stringify(m).slice(0, 2000), now).run()
    if (o) { await markPaid(db, o.id); results.push({ amount, matched: true, order: o.id }) }
    else results.push({ amount, matched: false, reason: 'no_active_order' })
  }
  return c.json({ ok: true, results })
})

app.notFound((c) => (c.req.path.startsWith('/api/') ? c.json({ error: 'Not found' }, 404) : c.redirect('/beranda')))

export default app
