/* =========================================================
   LegalCraft — Homepage Interactions (Vanilla JavaScript)
   ========================================================= */
(function () {
  'use strict';

  /* ---------------------------------------------------------
     1. KONFIGURASI — ubah harga / nomor WA cukup di sini
     --------------------------------------------------------- */
  const CONFIG = {
    whatsappNumber: '6287797890306',
    services: {
      npwp: { name: 'Pengurusan NPWP', price: 149000, oldPrice: 399000 },
      nib:  { name: 'Pengurusan NIB', price: 149000, oldPrice: 399000 },
      pt:   { name: 'Pendirian PT Perorangan', price: 499000, oldPrice: 899000 }
    }
  };

  /* Testimonial — ganti dengan ulasan asli pelanggan bila sudah tersedia */
  const TESTIMONIALS = {
    row1: [
      { name: 'Rina Amelia', service: 'Pengurusan NIB', text: 'Proses konsultasinya mudah dipahami dan informasi yang diberikan cukup jelas.' },
      { name: 'Dimas Pratama', service: 'Pengurusan NPWP', text: 'Admin menjelaskan persyaratan NPWP dengan bahasa yang sederhana dan tidak bertele-tele.' },
      { name: 'Sari Wulandari', service: 'Pendirian PT Perorangan', text: 'Alur pendirian PT Perorangan dijelaskan step by step, jadi tahu apa saja yang perlu disiapkan.' },
      { name: 'Andi Saputra', service: 'Pengurusan NIB', text: 'Harga sudah jelas dari awal, jadi tidak ada kebingungan soal biaya layanan.' }
    ],
    row2: [
      { name: 'Fajar Nugroho', service: 'Pengurusan NPWP', text: 'Respon di WhatsApp cukup cepat dan setiap pertanyaan dijawab dengan jelas.' },
      { name: 'Maya Lestari', service: 'Pendirian PT Perorangan', text: 'Sangat membantu untuk pengusaha pemula yang belum paham soal badan usaha.' },
      { name: 'Yusuf Hidayat', service: 'Pengurusan NIB', text: 'Cocok untuk UMKM dan bisnis online yang ingin mulai melengkapi legalitas.' },
      { name: 'Nadia Putri', service: 'Pengurusan NPWP', text: 'Update progres dikabarkan lewat chat, jadi merasa lebih tenang selama proses.' }
    ]
  };

  const formatRupiah = (n) => 'Rp' + Number(n).toLocaleString('id-ID');
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------------------------------------------------------
     2. Sinkronkan harga ke semua elemen [data-price]
     --------------------------------------------------------- */
  $$('[data-price]').forEach((el) => {
    const svc = CONFIG.services[el.dataset.price];
    if (svc) el.textContent = formatRupiah(svc.price);
  });
  // Harga coret (harga normal) + badge diskon ala marketplace
  $$('[data-price-old]').forEach((el) => {
    const svc = CONFIG.services[el.dataset.priceOld];
    if (svc) el.textContent = formatRupiah(svc.oldPrice);
  });
  $$('[data-discount]').forEach((el) => {
    const svc = CONFIG.services[el.dataset.discount];
    if (svc) el.textContent = 'Hemat ' + Math.round((1 - svc.price / svc.oldPrice) * 100) + '%';
  });

  /* Countdown promo (reset setiap tengah malam) */
  const promoEl = $('#promo-countdown');
  if (promoEl) {
    const tick = () => {
      const now = new Date(); const end = new Date(now); end.setHours(23, 59, 59, 999);
      const d = Math.max(0, end - now);
      const pad = (n) => String(n).padStart(2, '0');
      promoEl.textContent = `${pad(Math.floor(d / 36e5))}:${pad(Math.floor(d / 6e4) % 60)}:${pad(Math.floor(d / 1e3) % 60)}`;
    };
    tick(); setInterval(tick, 1000);
  }

  /* Accordion benefit di kartu layanan */
  $$('.benefit-toggle').forEach((btn) => {
    const panel = document.getElementById(btn.getAttribute('aria-controls'));
    btn.addEventListener('click', () => {
      const open = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', String(open));
      btn.closest('.service-card').classList.toggle('benefit-open', open);
      btn.querySelector('span').innerHTML = open
        ? '<i class="fa-solid fa-gift"></i> Sembunyikan Benefit'
        : '<i class="fa-solid fa-gift"></i> Lihat Benefit';
      panel.style.maxHeight = open ? panel.scrollHeight + 'px' : '0px';
    });
  });

  /* ---------------------------------------------------------
     3. Navbar: sticky shadow, mobile menu, active link
     --------------------------------------------------------- */
  const header = $('#site-header');
  const hamburger = $('#hamburger');
  const navMenu = $('#nav-menu');
  const navLinks = $$('.nav-link');

  const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 10);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  const setMenu = (open) => {
    navMenu.classList.toggle('open', open);
    hamburger.classList.toggle('open', open);
    hamburger.setAttribute('aria-expanded', String(open));
    hamburger.setAttribute('aria-label', open ? 'Tutup menu' : 'Buka menu');
  };
  hamburger.addEventListener('click', () => setMenu(!navMenu.classList.contains('open')));
  navMenu.addEventListener('click', (e) => { if (e.target.closest('a, button')) setMenu(false); });
  document.addEventListener('click', (e) => {
    if (navMenu.classList.contains('open') && !e.target.closest('.navbar')) setMenu(false);
  });
  window.addEventListener('resize', () => { if (window.innerWidth > 860) setMenu(false); });

  // Smooth scroll untuk semua anchor internal (CSS scroll-behavior + scroll-margin-top sebagai dasar,
  // JS menjamin offset navbar konsisten di semua browser & memperbarui URL hash)
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;
    const id = link.getAttribute('href');
    if (id.length < 2) return;
    const target = document.querySelector(id);
    if (!target) return;
    e.preventDefault();
    const offset = header.offsetHeight;
    const top = id === '#beranda' ? 0 : target.getBoundingClientRect().top + window.scrollY - offset;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });
    history.replaceState(null, '', id);
  });

  // Highlight menu aktif sesuai section yang sedang terlihat
  const sectionIds = navLinks.map((a) => a.getAttribute('href'));
  const sections = sectionIds.map((id) => document.querySelector(id)).filter(Boolean);
  const updateActive = () => {
    const pos = window.scrollY + header.offsetHeight + window.innerHeight * 0.25;
    let current = sectionIds[0];
    sections.forEach((s) => { if (s.offsetTop <= pos) current = '#' + s.id; });
    navLinks.forEach((a) => a.classList.toggle('active', a.getAttribute('href') === current));
  };
  window.addEventListener('scroll', updateActive, { passive: true });
  updateActive();

  /* ---------------------------------------------------------
     4. Testimonial marquee (CSS animation, JS hanya render kartu)
     --------------------------------------------------------- */
  const escapeHTML = (s) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const initials = (name) => name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase();
  const cardHTML = (t, hidden) => `
    <article class="t-card"${hidden ? ' aria-hidden="true"' : ''}>
      <div class="t-author">
        <span class="t-avatar">${initials(t.name)}</span>
        <div><strong>${escapeHTML(t.name)}</strong><small>${escapeHTML(t.service)}</small></div>
        <i class="fa-solid fa-quote-right t-quote" aria-hidden="true"></i>
      </div>
      <p class="t-text">“${escapeHTML(t.text)}”</p>
      <div class="t-stars" aria-label="Rating 5 dari 5">${'<i class="fa-solid fa-star"></i>'.repeat(5)}<span>5.0</span></div>
    </article>`;
  const renderRow = (el, items) => {
    if (!el) return;
    // Set asli + set duplikat => loop seamless dengan translateX(-50%)
    el.innerHTML = items.map((t) => cardHTML(t, false)).join('') + items.map((t) => cardHTML(t, true)).join('');
  };
  renderRow($('#testimonial-row-1'), TESTIMONIALS.row1);
  renderRow($('#testimonial-row-2'), TESTIMONIALS.row2);

  /* ---------------------------------------------------------
     5. FAQ accordion
     --------------------------------------------------------- */
  const faqItems = $$('.faq-item');
  const toggleFaq = (item, open) => {
    const btn = $('.faq-question', item);
    const ans = $('.faq-answer', item);
    item.classList.toggle('open', open);
    btn.setAttribute('aria-expanded', String(open));
    ans.style.maxHeight = open ? ans.scrollHeight + 'px' : '0px';
  };
  faqItems.forEach((item) => {
    $('.faq-question', item).addEventListener('click', () => {
      const willOpen = !item.classList.contains('open');
      faqItems.forEach((other) => { if (other !== item) toggleFaq(other, false); });
      toggleFaq(item, willOpen);
    });
  });
  window.addEventListener('resize', () => {
    faqItems.filter((i) => i.classList.contains('open')).forEach((i) => {
      const ans = $('.faq-answer', i); ans.style.maxHeight = ans.scrollHeight + 'px';
    });
  });

  /* ---------------------------------------------------------
     6. Modal & form konsultasi -> WhatsApp
     --------------------------------------------------------- */
  const modal = $('#consult-modal');
  const form = $('#consult-form');
  const selectService = $('#f-service');
  const summary = $('#service-summary');
  let lastFocused = null;

  // Isi opsi layanan dari CONFIG agar harga selalu konsisten
  Object.entries(CONFIG.services).forEach(([key, s]) => {
    const opt = document.createElement('option');
    opt.value = key;
    opt.textContent = `${s.name} — ${formatRupiah(s.price)}`;
    selectService.appendChild(opt);
  });

  const updateSummary = () => {
    const svc = CONFIG.services[selectService.value];
    summary.hidden = !svc;
    if (svc) {
      $('#summary-name').textContent = svc.name;
      $('#summary-price').textContent = formatRupiah(svc.price);
    }
  };
  selectService.addEventListener('change', () => { updateSummary(); clearError('service'); });

  const openModal = (serviceKey) => {
    lastFocused = document.activeElement;
    setMenu(false);
    if (serviceKey && CONFIG.services[serviceKey]) selectService.value = serviceKey;
    updateSummary();
    modal.hidden = false;
    document.body.classList.add('no-scroll');
    setTimeout(() => $('#f-name').focus(), 50);
  };
  const closeModal = () => {
    modal.hidden = true;
    document.body.classList.remove('no-scroll');
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  };

  /* ---------------------------------------------------------
     Gate login: Konsultasi, Price List & Pembayaran wajib login
     --------------------------------------------------------- */
  const gate = $('#auth-gate');
  const auth = { user: null, checked: false };
  const authReady = fetch('/api/auth/me', { credentials: 'same-origin' })
    .then((r) => (r.ok ? r.json() : null)).then((d) => { auth.user = d && d.user ? d.user : null; })
    .catch(() => {}).finally(() => { auth.checked = true; });

  const GATE_TEXT = {
    consult: 'Untuk konsultasi dengan admin LegalCraft, kamu perlu masuk atau mendaftar terlebih dahulu.',
    harga: 'Untuk melihat price list lengkap & memesan layanan, kamu perlu masuk atau mendaftar terlebih dahulu.',
    pay: 'Untuk melakukan pembayaran, kamu perlu masuk atau mendaftar terlebih dahulu agar pesanan tercatat di akunmu.'
  };
  const openGate = (reason, next) => {
    setMenu(false);
    lastFocused = document.activeElement;
    $('#gate-text').textContent = GATE_TEXT[reason] || GATE_TEXT.consult;
    const q = '?next=' + encodeURIComponent(next || '/beranda');
    $('#gate-login').href = '/login' + q;
    $('#gate-register').href = '/register' + q;
    gate.hidden = false;
    document.body.classList.add('no-scroll');
    setTimeout(() => $('#gate-register').focus(), 50);
  };
  const closeGate = () => {
    gate.hidden = true;
    document.body.classList.remove('no-scroll');
    if (lastFocused && lastFocused.focus) lastFocused.focus();
  };
  // Jalankan aksi hanya jika sudah login, selain itu tampilkan modal login
  const withAuth = async (reason, next, action) => {
    if (!auth.checked) await authReady;
    if (auth.user) return action();
    openGate(reason, next);
  };

  document.addEventListener('click', (e) => {
    if (e.target.closest('[data-close-gate]')) { closeGate(); return; }
    const opener = e.target.closest('[data-open-consult]');
    if (opener) {
      e.preventDefault(); e.stopImmediatePropagation();
      const svc = opener.dataset.service;
      withAuth('consult', '/beranda?konsultasi=1' + (svc ? '&layanan=' + svc : ''), () => openModal(svc));
      return;
    }
    const guarded = e.target.closest('[data-require-auth]');
    if (guarded && !auth.user) {
      e.preventDefault(); e.stopImmediatePropagation();
      const reason = guarded.dataset.requireAuth;
      const href = guarded.getAttribute('href') || '/beranda';
      const next = href.startsWith('#') ? '/beranda' + href : href;
      withAuth(reason, next, () => { if (href.startsWith('#')) guarded.click(); else location.href = href; });
      return;
    }
    if (e.target.closest('[data-close-consult]')) closeModal();
  }, true);
  document.addEventListener('keydown', (e) => {
    if (!gate.hidden && e.key === 'Escape') { closeGate(); return; }
    if (modal.hidden) return;
    if (e.key === 'Escape') closeModal();
    if (e.key === 'Tab') { // focus trap sederhana
      const f = $$('button, input, select, textarea', modal).filter((el) => !el.disabled && el.offsetParent !== null);
      const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });

  // Validasi
  const setError = (field, msg) => {
    const el = $(`[data-error-for="${field}"]`, form);
    el.textContent = msg;
    el.closest('.form-group').classList.add('has-error');
  };
  function clearError(field) {
    const el = $(`[data-error-for="${field}"]`, form);
    el.textContent = '';
    el.closest('.form-group').classList.remove('has-error');
  }
  ['name', 'email', 'phone'].forEach((f) => form.elements[f].addEventListener('input', () => clearError(f)));

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const PHONE_RE = /^(\+62|62|0)8[0-9]{7,12}$/;

  const validate = (d) => {
    let ok = true;
    if (!d.name) { setError('name', 'Nama lengkap wajib diisi.'); ok = false; }
    else if (d.name.length < 3) { setError('name', 'Nama lengkap minimal 3 karakter.'); ok = false; }
    if (!d.email) { setError('email', 'Email wajib diisi.'); ok = false; }
    else if (!EMAIL_RE.test(d.email)) { setError('email', 'Format email tidak valid. Contoh: nama@email.com'); ok = false; }
    const phoneClean = d.phone.replace(/[\s-]/g, '');
    if (!d.phone) { setError('phone', 'Nomor WhatsApp wajib diisi.'); ok = false; }
    else if (!PHONE_RE.test(phoneClean)) { setError('phone', 'Nomor WhatsApp tidak valid. Contoh: 081234567890'); ok = false; }
    if (!CONFIG.services[d.service]) { setError('service', 'Silakan pilih layanan terlebih dahulu.'); ok = false; }
    return ok;
  };

  // Pertanyaan spesifik per layanan agar konsultasi langsung terarah
  const SERVICE_QUESTIONS = {
    npwp: [
      'Dokumen apa saja yang perlu saya siapkan untuk pengurusan NPWP?',
      'Apakah NPWP bisa dibuat untuk pribadi (orang pribadi) maupun usaha?',
      'Berapa estimasi waktu sampai NPWP dan kartu digitalnya terbit?',
      'Apakah sudah termasuk bantuan aktivasi akun DJP Online & panduan lapor SPT?'
    ],
    nib: [
      'Dokumen dan data apa saja yang diperlukan untuk pengurusan NIB?',
      'Bagaimana cara menentukan KBLI yang sesuai dengan jenis usaha saya?',
      'Berapa estimasi waktu sampai NIB terbit melalui OSS RBA?',
      'Apakah NIB ini bisa langsung dipakai untuk daftar marketplace / pengajuan ke bank?'
    ],
    pt: [
      'Dokumen apa saja yang perlu saya siapkan untuk pendirian PT Perorangan?',
      'Bagaimana ketentuan pemilihan nama PT dan apakah bisa dicek ketersediaannya dulu?',
      'Apakah biaya sudah termasuk Sertifikat Pendaftaran, NPWP Badan, dan NIB perusahaan?',
      'Berapa estimasi waktu proses dari awal sampai seluruh dokumen terbit?'
    ]
  };

  const greeting = () => {
    const h = new Date().getHours();
    return h < 11 ? 'Selamat pagi' : h < 15 ? 'Selamat siang' : h < 18 ? 'Selamat sore' : 'Selamat malam';
  };

  const buildMessage = (d) => {
    const svc = CONFIG.services[d.service];
    const questions = SERVICE_QUESTIONS[d.service] || [];
    return [
      `Halo Admin LegalCraft, ${greeting().toLowerCase()} 👋`,
      '',
      `Perkenalkan, saya *${d.name}*. Saya mendapatkan informasi layanan LegalCraft melalui website dan tertarik untuk berkonsultasi mengenai *${svc.name}*.`,
      '',
      'Saat ini saya sedang mempersiapkan legalitas untuk usaha saya, dan ingin memastikan prosesnya berjalan dengan benar sesuai ketentuan yang berlaku. Karena itu, saya ingin meminta penjelasan lebih lanjut terkait layanan ini.',
      '',
      '*📋 DATA DIRI*',
      `• Nama Lengkap : ${d.name}`,
      `• Email : ${d.email}`,
      `• No. WhatsApp : ${d.phone}`,
      `• Domisili : ${d.city || '-'}`,
      `• Jenis / Nama Usaha : ${d.business || '-'}`,
      '',
      '*💼 LAYANAN YANG DIMINATI*',
      `• Layanan : ${svc.name}`,
      `• Harga Promo : ${formatRupiah(svc.price)} (normal ${formatRupiah(svc.oldPrice)})`,
      '',
      '*💬 KEBUTUHAN / PESAN TAMBAHAN*',
      d.message || '-',
      '',
      '*❓ YANG INGIN SAYA TANYAKAN*',
      ...questions.map((q, i) => `${i + 1}. ${q}`),
      `${questions.length + 1}. Bagaimana alur pembayaran dan langkah selanjutnya setelah saya melakukan pembayaran?`,
      '',
      'Saya siap melengkapi dokumen yang dibutuhkan apabila persyaratannya sudah jelas. Mohon kesediaannya untuk menjelaskan persyaratan, alur, serta estimasi waktu pengurusannya.',
      '',
      'Terima kasih atas waktu dan bantuannya. Saya tunggu balasannya 🙏',
      '',
      'Salam,',
      d.name
    ].join('\n');
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const d = {
      name: form.elements.name.value.trim(),
      email: form.elements.email.value.trim(),
      phone: form.elements.phone.value.trim(),
      service: form.elements.service.value,
      message: form.elements.message.value.trim(),
      business: form.elements.business.value.trim(),
      city: form.elements.city.value.trim()
    };
    ['name', 'email', 'phone', 'service'].forEach(clearError);
    if (!validate(d)) {
      const firstErr = $('.has-error input, .has-error select', form);
      if (firstErr) firstErr.focus();
      return;
    }
    // Data hanya dipakai untuk menyusun pesan WhatsApp
    const whatsappURL = `https://wa.me/${CONFIG.whatsappNumber}?text=${encodeURIComponent(buildMessage(d))}`;
    window.open(whatsappURL, '_blank', 'noopener');
    form.reset();
    prefillFromUser();
    updateSummary();
    closeModal();
  });

  /* ---------------------------------------------------------
     7. Reveal-on-scroll ringan
     --------------------------------------------------------- */
  if ('IntersectionObserver' in window) {
    const els = $$('.service-card, .step, .why-item, .price-card, .faq-item, .final-cta');
    els.forEach((el) => el.classList.add('reveal'));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('visible'); io.unobserve(en.target); } });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach((el) => io.observe(el));
  }

  /* ---------------------------------------------------------
     8. Status login di navbar
     --------------------------------------------------------- */
  const navAuth = $('#nav-auth');
  function prefillFromUser() {
    const u = auth.user; if (!u) return;
    if (!form.elements.name.value) form.elements.name.value = u.name || '';
    if (!form.elements.email.value) form.elements.email.value = u.email || '';
    if (!form.elements.phone.value) form.elements.phone.value = u.phone || '';
  }
  authReady.then(() => {
    if (!auth.user) { document.body.classList.add('is-guest'); return; }
    document.body.classList.add('is-member');
    if (navAuth) {
      // Tidak ada dashboard lagi: tampilkan nama user + tombol Keluar
      const u = auth.user;
      const first = escapeHTML((u.name || 'Akun').split(' ')[0]);
      const chip = document.createElement('span');
      chip.className = 'nav-user';
      chip.title = (u.name || '') + (u.email ? ' • ' + u.email : '');
      chip.innerHTML = (u.avatar
        ? `<img src="${escapeHTML(u.avatar)}" alt="" referrerpolicy="no-referrer" />`
        : `<span class="nav-user-ph">${escapeHTML((u.name || '?').charAt(0).toUpperCase())}</span>`) + `<span class="nav-user-name">${first}</span>`;
      navAuth.before(chip);
      navAuth.href = '#';
      navAuth.id = 'btn-logout';
      navAuth.innerHTML = '<i class="fa-solid fa-right-from-bracket"></i> Keluar';
      navAuth.addEventListener('click', async (e) => {
        e.preventDefault();
        if (!confirm('Keluar dari akun LegalCraft?')) return;
        await fetch('/api/auth/logout', { method: 'POST', credentials: 'same-origin' }).catch(() => {});
        location.href = '/';
      });
    }
    prefillFromUser();
    // Kembali dari login: lanjutkan aksi yang tadi diminta
    const qs = new URLSearchParams(location.search);
    if (qs.get('konsultasi') === '1') {
      openModal(qs.get('layanan') || undefined);
      history.replaceState(null, '', '/beranda');
    }
  });

  // Expose untuk debugging / testing
  window.LegalCraft = { CONFIG, buildMessage, formatRupiah };
})();
