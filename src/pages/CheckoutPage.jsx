import { useEffect, useMemo, useState } from 'react'
import Icon from '../components/Icon.jsx'
import { useCart } from '../context/CartContext.jsx'
import { getProduct, getVariant, minQtyFor } from '../data/catalog.js'
import { formatRupiah, payment } from '../data/content.js'
import { downloadReceipt, whatsappLink } from '../utils/receipt.js'

const CUSTOMER_KEY = 'nook-checkout-customer'
const ORDER_KEY = 'nook-last-order'
const STEPS = [
  { id: 1, label: 'Data Pengiriman' },
  { id: 2, label: 'Pembayaran' },
  { id: 3, label: 'Selesai' },
]

const load = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback
  } catch {
    return fallback
  }
}
const save = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* ignore */
  }
}

const makeOrderId = () => {
  const d = new Date()
  const pad = (n) => String(n).padStart(2, '0')
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `NOOK-${d.getFullYear()}${pad(d.getMonth() + 1)}${pad(d.getDate())}-${rand}`
}

function copyText(text, done) {
  const fallback = () => {
    const ta = document.createElement('textarea')
    ta.value = text
    document.body.appendChild(ta)
    ta.select()
    document.execCommand('copy')
    ta.remove()
    done()
  }
  if (navigator.clipboard?.writeText) navigator.clipboard.writeText(text).then(done, fallback)
  else fallback()
}

function CopyButton({ value, label = 'Salin' }) {
  const [copied, setCopied] = useState(false)
  useEffect(() => {
    if (!copied) return
    const t = setTimeout(() => setCopied(false), 1600)
    return () => clearTimeout(t)
  }, [copied])
  return (
    <button
      type="button"
      onClick={() => copyText(value, () => setCopied(true))}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-coffee/25 px-3.5 py-1.5 text-xs font-medium text-coffee transition-colors hover:border-coffee hover:bg-coffee hover:text-cream"
    >
      <Icon name={copied ? 'check' : 'copy'} className="h-3.5 w-3.5" />
      {copied ? 'Tersalin' : label}
    </button>
  )
}

