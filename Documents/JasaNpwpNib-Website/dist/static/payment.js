/* =========================================================
   LegalCraft — Halaman Pembayaran (BSI VA & GoPay)
   Alur:
   1. Buat tagihan (nominal = harga + KODE UNIK, berlaku 10 menit)
   2. User transfer -> klik "Saya Sudah Bayar"
   3. Status "Menunggu Konfirmasi" -> sistem cek dana masuk otomatis (polling)
   4. Dana masuk (webhook mutasi rekening) -> OTOMATIS popup "Pembayaran Berhasil" + struk
   5. Dana TIDAK masuk sampai batas waktu verifikasi -> OTOMATIS DITOLAK (popup gagal)
      (tidak perlu konfirmasi manual dari admin)
   ========================================================= */
(function () {
  'use strict';

  const WA_NUMBER = '6287797890306';
  const SERVICES = {
    npwp: { name: 'Pengurusan NPWP', price: 149000, oldPrice: 399000, icon: 'fa-id-card' },
    nib:  { name: 'Pengurusan NIB', price: 149000, oldPrice: 399000, icon: 'fa-barcode' },
    pt:   { name: 'Pendirian PT Perorangan', price: 499000, oldPrice: 899000, icon: 'fa-building' }
  };
  const METHODS = {
    bsi: {
      title: 'BSI Virtual Account', sub: 'Bank Syariah Indonesia', label: 'Nomor Rekening / VA BSI',
      account: '7268050897', logo: '/static/img/bsi.png', receiptName: 'BSI Virtual Account',
      howto: [
        { t: 'BSI Mobile (BYOND by BSI)', s: ['Buka aplikasi <b>BSI Mobile / BYOND</b> lalu login.', 'Pilih menu <b>Transfer</b> → <b>Antar Rekening BSI</b>.', 'Masukkan nomor rekening <b>7268050897</b>.', 'Masukkan nominal <b>tepat sesuai total tagihan (termasuk kode unik)</b>.', 'Periksa nama penerima, lalu konfirmasi dengan PIN.', 'Kembali ke halaman ini dan klik <b>Saya Sudah Bayar</b>.'] },
        { t: 'ATM BSI', s: ['Masukkan kartu ATM & PIN.', 'Pilih <b>Menu Lainnya</b> → <b>Transfer</b> → <b>Rekening BSI</b>.', 'Masukkan nomor rekening <b>7268050897</b>.', 'Masukkan nominal <b>persis</b> sesuai tagihan, lalu konfirmasi.', 'Klik <b>Saya Sudah Bayar</b> di halaman ini.'] },
        { t: 'Dari Bank Lain (m-Banking)', s: ['Buka m-banking bank kamu, pilih <b>Transfer Antar Bank</b>.', 'Pilih bank tujuan <b>Bank Syariah Indonesia (451)</b>.', 'Masukkan nomor rekening <b>7268050897</b>.', 'Masukkan nominal <b>persis</b> sesuai tagihan, konfirmasi transaksi.', 'Kembali ke halaman ini dan klik <b>Saya Sudah Bayar</b>.'] }
      ]
    },
    gopay: {
      title: 'GoPay', sub: 'E-Wallet', label: 'Nomor GoPay Tujuan',
      account: '087797890306', logo: '/static/img/gopay.png', receiptName: 'GoPay',
      howto: [
        { t: 'Aplikasi Gojek / GoPay', s: ['Buka aplikasi <b>Gojek</b> atau <b>GoPay</b>.', 'Ketuk <b>Bayar</b> / <b>Kirim</b> → pilih <b>Ke nomor HP</b>.', 'Masukkan nomor <b>087797890306</b>.', 'Masukkan nominal <b>tepat sesuai total tagihan (termasuk kode unik)</b>.', 'Konfirmasi dengan PIN GoPay.', 'Kembali ke halaman ini dan klik <b>Saya Sudah Bayar</b>.'] },
        { t: 'Top Up dari m-Banking ke GoPay', s: ['Buka m-banking, pilih menu <b>E-Wallet / Top Up</b> → <b>GoPay</b>.', 'Masukkan nomor <b>087797890306</b>.', 'Masukkan nominal <b>persis</b> sesuai tagihan dan konfirmasi.', 'Kembali ke halaman ini dan klik <b>Saya Sudah Bayar</b>.'] }
      ]
    }
  };
  const PAYMENT_WINDOW = 10 * 60 * 1000;
  const POLL_PENDING = 10000; // cek diam-diam saat user belum klik "sudah bayar"
  const POLL_WAITING = 5000;  // cek lebih sering saat menunggu konfirmasi
  const STORE_KEY = 'legalcraft_active_order';

  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const rp = (n) => 'Rp' + Number(n).toLocaleString('id-ID');
  const fmtDate = (ms) => new Date(ms).toLocaleString('id-ID', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/\./g, ':');
  const fmtTime = (ms) => new Date(ms).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', second: '2-digit' }).replace(/\./g, ':');

  const params = new URLSearchParams(location.search);
  const state = { order: null, clockSkew: 0, timerId: null, waitTimerId: null, pollId: null, pollEvery: 0, simulator: false, successShown: false, failedShown: false };

  fetch('/api/payment/config').then((r) => r.json()).then((c) => { state.simulator = !!c.simulator; syncSim(); }).catch(() => {});
  const syncSim = () => { const b = $('#sim-box'); if (b) b.hidden = !(state.simulator && state.order && state.order.status === 'waiting'); };

  /* ---------- Ringkasan ---------- */
  const selService = $('#p-service');
  Object.entries(SERVICES).forEach(([k, s]) => {
    const o = document.createElement('option'); o.value = k; o.textContent = `${s.name} — ${rp(s.price)}`; selService.appendChild(o);
  });
  selService.value = SERVICES[params.get('layanan')] ? params.get('layanan') : 'npwp';

  const renderSummary = (key, order) => {
    const s = SERVICES[key];
    $('#sum-name').textContent = s.name;
    $('#sum-icon').className = 'fa-solid ' + s.icon;
    $('#sum-old').textContent = rp(s.oldPrice);
    $('#sum-disc').textContent = '-' + rp(s.oldPrice - s.price);
    $('#sum-total').textContent = rp(order ? order.amount : s.price);
    let codeRow = $('#sum-code-row');
    if (order && order.uniqueCode) {
      if (!codeRow) {
        codeRow = document.createElement('div'); codeRow.id = 'sum-code-row';
        codeRow.innerHTML = '<dt>Kode unik</dt><dd id="sum-code"></dd>';
        $('.sum-total').before(codeRow);
      }
      $('#sum-code').textContent = '+' + rp(order.uniqueCode);
    } else if (codeRow) codeRow.remove();
  };
  selService.addEventListener('change', () => renderSummary(selService.value));
  renderSummary(selService.value);

  const setStep = (n) => {
    [1, 2, 3, 4].forEach((i) => { $('#step-' + i).hidden = i !== n; });
    $$('#pay-stepper li').forEach((li) => {
      const s = Number(li.dataset.step);
      li.classList.toggle('active', s === n && n !== 4);
      li.classList.toggle('done', s < n || (n === 4 && s === 4));
    });
    selService.disabled = n !== 1;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const toast = (msg) => {
    const t = $('#toast'); t.textContent = msg; t.classList.add('show');
    clearTimeout(toast._t); toast._t = setTimeout(() => t.classList.remove('show'), 2400);
  };

  /* ---------- API helper ---------- */
  const api = async (url, opts = {}) => {
    const res = await fetch(url, { headers: { 'Content-Type': 'application/json' }, credentials: 'same-origin', ...opts });
    const data = await res.json().catch(() => ({}));
    if (res.status === 401) { location.href = '/login?next=' + encodeURIComponent(location.pathname + location.search); throw new Error('Silakan login terlebih dahulu.'); }
    if (!res.ok) throw new Error(data.error || 'Terjadi kesalahan, coba lagi.');
    if (data.serverTime) state.clockSkew = data.serverTime - Date.now();
    return data;
  };

  /* ---------- STEP 1 ---------- */
  const form = $('#step-1');
  fetch('/api/auth/me', { credentials: 'same-origin' }).then((r) => r.ok ? r.json() : null).then((d) => {
    if (!d || !d.user) return;
    if (!form.elements.name.value) form.elements.name.value = d.user.name || '';
    if (!form.elements.phone.value) form.elements.phone.value = d.user.phone || '';
  }).catch(() => {});
  const setErr = (f, m) => { const el = $(`[data-error-for="${f}"]`); el.textContent = m; const g = el.closest('.form-group'); if (g) g.classList.add('has-error'); };
  const clrErr = (f) => { const el = $(`[data-error-for="${f}"]`); el.textContent = ''; const g = el.closest('.form-group'); if (g) g.classList.remove('has-error'); };
  ['name', 'phone'].forEach((f) => form.elements[f].addEventListener('input', () => clrErr(f)));
  $$('input[name="method"]').forEach((r) => r.addEventListener('change', () => clrErr('method')));
  if (params.get('metode') && METHODS[params.get('metode')]) $(`input[name="method"][value="${params.get('metode')}"]`).checked = true;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const d = {
      service: selService.value,
      name: form.elements.name.value.trim(),
      phone: form.elements.phone.value.trim(),
      method: (form.querySelector('input[name="method"]:checked') || {}).value
    };
    ['name', 'phone', 'method'].forEach(clrErr);
    let ok = true;
    if (d.name.length < 3) { setErr('name', 'Nama lengkap minimal 3 karakter.'); ok = false; }
    if (!/^(\+62|62|0)8[0-9]{7,12}$/.test(d.phone.replace(/[\s-]/g, ''))) { setErr('phone', 'Nomor WhatsApp tidak valid. Contoh: 081234567890'); ok = false; }
    if (!d.method) { setErr('method', 'Pilih salah satu metode pembayaran.'); ok = false; }
    if (!ok) return;

    const btn = $('#btn-create'); btn.disabled = true; btn.innerHTML = '<span class="spinner" style="width:18px;height:18px;border-width:3px"></span> Membuat tagihan…';
    $('#step1-error').hidden = true;
    try {
      const order = await api('/api/orders', { method: 'POST', body: JSON.stringify(d) });
      openOrder(order);
    } catch (err) {
      $('#step1-error').textContent = err.message; $('#step1-error').hidden = false;
    } finally {
      btn.disabled = false; btn.innerHTML = '<i class="fa-solid fa-lock"></i> Lanjut Bayar';
    }
  });

  /* ---------- STEP 2 ---------- */
  const renderHowto = (m) => {
    const list = $('#howto-list');
    list.innerHTML = m.howto.map((h, i) => `
      <div class="howto-item${i === 0 ? ' open' : ''}">
        <button type="button" class="howto-q" aria-expanded="${i === 0}">${h.t}<i class="fa-solid fa-chevron-down"></i></button>
        <div class="howto-a"><ol>${h.s.map((x) => `<li><span>${x}</span></li>`).join('')}</ol></div>
      </div>`).join('');
    $$('.howto-item', list).forEach((item) => {
      const a = $('.howto-a', item);
      if (item.classList.contains('open')) requestAnimationFrame(() => { a.style.maxHeight = a.scrollHeight + 'px'; });
      $('.howto-q', item).addEventListener('click', () => {
        const open = !item.classList.contains('open');
        $$('.howto-item', list).forEach((o) => { o.classList.remove('open'); $('.howto-a', o).style.maxHeight = '0px'; $('.howto-q', o).setAttribute('aria-expanded', 'false'); });
        if (open) { item.classList.add('open'); a.style.maxHeight = a.scrollHeight + 'px'; $('.howto-q', item).setAttribute('aria-expanded', 'true'); }
      });
    });
  };

  const openOrder = (order) => {
    state.order = order; state.successShown = state.successShown && order.status === 'paid'; state.failedShown = false;
    const m = METHODS[order.method];
    selService.value = order.service; renderSummary(order.service, order);
    $('#sum-order').hidden = false; $('#sum-order-id').textContent = order.id;

    $('#va-logo').src = m.logo; $('#va-logo').alt = m.title;
    $('#va-title').textContent = m.title; $('#va-sub').textContent = m.sub;
    $('#va-label').textContent = m.label; $('#va-number').textContent = m.account;
    $('#va-amount').innerHTML = amountHTML(order.amount);
    $('#va-base').textContent = rp(order.baseAmount);
    $('#va-code').textContent = '+' + rp(order.uniqueCode);
    $('#copy-amount').dataset.copyRaw = String(order.amount);
    $('#deadline-text').textContent = fmtDate(order.expiresAt) + ' WIB';
    renderHowto(m);
    handleStatus(order);
  };

  // Sorot 3 digit terakhir (kode unik) agar user tidak salah transfer
  const amountHTML = (n) => {
    const s = rp(n); return `${s.slice(0, -3)}<span class="code-hl">${s.slice(-3)}</span>`;
  };

  const handleStatus = (order) => {
    const prev = state.order && state.order.status;
    state.order = order;
    if (['pending', 'waiting'].includes(order.status)) localStorage.setItem(STORE_KEY, order.id);
    else localStorage.removeItem(STORE_KEY);

    if (order.status === 'paid') {
      stopAll(); setStep(4);
      if (!state.successShown) { state.successShown = true; showSuccess(order); }
      return;
    }
    if (['rejected', 'expired', 'cancelled'].includes(order.status)) {
      stopAll();
      if (!state.failedShown) { state.failedShown = true; showFailed(order, prev); }
      return;
    }

    if (order.status === 'waiting') { stopTimer(); renderWaiting(order); setStep(3); startWaitTimer(); startPoll(POLL_WAITING); syncSim(); return; }

    // pending
    setStep(2);
    if (!state.timerId) startTimer();
    startPoll(POLL_PENDING); // dana bisa masuk walau user belum klik "sudah bayar"
  };

  const startTimer = () => {
    const ring = $('#timer-ring'); const C = 119.4;
    const tick = () => {
      if (!state.order || state.order.status !== 'pending') return stopTimer();
      const left = Math.max(0, state.order.expiresAt - (Date.now() + state.clockSkew));
      const mm = String(Math.floor(left / 60000)).padStart(2, '0');
      const ss = String(Math.floor(left / 1000) % 60).padStart(2, '0');
      $('#timer').textContent = `${mm}:${ss}`;
      ring.style.strokeDashoffset = String(C * (1 - left / PAYMENT_WINDOW));
      $('#timer-box').classList.toggle('urgent', left <= 60000);
      if (left <= 0) { stopTimer(); poll(); }
    };
    tick(); state.timerId = setInterval(tick, 1000);
  };
  const stopTimer = () => { clearInterval(state.timerId); state.timerId = null; };

  const poll = async () => {
    if (!state.order) return;
    try {
      const o = await api('/api/orders/' + encodeURIComponent(state.order.id));
      $('#w-last').textContent = fmtTime(Date.now());
      handleStatus(o);
    } catch (_) { /* jaringan: coba lagi di interval berikut */ }
  };
  const startPoll = (every) => {
    if (state.pollId && state.pollEvery === every) return;
    clearInterval(state.pollId); state.pollEvery = every; state.pollId = setInterval(poll, every);
  };
  const stopAll = () => { stopTimer(); stopWaitTimer(); clearInterval(state.pollId); state.pollId = null; state.pollEvery = 0; };

  // Hitung mundur batas verifikasi: jika habis & dana belum masuk, server menolak otomatis
  const startWaitTimer = () => {
    if (state.waitTimerId) return;
    const tick = () => {
      const o = state.order;
      if (!o || o.status !== 'waiting' || !o.verifyDeadline) return stopWaitTimer();
      const left = Math.max(0, o.verifyDeadline - (Date.now() + state.clockSkew));
      const mm = String(Math.floor(left / 60000)).padStart(2, '0');
      const ss = String(Math.floor(left / 1000) % 60).padStart(2, '0');
      const el = $('#w-deadline');
      if (el) { el.textContent = `${mm}:${ss} lagi`; el.classList.toggle('urgent', left <= 60000); }
      if (left <= 0) { stopWaitTimer(); poll(); }
    };
    tick(); state.waitTimerId = setInterval(tick, 1000);
  };
  const stopWaitTimer = () => { clearInterval(state.waitTimerId); state.waitTimerId = null; };
  // Cek segera ketika user kembali ke tab (mis. setelah transfer di aplikasi bank)
  document.addEventListener('visibilitychange', () => { if (!document.hidden && state.pollId) poll(); });

  /* ---------- STEP 3: Menunggu Konfirmasi ---------- */
  const renderWaiting = (o) => {
    const m = METHODS[o.method];
    $('#w-id').textContent = o.id;
    $('#w-method').textContent = `${m.title} • ${m.account}`;
    $('#w-amount').textContent = rp(o.amount);
    $('#w-time').textContent = fmtDate(o.confirmedAt || Date.now()) + ' WIB';
    if ($('#w-last').textContent === '-') $('#w-last').textContent = fmtTime(Date.now());
    const help = [
      'Halo Admin LegalCraft, saya sudah melakukan transfer namun status pembayaran saya masih "Menunggu Konfirmasi".', '',
      `ID Transaksi: ${o.id}`, `Nama: ${o.customerName}`, `Layanan: ${o.serviceName}`,
      `Metode: ${m.receiptName}`, `Nominal ditransfer: ${rp(o.amount)}`, '',
      'Mohon bantuannya untuk dicek. Terima kasih.'
    ].join('\n');
    $('#btn-wait-help').href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(help)}`;
  };

  $('#btn-paid').addEventListener('click', async () => {
    const o = state.order; const m = METHODS[o.method];
    if (!confirm(`Pastikan kamu SUDAH transfer TEPAT ${rp(o.amount)} ke ${m.title} ${m.account}.\n\nSistem akan memverifikasi otomatis begitu dana masuk. Lanjutkan?`)) return;
    const btn = $('#btn-paid'); btn.disabled = true;
    try { handleStatus(await api(`/api/orders/${encodeURIComponent(o.id)}/confirm`, { method: 'POST' })); }
    catch (err) { toast(err.message); }
    finally { btn.disabled = false; }
  });

  $('#btn-check-now').addEventListener('click', async () => {
    const b = $('#btn-check-now'); b.disabled = true; b.innerHTML = '<span class="spinner sm"></span> Mengecek…';
    await poll();
    if (state.order && state.order.status === 'waiting') toast('Dana belum terdeteksi. Sistem akan terus mengecek otomatis.');
    b.disabled = false; b.innerHTML = '<i class="fa-solid fa-arrows-rotate"></i> Cek Status Sekarang';
  });

  $('#btn-simulate').addEventListener('click', async () => {
    const b = $('#btn-simulate'); b.disabled = true;
    try { handleStatus(await api(`/api/orders/${encodeURIComponent(state.order.id)}/simulate-payment`, { method: 'POST' })); }
    catch (err) { toast(err.message); }
    finally { b.disabled = false; }
  });

  $('#btn-simulate-reject').addEventListener('click', async () => {
    const b = $('#btn-simulate-reject'); b.disabled = true;
    try { handleStatus(await api(`/api/orders/${encodeURIComponent(state.order.id)}/simulate-reject`, { method: 'POST' })); }
    catch (err) { toast(err.message); }
    finally { b.disabled = false; }
  });

  $('#btn-change').addEventListener('click', async () => {
    if (!confirm('Batalkan tagihan ini dan pilih metode lain?')) return;
    await api(`/api/orders/${encodeURIComponent(state.order.id)}/cancel`, { method: 'POST' }).catch(() => {});
    stopAll(); localStorage.removeItem(STORE_KEY); state.order = null;
    $('#sum-order').hidden = true; renderSummary(selService.value); setStep(1);
  });

  // Copy
  document.addEventListener('click', async (e) => {
    const b = e.target.closest('.copy-btn'); if (!b) return;
    const text = b.dataset.copyTarget ? $('#' + b.dataset.copyTarget).textContent.trim() : b.dataset.copyRaw;
    try { await navigator.clipboard.writeText(text); } catch (_) {
      const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove();
    }
    b.classList.add('copied'); b.innerHTML = '<i class="fa-solid fa-check"></i> Tersalin';
    setTimeout(() => { b.classList.remove('copied'); b.innerHTML = '<i class="fa-regular fa-copy"></i> Salin'; }, 1600);
  });

  /* ---------- POPUP SUKSES ---------- */
  const confetti = () => {
    const box = $('#confetti'); box.innerHTML = '';
    const colors = ['#00AED6', '#00AA13', '#F59E0B', '#EF4444', '#2C83B8', '#A855F7', '#FACC15'];
    for (let i = 0; i < 90; i++) {
      const p = document.createElement('i');
      p.style.left = Math.random() * 100 + '%';
      p.style.background = colors[i % colors.length];
      p.style.animationDuration = 2.2 + Math.random() * 2 + 's';
      p.style.animationDelay = Math.random() * .6 + 's';
      p.style.transform = `rotate(${Math.random() * 360}deg)`;
      box.appendChild(p);
    }
    setTimeout(() => { box.innerHTML = ''; }, 5000);
  };

  const showSuccess = (o) => {
    const m = METHODS[o.method]; const s = SERVICES[o.service];
    $('.receipt-head').classList.toggle('bsi', o.method === 'bsi');
    $('#rc-logo').src = m.logo; $('#rc-logo').alt = m.title;
    $('#rc-amount').textContent = rp(o.amount);
    $('#rc-date').textContent = fmtDate(o.paidAt || Date.now()) + ' WIB';
    $('#rc-service').textContent = o.serviceName;
    $('#rc-method').textContent = m.receiptName;
    $('#rc-account').textContent = m.account;
    $('#rc-customer').textContent = o.customerName;
    $('#rc-old').textContent = rp(s.oldPrice);
    $('#rc-disc').textContent = '-' + rp(s.oldPrice - o.baseAmount) + (o.uniqueCode ? ` (+kode unik ${o.uniqueCode})` : '');
    $('#rc-total').textContent = rp(o.amount);
    $('#rc-id').textContent = o.id;

    const msg = [
      'Halo Admin LegalCraft 👋', '',
      'Pembayaran saya sudah *BERHASIL* dan terverifikasi otomatis oleh sistem. Saya siap memulai proses pengurusan.', '',
      `🧾 ID Transaksi: ${o.id}`, `👤 Nama: ${o.customerName}`, `📄 Layanan: ${o.serviceName}`,
      `💳 Metode: ${m.receiptName}`, `💰 Total: ${rp(o.amount)}`, `🕒 Waktu: ${fmtDate(o.paidAt || Date.now())} WIB`, '',
      'Mohon informasikan dokumen apa saja yang perlu saya kirimkan untuk memulai proses. Terima kasih.'
    ].join('\n');
    $('#btn-wa').href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;

    const pop = $('#pop-success'); pop.hidden = true; void pop.offsetWidth; pop.hidden = false;
    document.body.classList.add('no-scroll');
    confetti();
  };

  $('#btn-show-receipt').addEventListener('click', () => state.order && showSuccess(state.order));
  $$('[data-close-pop]').forEach((b) => b.addEventListener('click', () => { $('#pop-success').hidden = true; document.body.classList.remove('no-scroll'); }));

  $('#btn-download').addEventListener('click', async () => {
    if (!window.html2canvas) { toast('Silakan screenshot struk ini'); return; }
    const btn = $('#btn-download'); btn.disabled = true;
    try {
      const canvas = await html2canvas($('#receipt'), { scale: 2, backgroundColor: '#ffffff', useCORS: true });
      const a = document.createElement('a'); a.href = canvas.toDataURL('image/png');
      a.download = `Struk-${state.order.id}.png`; a.click();
      toast('Struk tersimpan');
    } catch (_) { toast('Gagal mengunduh, silakan screenshot struk'); }
    finally { btn.disabled = false; }
  });

  /* ---------- POPUP GAGAL ---------- */
  const showFailed = (o, prevStatus) => {
    const wasWaiting = prevStatus === 'waiting' || !!o.confirmedAt || o.rejectReason === 'not_received';
    const cancelled = o.status === 'cancelled';
    $('#failed-title').textContent = cancelled ? 'Tagihan Dibatalkan' : 'Pembayaran Ditolak';
    $('#failed-text').textContent = cancelled
      ? 'Tagihan ini sudah dibatalkan. Silakan buat tagihan baru.'
      : wasWaiting
        ? 'Sistem tidak menemukan dana masuk ke rekening LegalCraft dengan nominal yang sesuai, sehingga pembayaran DITOLAK otomatis. Jika kamu yakin sudah transfer, hubungi admin via WhatsApp dengan bukti transfer.'
        : 'Waktu pembayaran 10 menit habis dan tidak ada dana masuk, sehingga tagihan DITOLAK otomatis. Jika kamu sudah terlanjur transfer, hubungi admin via WhatsApp dengan bukti transfer.';
    $('#failed-meta').innerHTML = `
      <div><span>ID Transaksi</span><b>${o.id}</b></div>
      <div><span>Layanan</span><b>${o.serviceName}</b></div>
      <div><span>Total</span><b>${rp(o.amount)}</b></div>
      ${cancelled ? '' : `<div><span>Status</span><b style="color:var(--danger)">Ditolak otomatis</b></div>`}`;
    const help = `Halo LegalCraft, pembayaran saya ${cancelled ? 'dibatalkan' : 'ditolak otomatis oleh sistem'}. ID Transaksi: ${o.id}, nominal ${rp(o.amount)}. Mohon dicek, saya lampirkan bukti transfer.`;
    $('#btn-help').href = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(help)}`;
    const pop = $('#pop-failed'); pop.hidden = true; void pop.offsetWidth; pop.hidden = false;
    document.body.classList.add('no-scroll');
  };
  $('#btn-retry').addEventListener('click', () => {
    $('#pop-failed').hidden = true; document.body.classList.remove('no-scroll');
    state.order = null; state.successShown = false; state.failedShown = false;
    $('#sum-order').hidden = true; renderSummary(selService.value); setStep(1);
  });

  /* ---------- Lanjutkan order aktif (jika halaman di-refresh) ---------- */
  const resumeId = params.get('order') || localStorage.getItem(STORE_KEY);
  if (resumeId) {
    api('/api/orders/' + encodeURIComponent(resumeId))
      .then((o) => {
        if (['pending', 'waiting'].includes(o.status) || params.get('order')) {
          if (o.status === 'paid' && params.get('order')) state.successShown = false;
          openOrder(o);
        } else localStorage.removeItem(STORE_KEY);
      })
      .catch(() => localStorage.removeItem(STORE_KEY));
  }

  window.LegalCraftPay = { showSuccess, showFailed };
})();
