// Generates a PNG receipt (struk) for an order using <canvas> — no external deps.
import { formatRupiah, payment } from '../data/content.js'

const C = { coffee: '#3B2418', cream: '#E8DCC8', beige: '#F5F0E8', muted: '#7a6457', line: '#e2d6c4' }
const W = 720
const PAD = 48

function wrap(ctx, text, maxWidth) {
  const words = String(text).split(/\s+/)
  const lines = []
  let line = ''
  words.forEach((w) => {
    const test = line ? `${line} ${w}` : w
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line)
      line = w
    } else line = test
  })
  if (line) lines.push(line)
  return lines
}

function draw(ctx, order, measureOnly = false) {
  const font = (w, s, f = 'Poppins') => `${w} ${s}px ${f}, Arial, sans-serif`
  let y = 0
  const method = payment.methods[order.method]

  // Header
  if (!measureOnly) {
    ctx.fillStyle = C.coffee
    ctx.fillRect(0, 0, W, 150)
    ctx.fillStyle = C.cream
    ctx.textAlign = 'center'
    ctx.font = font(700, 34, 'Montserrat')
    ctx.fillText('NOOK', W / 2, 62)
    ctx.font = font(400, 13)
    ctx.fillText('C O F F E E   B O U T I Q U E', W / 2, 86)
    ctx.font = font(600, 15, 'Montserrat')
    ctx.fillText('STRUK PEMBAYARAN', W / 2, 124)
  }
  y = 190

  const row = (label, value, opts = {}) => {
    ctx.font = font(400, 15)
    const maxV = W - PAD * 2 - 170
    ctx.font = font(opts.bold ? 600 : 500, 15)
    const lines = wrap(ctx, value, maxV)
    if (!measureOnly) {
      ctx.textAlign = 'left'
      ctx.fillStyle = C.muted
      ctx.font = font(400, 15)
      ctx.fillText(label, PAD, y)
      ctx.fillStyle = C.coffee
      ctx.font = font(opts.bold ? 600 : 500, 15)
      ctx.textAlign = 'right'
      lines.forEach((l, i) => ctx.fillText(l, W - PAD, y + i * 22))
    }
    y += lines.length * 22 + 10
  }
  const divider = (dashed = true) => {
    if (!measureOnly) {
      ctx.strokeStyle = C.line
      ctx.lineWidth = 1.5
      ctx.setLineDash(dashed ? [6, 6] : [])
      ctx.beginPath()
      ctx.moveTo(PAD, y)
      ctx.lineTo(W - PAD, y)
      ctx.stroke()
      ctx.setLineDash([])
    }
    y += 30
  }
  const title = (t) => {
    if (!measureOnly) {
      ctx.textAlign = 'left'
      ctx.fillStyle = C.coffee
      ctx.font = font(700, 13, 'Montserrat')
      ctx.fillText(t.toUpperCase(), PAD, y)
    }
    y += 30
  }

  row('No. Pesanan', order.id, { bold: true })
  row('Tanggal', order.dateLabel)
  row('Metode Bayar', method.name)
  if (order.method === 'bsi') row('No. Rekening', `BSI ${method.account}`)
  else row('Merchant', method.merchant)
  const STATUS_LABEL = { paid: 'Pembayaran diterima', rejected: 'Pembayaran ditolak', refunded: 'Dana dikembalikan' }
  row('Status', STATUS_LABEL[order.paymentStatus] || 'Menunggu verifikasi admin', { bold: true })
  divider()

  title('Data Pemesan')
  row('Nama', order.customer.name)
  row('Email', order.customer.email)
  row('No. Telp', order.customer.phone)
  row('Alamat', order.customer.address)
  divider()

  title('Detail Pesanan')
  order.items.forEach((it) => {
    ctx.font = font(500, 15)
    const nameLines = wrap(ctx, `${it.name} (${it.variantLabel})`, W - PAD * 2 - 180)
    if (!measureOnly) {
      ctx.textAlign = 'left'
      ctx.fillStyle = C.coffee
      nameLines.forEach((l, i) => ctx.fillText(l, PAD, y + i * 22))
      ctx.textAlign = 'right'
      ctx.font = font(600, 15)
      ctx.fillText(formatRupiah(it.subtotal), W - PAD, y)
    }
    y += nameLines.length * 22
    if (!measureOnly) {
      ctx.textAlign = 'left'
      ctx.fillStyle = C.muted
      ctx.font = font(400, 13)
      ctx.fillText(`${it.qty} × ${formatRupiah(it.price)}`, PAD, y)
    }
    y += 30
  })
  divider(false)

  // Total
  if (!measureOnly) {
    ctx.fillStyle = C.beige
    ctx.fillRect(PAD - 16, y - 34, W - PAD * 2 + 32, 62)
    ctx.textAlign = 'left'
    ctx.fillStyle = C.coffee
    ctx.font = font(600, 16, 'Montserrat')
    ctx.fillText('TOTAL PEMBAYARAN', PAD, y + 4)
    ctx.textAlign = 'right'
    ctx.font = font(700, 24, 'Montserrat')
    ctx.fillText(formatRupiah(order.total), W - PAD, y + 6)
    ctx.textAlign = 'left'
  }
  y += 52
  if (!measureOnly) {
    ctx.fillStyle = C.muted
    ctx.font = font(400, 12)
    ctx.fillText('* Ongkos kirim akan dikonfirmasi oleh admin melalui WhatsApp.', PAD, y)
  }
  y += 40

  // Footer note
  const note = `WAJIB kirim struk ini beserta bukti transfer ke WhatsApp ${payment.whatsappDisplay} agar pesanan segera diproses.`
  ctx.font = font(500, 14)
  const noteLines = wrap(ctx, note, W - PAD * 2 - 40)
  const boxH = noteLines.length * 22 + 36
  if (!measureOnly) {
    ctx.strokeStyle = C.coffee
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.roundRect(PAD, y - 6, W - PAD * 2, boxH, 14)
    ctx.stroke()
    ctx.textAlign = 'center'
    ctx.fillStyle = C.coffee
    noteLines.forEach((l, i) => ctx.fillText(l, W / 2, y + 22 + i * 22))
  }
  y += boxH + 40
  if (!measureOnly) {
    ctx.textAlign = 'center'
    ctx.fillStyle = C.muted
    ctx.font = font(400, 12)
    ctx.fillText('Terima kasih telah berbelanja di Nook Coffee Boutique ☕', W / 2, y)
    ctx.fillText('Instagram @nook.coffeeboutique', W / 2, y + 20)
  }
  y += 50
  return y
}