/* ---------------- Stepper ---------------- */
function Stepper({ step }) {
  return (
    <ol id="checkout-stepper" className="flex items-center gap-2 sm:gap-4" aria-label="Langkah checkout">
      {STEPS.map((s, i) => {
        const done = step > s.id
        const current = step === s.id
        return (
          <li key={s.id} className="flex flex-1 items-center gap-2 sm:gap-4">
            <span className="flex items-center gap-3">
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-heading text-sm font-semibold transition-colors duration-300 ${
                  done || current ? 'bg-coffee text-cream' : 'bg-cream text-coffee/50'
                } ${current ? 'ring-4 ring-coffee/15' : ''}`}
                aria-current={current ? 'step' : undefined}
              >
                {done ? <Icon name="check" className="h-5 w-5" strokeWidth={2} /> : s.id}
              </span>
              <span className={`hidden text-sm font-medium sm:block ${current || done ? 'text-coffee' : 'text-coffee/45'}`}>
                <span className="block text-[0.65rem] uppercase tracking-[0.2em] text-coffee/45">Step {s.id}</span>
                {s.label}
              </span>
            </span>
            {i < STEPS.length - 1 && <span className={`h-px flex-1 ${done ? 'bg-coffee' : 'bg-coffee/15'}`} />}
          </li>
        )
      })}
    </ol>
  )
}

/* ---------------- Order summary ---------------- */
function OrderSummary({ lines, total, editable, updateQty, removeItem }) {
  return (
    <aside id="order-summary" className="rounded-3xl bg-white/80 p-6 shadow-[0_20px_50px_-30px_rgba(59,36,24,0.45)] ring-1 ring-coffee/5 sm:p-7 lg:sticky lg:top-28">
      <h2 className="font-heading text-lg font-semibold text-coffee">Ringkasan Pesanan</h2>
      <ul className="mt-5 divide-y divide-coffee/10">
        {lines.map((l) => (
          <li key={l.key} className="flex gap-4 py-4 first:pt-0">
            <div className="min-w-0 flex-1">
              <p className="truncate font-heading text-sm font-semibold text-coffee">{l.name}</p>
              <p className="text-xs text-coffee/60">
                {l.variantLabel} · {formatRupiah(l.price)}
              </p>
              {editable ? (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex items-center rounded-full border border-coffee/15">
                    <button
                      type="button"
                      onClick={() => updateQty(l.key, l.qty - 1)}
                      disabled={l.qty <= l.minQty}
                      className="flex h-7 w-7 items-center justify-center rounded-full text-coffee hover:bg-beige disabled:opacity-30"
                      aria-label={`Kurangi ${l.name}`}
                    >
                      <Icon name="minus" className="h-3.5 w-3.5" />
                    </button>
                    <span className="w-7 text-center text-sm font-semibold">{l.qty}</span>
                    <button
                      type="button"
                      onClick={() => updateQty(l.key, l.qty + 1)}
                      className="flex h-7 w-7 items-center justify-center rounded-full text-coffee hover:bg-beige"
                      aria-label={`Tambah ${l.name}`}
                    >
                      <Icon name="plus" className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeItem(l.key)}
                    className="flex h-7 w-7 items-center justify-center rounded-full text-coffee/50 hover:bg-red-50 hover:text-red-600"
                    aria-label={`Hapus ${l.name}`}
                  >
                    <Icon name="trash" className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <p className="mt-1 text-xs text-coffee/60">Qty: {l.qty}</p>
              )}
            </div>
            <p className="shrink-0 text-sm font-semibold text-coffee">{formatRupiah(l.subtotal)}</p>
          </li>
        ))}
      </ul>
      <div className="mt-2 space-y-2 border-t border-coffee/10 pt-4 text-sm">
        <div className="flex justify-between text-coffee/70">
          <span>Subtotal</span>
          <span>{formatRupiah(total)}</span>
        </div>
        <div className="flex justify-between text-coffee/70">
          <span>Ongkos kirim</span>
          <span className="text-xs">Dikonfirmasi admin via WA</span>
        </div>
        <div className="flex items-end justify-between pt-2">
          <span className="font-heading font-semibold text-coffee">Total</span>
          <span className="font-heading text-2xl font-semibold text-coffee">{formatRupiah(total)}</span>
        </div>
      </div>
    </aside>
  )
}

/* ---------------- Step 1: customer data ---------------- */
const FIELDS = [
  { id: 'name', label: 'Nama Lengkap', type: 'text', placeholder: 'cth. Muhammad Fikri', autoComplete: 'name' },
  { id: 'email', label: 'Email', type: 'email', placeholder: 'nama@email.com', autoComplete: 'email' },
  { id: 'phone', label: 'No. Telepon / WhatsApp', type: 'tel', placeholder: '08xxxxxxxxxx', autoComplete: 'tel' },
]

function validate(c) {
  const e = {}
  if (!c.name.trim() || c.name.trim().length < 3) e.name = 'Nama lengkap wajib diisi (min. 3 huruf).'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(c.email.trim())) e.email = 'Masukkan alamat email yang valid.'
  const digits = c.phone.replace(/\D/g, '')
  if (!/^(0|62|\+62)/.test(c.phone.trim()) || digits.length < 10 || digits.length > 15)
    e.phone = 'Masukkan nomor telepon yang valid (cth. 0812xxxxxxx).'
  if (c.address.trim().length < 15) e.address = 'Alamat pengiriman wajib lengkap (jalan, kel/kec, kota, kode pos).'
  return e
}

function StepCustomer({ customer, setCustomer, onNext }) {
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState(false)

  const change = (id) => (ev) => {
    const next = { ...customer, [id]: ev.target.value }
    setCustomer(next)
    if (touched) setErrors(validate(next))
  }

  const submit = (ev) => {
    ev.preventDefault()
    setTouched(true)
    const e = validate(customer)
    setErrors(e)
    if (Object.keys(e).length === 0) onNext()
    else document.getElementById(`field-${Object.keys(e)[0]}`)?.focus()
  }

  const inputCls = (id) =>
    `mt-2 w-full rounded-2xl border bg-white px-4 py-3.5 text-sm text-coffee placeholder:text-coffee/35 outline-none transition focus:ring-4 ${
      errors[id] ? 'border-red-400 focus:ring-red-100' : 'border-coffee/15 focus:border-coffee focus:ring-coffee/10'
    }`

  return (
    <form id="step-customer" onSubmit={submit} noValidate className="rounded-3xl bg-white/80 p-6 ring-1 ring-coffee/5 sm:p-8">
      <h2 className="font-heading text-xl font-semibold text-coffee">Step 1 · Data Pengiriman</h2>
      <p className="mt-1 text-sm text-coffee/60">Lengkapi data di bawah ini untuk pengiriman pesanan Anda.</p>

      <div className="mt-7 grid gap-5 sm:grid-cols-2">
        {FIELDS.map((f) => (
          <div key={f.id} className={f.id === 'name' ? 'sm:col-span-2' : ''}>
            <label htmlFor={`field-${f.id}`} className="text-sm font-medium text-coffee">
              {f.label} <span className="text-red-500">*</span>
            </label>
            <input
              id={`field-${f.id}`}
              type={f.type}
              value={customer[f.id]}
              onChange={change(f.id)}
              placeholder={f.placeholder}
              autoComplete={f.autoComplete}
              aria-invalid={!!errors[f.id]}
              className={inputCls(f.id)}
              required
            />
            {errors[f.id] && <p className="mt-1.5 text-xs text-red-600">{errors[f.id]}</p>}
          </div>
        ))}
        <div className="sm:col-span-2">
          <label htmlFor="field-address" className="text-sm font-medium text-coffee">
            Alamat Pengiriman <span className="text-red-500">*</span>
          </label>
          <textarea
            id="field-address"
            rows={4}
            value={customer.address}
            onChange={change('address')}
            placeholder="Nama jalan, no. rumah, RT/RW, kelurahan, kecamatan, kota, provinsi, kode pos"
            autoComplete="street-address"
            aria-invalid={!!errors.address}
            className={`${inputCls('address')} resize-none`}
            required
          />
          {errors.address && <p className="mt-1.5 text-xs text-red-600">{errors.address}</p>}
        </div>
      </div>

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <a href="#/coffee" className="inline-flex items-center justify-center gap-2 py-2 text-sm font-medium text-coffee/70 hover:text-coffee">
          <Icon name="back" className="h-4 w-4" /> Lanjut belanja
        </a>
        <button
          type="submit"
          className="group inline-flex items-center justify-center gap-3 rounded-full bg-coffee px-8 py-4 text-sm font-medium text-cream transition-all duration-300 hover:-translate-y-0.5 hover:bg-coffee-light hover:shadow-[0_12px_30px_-10px_rgba(59,36,24,0.55)]"
        >
          Lanjut ke Pembayaran
          <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </form>
  )
}

/* ---------------- Step 2: payment method ---------------- */
function MethodCard({ m, selected, onSelect }) {
  const isGopay = m.id === 'gopay'
  return (
    <div
      className={`overflow-hidden rounded-3xl border-2 bg-white transition-all duration-300 ${
        selected ? 'border-coffee shadow-[0_20px_50px_-30px_rgba(59,36,24,0.6)]' : 'border-coffee/10 hover:border-coffee/30'
      }`}
    >
      <button type="button" onClick={onSelect} className="flex w-full items-center gap-4 p-5 text-left sm:p-6" aria-pressed={selected}>
        <span
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${
            isGopay ? 'bg-[#00AED6]/10 text-[#00AED6]' : 'bg-[#00A39D]/10 text-[#00A39D]'
          }`}
        >
          <Icon name={isGopay ? 'qr' : 'bank'} className="h-6 w-6" />
        </span>
        <span className="min-w-0 flex-1">
          <span className="block font-heading text-base font-semibold text-coffee">{m.name}</span>
          <span className="block text-xs text-coffee/60 sm:text-sm">{m.description}</span>
        </span>
        <span
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border-2 ${
            selected ? 'border-coffee bg-coffee text-cream' : 'border-coffee/25'
          }`}
        >
          {selected && <Icon name="check" className="h-3.5 w-3.5" strokeWidth={2.5} />}
        </span>
      </button>

      {/* How to pay */}
      <div className={`grid transition-[grid-template-rows] duration-500 ease-out ${selected ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'}`}>
        <div className="overflow-hidden">
          <div className="border-t border-coffee/10 bg-beige/60 px-5 py-5 sm:px-6">
            {isGopay ? (
              <p className="mb-4 text-xs text-coffee/70">
                Merchant: <strong className="text-coffee">{m.merchant}</strong> · NMID {m.nmid}
              </p>
            ) : (
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-white px-4 py-3 ring-1 ring-coffee/10">
                <div>
                  <p className="text-[0.65rem] uppercase tracking-[0.2em] text-coffee/50">No. Rekening BSI</p>
                  <p className="font-heading text-lg font-semibold tracking-wider text-coffee">{m.account}</p>
                </div>
                <CopyButton value={m.account} />
              </div>
            )}
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-coffee/60">Cara Pembayaran</p>
            <ol className="mt-3 space-y-2.5">
              {m.steps.map((s, i) => (
                <li key={i} className="flex gap-3 text-sm leading-relaxed text-coffee/80">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-coffee text-[0.7rem] font-semibold text-cream">
                    {i + 1}
                  </span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </div>
  )
}

function StepPayment({ method, setMethod, onBack, onPay, total }) {
  return (
    <section id="step-payment" className="rounded-3xl bg-white/80 p-6 ring-1 ring-coffee/5 sm:p-8">
      <h2 className="font-heading text-xl font-semibold text-coffee">Step 2 · Metode Pembayaran</h2>
      <p className="mt-1 text-sm text-coffee/60">Pilih salah satu metode pembayaran di bawah ini.</p>

      <div className="mt-7 space-y-4">
        {Object.values(payment.methods).map((m) => (
          <MethodCard key={m.id} m={m} selected={method === m.id} onSelect={() => setMethod(m.id)} />
        ))}
      </div>

      <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button type="button" onClick={onBack} className="inline-flex items-center justify-center gap-2 py-2 text-sm font-medium text-coffee/70 hover:text-coffee">
          <Icon name="back" className="h-4 w-4" /> Kembali ke data pengiriman
        </button>
        <button
          type="button"
          onClick={onPay}
          disabled={!method}
          className="group inline-flex items-center justify-center gap-3 rounded-full bg-coffee px-8 py-4 text-sm font-medium text-cream transition-all duration-300 hover:-translate-y-0.5 hover:bg-coffee-light hover:shadow-[0_12px_30px_-10px_rgba(59,36,24,0.55)] disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 disabled:hover:shadow-none"
        >
          {method ? `Bayar Sekarang · ${formatRupiah(total)}` : 'Pilih metode pembayaran'}
          <Icon name="arrow" className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>
    </section>
  )
}

/* ---------------- Payment pop-up ---------------- */
function PaymentModal({ method, total, orderId, onClose, onConfirm }) {
  const m = payment.methods[method]
  const isGopay = method === 'gopay'
  const [agree, setAgree] = useState(false)

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose()
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-coffee/60 backdrop-blur-sm sm:items-center sm:p-6" onClick={onClose}>
      <div
        id="payment-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="payment-modal-title"
        onClick={(e) => e.stopPropagation()}
        className="modal-panel max-h-[92vh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-beige shadow-2xl sm:rounded-3xl"
      >
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-coffee/10 bg-beige/95 px-6 py-4 backdrop-blur">
          <div>
            <p className="text-[0.65rem] uppercase tracking-[0.2em] text-coffee/50">{orderId}</p>
            <h3 id="payment-modal-title" className="font-heading text-lg font-semibold text-coffee">
              Bayar dengan {m.short}
            </h3>
          </div>
          <button type="button" onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-full text-coffee hover:bg-coffee/10" aria-label="Tutup">
            <Icon name="close" className="h-5 w-5" />
          </button>
        </header>

        <div className="space-y-5 px-6 py-6">
          {/* Amount */}
          <div className="flex items-center justify-between gap-3 rounded-2xl bg-coffee px-5 py-4 text-cream">
            <div>
              <p className="text-[0.65rem] uppercase tracking-[0.2em] text-cream/60">Total Pembayaran</p>
              <p className="font-heading text-2xl font-semibold">{formatRupiah(total)}</p>
            </div>
            <button
              type="button"
              onClick={() => copyText(String(total), () => {})}
              className="rounded-full border border-cream/30 px-3.5 py-1.5 text-xs font-medium hover:bg-cream hover:text-coffee"
            >
              Salin nominal
            </button>
          </div>

          {isGopay ? (
            <div className="text-center">
              <img src={m.qr} alt={`QRIS GoPay Merchant ${m.merchant}`} className="mx-auto w-full max-w-[19rem] rounded-2xl shadow-[0_20px_40px_-25px_rgba(59,36,24,0.6)]" />
              <a
                href={m.qr}
                download="QRIS-Nook-Coffee.png"
                className="mt-4 inline-flex items-center gap-2 rounded-full border border-coffee/25 px-4 py-2 text-xs font-medium text-coffee hover:border-coffee hover:bg-coffee hover:text-cream"
              >
                <Icon name="download" className="h-4 w-4" /> Unduh QRIS
              </a>
            </div>
          ) : (
            <div className="rounded-2xl bg-white p-5 ring-1 ring-coffee/10">
              <p className="text-xs text-coffee/60">{m.bank}</p>
              <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                <p className="font-heading text-2xl font-semibold tracking-[0.15em] text-coffee">{m.account}</p>
                <CopyButton value={m.account} label="Salin No. Rek" />
              </div>
            </div>
          )}

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-coffee/60">Cara Pembayaran</p>
            <ol className="mt-3 space-y-2">
              {m.steps.slice(1).map((s, i) => (
                <li key={i} className="flex gap-3 text-sm leading-relaxed text-coffee/80">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-coffee/10 text-[0.65rem] font-semibold text-coffee">{i + 1}</span>
                  <span>{s}</span>
                </li>
              ))}
            </ol>
          </div>

          <label className="flex cursor-pointer items-start gap-3 rounded-2xl bg-white p-4 text-sm text-coffee/80 ring-1 ring-coffee/10">
            <input type="checkbox" checked={agree} onChange={(e) => setAgree(e.target.checked)} className="mt-0.5 h-4 w-4 accent-[#3B2418]" />
            <span>
              Saya sudah melakukan transfer sebesar <strong className="text-coffee">{formatRupiah(total)}</strong> dan akan mengirim struk + bukti transfer ke WhatsApp {payment.whatsappDisplay}.
            </span>
          </label>

          <button
            type="button"
            onClick={onConfirm}
            disabled={!agree}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-coffee px-8 py-4 text-sm font-medium text-cream transition-all hover:bg-coffee-light disabled:cursor-not-allowed disabled:opacity-45"
          >
            <Icon name="check" className="h-5 w-5" /> Saya Sudah Bayar
          </button>
        </div>
      </div>
    </div>
  )
}

/* ---------------- Step 3: done ---------------- */
function StepDone({ order, onNewOrder }) {
  const [downloading, setDownloading] = useState(false)
  const [downloaded, setDownloaded] = useState(false)
  const m = payment.methods[order.method]

  const handleDownload = async () => {
    setDownloading(true)
    try {
      await downloadReceipt(order)
      setDownloaded(true)
    } finally {
      setDownloading(false)
    }
  }

  return (
    <section id="step-done" className="mx-auto max-w-2xl rounded-3xl bg-white/80 p-6 text-center ring-1 ring-coffee/5 sm:p-10">
      <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-coffee text-cream ring-8 ring-coffee/10">
        <Icon name="check" className="h-10 w-10" strokeWidth={2} />
      </span>
      <h2 className="mt-6 font-heading text-2xl font-semibold text-coffee sm:text-3xl">Pesanan Berhasil Dibuat!</h2>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-coffee/65">
        Terima kasih, {order.customer.name.split(' ')[0]}. Silakan unduh struk pesanan di bawah ini lalu kirimkan ke WhatsApp kami.
      </p>

      <dl className="mt-8 grid gap-3 rounded-2xl bg-beige p-5 text-left text-sm sm:grid-cols-2">
        <div>
          <dt className="text-xs text-coffee/55">No. Pesanan</dt>
          <dd className="font-heading font-semibold text-coffee">{order.id}</dd>
        </div>
        <div>
          <dt className="text-xs text-coffee/55">Tanggal</dt>
          <dd className="font-medium text-coffee">{order.dateLabel}</dd>
        </div>
        <div>
          <dt className="text-xs text-coffee/55">Metode Pembayaran</dt>
          <dd className="font-medium text-coffee">{m.name}</dd>
        </div>
        <div>
          <dt className="text-xs text-coffee/55">Total</dt>
          <dd className="font-heading text-lg font-semibold text-coffee">{formatRupiah(order.total)}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="text-xs text-coffee/55">Dikirim ke</dt>
          <dd className="font-medium text-coffee">{order.customer.address}</dd>
        </div>
      </dl>

      <div className="mt-6 rounded-2xl border-2 border-dashed border-coffee/30 p-5 text-left">
        <p className="flex items-center gap-2 font-heading text-sm font-semibold text-coffee">
          <Icon name="whatsapp" className="h-5 w-5" /> WAJIB: Kirim struk ke WhatsApp
        </p>
        <ol className="mt-3 space-y-1.5 text-sm text-coffee/75">
          <li>1. Klik <strong>"Download Struk"</strong> untuk menyimpan struk pesanan.</li>
          <li>2. Klik <strong>"Kirim ke WhatsApp"</strong> — chat ke {payment.whatsappDisplay} akan terbuka.</li>
          <li>3. Lampirkan struk + bukti transfer, lalu kirim. Pesanan diproses setelah admin memverifikasi.</li>
        </ol>
      </div>

      <div className="mt-6 grid gap-3 sm:grid-cols-2">
        <button
          id="download-receipt"
          type="button"
          onClick={handleDownload}
          disabled={downloading}
          className="inline-flex items-center justify-center gap-2 rounded-full bg-coffee px-6 py-4 text-sm font-medium text-cream transition-all hover:-translate-y-0.5 hover:bg-coffee-light disabled:opacity-60"
        >
          <Icon name={downloaded ? 'check' : 'download'} className="h-5 w-5" />
          {downloading ? 'Menyiapkan…' : downloaded ? 'Struk Terunduh' : 'Download Struk'}
        </button>
        <a
          id="send-whatsapp"
          href={whatsappLink(order)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-[#25D366] px-6 py-4 text-sm font-medium text-white transition-all hover:-translate-y-0.5 hover:brightness-95"
        >
          <Icon name="whatsapp" className="h-5 w-5" /> Kirim ke WhatsApp
        </a>
      </div>

      <button type="button" onClick={onNewOrder} className="mt-6 text-sm font-medium text-coffee/60 underline-offset-4 hover:text-coffee hover:underline">
        Belanja lagi
      </button>
    </section>
  )
}

/* ---------------- Page ---------------- */
export default function CheckoutPage() {
  const { items, updateQty, removeItem, clearCart } = useCart()
  const [order, setOrder] = useState(() => load(ORDER_KEY, null))
  const [step, setStep] = useState(() => (load(ORDER_KEY, null) ? 3 : 1))
  const [customer, setCustomer] = useState(() => ({ name: '', email: '', phone: '', address: '', ...load(CUSTOMER_KEY, {}) }))
  const [method, setMethod] = useState(null)
  const [modalOpen, setModalOpen] = useState(false)
  const [pendingId, setPendingId] = useState(null)

  useEffect(() => save(CUSTOMER_KEY, customer), [customer])
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [step])

  const lines = useMemo(
    () =>
      items
        .map((i) => {
          const p = getProduct(i.id)
          if (!p || p.prices[i.variant] == null) return null
          const price = p.prices[i.variant]
          return {
            key: i.key,
            name: p.name,
            variantLabel: getVariant(i.variant)?.label || i.variant,
            price,
            qty: i.qty,
            minQty: minQtyFor(i.variant),
            subtotal: price * i.qty,
          }
        })
        .filter(Boolean),
    [items]
  )
  const total = lines.reduce((s, l) => s + l.subtotal, 0)

  const openPayment = () => {
    if (!method) return
    setPendingId((id) => id || makeOrderId())
    setModalOpen(true)
  }

  const confirmPaid = () => {
    const now = new Date()
    const newOrder = {
      id: pendingId || makeOrderId(),
      createdAt: now.toISOString(),
      dateLabel: now.toLocaleString('id-ID', { dateStyle: 'long', timeStyle: 'short' }),
      customer: { ...customer, name: customer.name.trim(), email: customer.email.trim(), phone: customer.phone.trim(), address: customer.address.trim() },
      method,
      items: lines.map(({ name, variantLabel, price, qty, subtotal }) => ({ name, variantLabel, price, qty, subtotal })),
      total,
    }
    save(ORDER_KEY, newOrder)
    setOrder(newOrder)
    setModalOpen(false)
    clearCart()
    setStep(3)
  }

  const newOrder = () => {
    try {
      localStorage.removeItem(ORDER_KEY)
    } catch {
      /* ignore */
    }
    window.location.hash = '#/coffee'
  }

  const emptyCart = step < 3 && lines.length === 0

  return (
    <section id="checkout-page" className="min-h-screen bg-beige px-5 pb-24 pt-28 sm:px-8 sm:pt-32">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10">
          <span className="inline-flex items-center gap-3 text-xs font-medium uppercase tracking-[0.3em] text-coffee/60">
            <span className="h-px w-8 bg-coffee/40" /> Checkout
          </span>
          <h1 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-coffee sm:text-4xl">Pembayaran</h1>
        </header>

        {emptyCart ? (
          <div id="empty-cart" className="flex flex-col items-center rounded-3xl bg-white/80 px-6 py-20 text-center ring-1 ring-coffee/5">
            <span className="flex h-16 w-16 items-center justify-center rounded-full bg-cream text-coffee">
              <Icon name="bag" className="h-8 w-8" />
            </span>
            <h2 className="mt-5 font-heading text-xl font-semibold text-coffee">Keranjang Anda masih kosong</h2>
            <p className="mt-2 max-w-sm text-sm text-coffee/60">Pilih kopi favorit Anda terlebih dahulu, lalu lanjutkan ke pembayaran.</p>
            <a href="#/coffee" className="mt-7 inline-flex items-center gap-2 rounded-full bg-coffee px-7 py-3.5 text-sm font-medium text-cream hover:bg-coffee-light">
              Belanja Sekarang <Icon name="arrow" className="h-4 w-4" />
            </a>
          </div>
        ) : (
          <>
            <div className="mb-10">
              <Stepper step={step} />
            </div>

            {step === 3 && order ? (
              <StepDone order={order} onNewOrder={newOrder} />
            ) : (
              <div className="grid gap-8 lg:grid-cols-[1fr_24rem]">
                <div>
                  {step === 1 && <StepCustomer customer={customer} setCustomer={setCustomer} onNext={() => setStep(2)} />}
                  {step === 2 && (
                    <StepPayment method={method} setMethod={setMethod} onBack={() => setStep(1)} onPay={openPayment} total={total} />
                  )}
                </div>
                <OrderSummary lines={lines} total={total} editable={step === 1} updateQty={updateQty} removeItem={removeItem} />
              </div>
            )}
          </>
        )}
      </div>

      {modalOpen && (
        <PaymentModal method={method} total={total} orderId={pendingId} onClose={() => setModalOpen(false)} onConfirm={confirmPaid} />
      )}
    </section>
  )
}