export async function createReceiptBlob(order) {
  try {
    await document.fonts?.ready
  } catch {
    /* ignore */
  }
  const scale = 2
  const probe = document.createElement('canvas').getContext('2d')
  const height = draw(probe, order, true)

  const canvas = document.createElement('canvas')
  canvas.width = W * scale
  canvas.height = height * scale
  const ctx = canvas.getContext('2d')
  ctx.scale(scale, scale)
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, W, height)
  draw(ctx, order)
  return new Promise((resolve) => canvas.toBlob(resolve, 'image/png'))
}

export async function downloadReceipt(order) {
  const blob = await createReceiptBlob(order)
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `Struk-${order.id}.png`
  document.body.appendChild(a)
  a.click()
  a.remove()
  setTimeout(() => URL.revokeObjectURL(url), 2000)
}

export function whatsappLink(order) {
  const method = payment.methods[order.method]
  const lines = [
    `Halo Nook Coffee, saya sudah melakukan pembayaran dan mohon diverifikasi.`,
    ``,
    `*No. Pesanan:* ${order.id}`,
    `*Nama:* ${order.customer.name}`,
    `*No. Telp:* ${order.customer.phone}`,
    `*Alamat:* ${order.customer.address}`,
    `*Metode:* ${method.name}`,
    ``,
    `*Pesanan:*`,
    ...order.items.map((it) => `- ${it.name} (${it.variantLabel}) x${it.qty} = ${formatRupiah(it.subtotal)}`),
    ``,
    `*Total:* ${formatRupiah(order.total)}`,
    ``,
    `Berikut saya lampirkan struk dan bukti transfer.`,
  ]
  return `https://wa.me/${payment.whatsapp}?text=${encodeURIComponent(lines.join('\n'))}`
}
