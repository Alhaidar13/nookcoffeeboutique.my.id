/* =========================================================
   LegalCraft — Login & Register (email + Google Sign-In)
   Alur Google:
   - Login dengan Google -> akun sudah terdaftar  => langsung masuk ke beranda
                         -> akun belum terdaftar  => diarahkan ke Register (data Google terisi otomatis)
   ========================================================= */
(function () {
  'use strict';
  const page = document.body.dataset.page; // 'login' | 'register'
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => Array.from(c.querySelectorAll(s));
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const PHONE_RE = /^(\+62|62|0)8[0-9]{7,12}$/;
  const G_KEY = 'lc_google_pending'; // credential Google sementara (sessionStorage) untuk alur register
  const next = new URLSearchParams(location.search).get('next');
  const safeNext = next && next.startsWith('/') && !next.startsWith('//') ? next : '/beranda';

  const alertBox = $('#alert');
  const showAlert = (html, type = 'err') => {
    alertBox.className = 'auth-alert ' + type;
    alertBox.innerHTML = `<i class="fa-solid ${type === 'err' ? 'fa-circle-exclamation' : 'fa-circle-info'}"></i><span>${html}</span>`;
    alertBox.hidden = false;
  };
  const hideAlert = () => { alertBox.hidden = true; };

  const setErr = (f, m) => { const el = $(`[data-error-for="${f}"]`); if (!el) return; el.textContent = m; el.closest('.form-group').classList.add('has-error'); };
  const clrErr = (f) => { const el = $(`[data-error-for="${f}"]`); if (!el) return; el.textContent = ''; el.closest('.form-group').classList.remove('has-error'); };
  $$('input').forEach((i) => i.addEventListener('input', () => clrErr(i.name)));

  $$('.pw-toggle').forEach((b) => b.addEventListener('click', () => {
    const inp = b.previousElementSibling; const show = inp.type === 'password';
    inp.type = show ? 'text' : 'password';
    b.innerHTML = `<i class="fa-solid ${show ? 'fa-eye-slash' : 'fa-eye'}"></i>`;
  }));

  const post = async (url, body) => {
    const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body), credentials: 'same-origin' });
    const data = await r.json().catch(() => ({}));
    return { ok: r.ok, status: r.status, data };
  };

  const btn = $('#submit-btn'); const btnHTML = btn.innerHTML;
  const busy = (on, label) => { btn.disabled = on; btn.innerHTML = on ? `<span class="spin"></span> ${label}` : btnHTML; };

  const success = (title) => {
    sessionStorage.removeItem(G_KEY);
    $('#success-title').textContent = title;
    $('#auth-success').hidden = false;
    setTimeout(() => { location.href = safeNext; }, 1300);
  };

  /* ---------------- Google Sign-In ---------------- */
  const renderGoogleFallback = (msg) => {
    $('#google-slot').innerHTML = `<button type="button" class="google-fallback" disabled>
      <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="" /> ${page === 'login' ? 'Masuk' : 'Daftar'} dengan Google</button>`;
    const hint = $('#google-hint'); hint.textContent = msg; hint.hidden = false;
  };

  const onGoogleCredential = async ({ credential }) => {
    hideAlert();
    if (page === 'login') {
      const r = await post('/api/auth/google', { credential });
      if (r.ok) return success('Login berhasil!');
      if (r.status === 404 && r.data.code === 'not_registered') {
        // Belum punya akun -> arahkan ke register dengan data Google
        sessionStorage.setItem(G_KEY, JSON.stringify({ credential, profile: r.data.profile }));
        showAlert('Akun Google ini belum terdaftar. Mengarahkan ke halaman Register…', 'info');
        setTimeout(() => { location.href = '/register?from=google'; }, 1400);
        return;
      }
      return showAlert(r.data.error || 'Login Google gagal, coba lagi.');
    }
    // Register: cek dulu apakah sudah terdaftar -> kalau ya langsung login
    const r = await post('/api/auth/google', { credential });
    if (r.ok) return success('Akun sudah terdaftar, login berhasil!');
    if (r.status === 404 && r.data.code === 'not_registered') return useGoogleProfile({ credential, profile: r.data.profile });
    showAlert(r.data.error || 'Gagal memverifikasi akun Google.');
  };

  const initGoogle = async () => {
    let cfg = {};
    try { cfg = await (await fetch('/api/auth/config')).json(); } catch (_) {}
    if (!cfg.googleClientId) return renderGoogleFallback('Login Google belum diaktifkan oleh admin.');
    const s = document.createElement('script');
    s.src = 'https://accounts.google.com/gsi/client'; s.async = true; s.defer = true;
    s.onload = () => {
      google.accounts.id.initialize({ client_id: cfg.googleClientId, callback: onGoogleCredential, ux_mode: 'popup', auto_select: false });
      const slot = $('#google-slot');
      google.accounts.id.renderButton(slot, {
        theme: 'outline', size: 'large', shape: 'rectangular', logo_alignment: 'center',
        text: page === 'login' ? 'signin_with' : 'signup_with', width: Math.min(slot.offsetWidth || 400, 400), locale: 'id'
      });
    };
    s.onerror = () => renderGoogleFallback('Gagal memuat Google Sign-In. Periksa koneksi internet.');
    document.head.appendChild(s);
  };

  /* ---------------- Register: mode Google ---------------- */
  let googlePending = null;
  const useGoogleProfile = (g) => {
    googlePending = g;
    sessionStorage.setItem(G_KEY, JSON.stringify(g));
    const p = g.profile || {};
    $('#g-name').textContent = p.name || '';
    $('#g-email').textContent = p.email || '';
    $('#g-avatar').outerHTML = p.avatar
      ? `<img id="g-avatar" src="${p.avatar}" alt="" referrerpolicy="no-referrer" />`
      : `<span id="g-avatar" class="ph">${(p.name || '?').charAt(0).toUpperCase()}</span>`;
    $('#g-profile').hidden = false;
    $('#google-area').hidden = true;
    $$('[data-email-only]').forEach((el) => { el.hidden = true; });
    $('#r-name').value = p.name || '';
    $('#reg-sub').textContent = 'Lengkapi nomor WhatsApp untuk menyelesaikan pendaftaran.';
    $('#r-phone').focus();
  };
  const clearGoogleProfile = () => {
    googlePending = null; sessionStorage.removeItem(G_KEY);
    $('#g-profile').hidden = true; $('#google-area').hidden = false;
    $$('[data-email-only]').forEach((el) => { el.hidden = false; });
    $('#reg-sub').textContent = 'Daftar dengan Google atau isi data di bawah.';
  };

  /* ---------------- LOGIN form ---------------- */
  if (page === 'login') {
    $('#login-form').addEventListener('submit', async (e) => {
      e.preventDefault(); hideAlert();
      const email = $('#l-email').value.trim(); const password = $('#l-password').value;
      let ok = true;
      if (!EMAIL_RE.test(email)) { setErr('email', 'Masukkan email yang valid.'); ok = false; }
      if (!password) { setErr('password', 'Password wajib diisi.'); ok = false; }
      if (!ok) return;
      busy(true, 'Memproses…');
      const r = await post('/api/auth/login', { email, password });
      busy(false);
      if (r.ok) return success('Login berhasil!');
      if (r.data.code === 'not_registered') {
        return showAlert(`Email belum terdaftar. <a href="/register?email=${encodeURIComponent(email)}">Daftar sekarang</a>`);
      }
      showAlert(r.data.error || 'Login gagal.');
    });
  }

  /* ---------------- REGISTER form ---------------- */
  if (page === 'register') {
    $('#g-cancel').addEventListener('click', clearGoogleProfile);
    const qEmail = new URLSearchParams(location.search).get('email');
    if (qEmail) $('#r-email').value = qEmail;
    try {
      const saved = JSON.parse(sessionStorage.getItem(G_KEY) || 'null');
      if (saved && saved.credential) {
        useGoogleProfile(saved);
        showAlert('Akun Google kamu belum terdaftar. Lengkapi data di bawah untuk membuat akun.', 'info');
      }
    } catch (_) {}

    $('#register-form').addEventListener('submit', async (e) => {
      e.preventDefault(); hideAlert();
      const d = { name: $('#r-name').value.trim(), phone: $('#r-phone').value.trim().replace(/[\s-]/g, '') };
      let ok = true;
      if (d.name.length < 3) { setErr('name', 'Nama minimal 3 karakter.'); ok = false; }
      if (!PHONE_RE.test(d.phone)) { setErr('phone', 'Nomor WhatsApp tidak valid. Contoh: 081234567890'); ok = false; }
      if (googlePending) {
        d.credential = googlePending.credential;
      } else {
        d.email = $('#r-email').value.trim(); d.password = $('#r-password').value;
        if (!EMAIL_RE.test(d.email)) { setErr('email', 'Masukkan email yang valid.'); ok = false; }
        if (d.password.length < 8) { setErr('password', 'Password minimal 8 karakter.'); ok = false; }
      }
      if (!ok) return;
      busy(true, 'Membuat akun…');
      const r = await post('/api/auth/register', d);
      busy(false);
      if (r.ok) return success('Akun berhasil dibuat!');
      if (r.status === 401 && googlePending) { clearGoogleProfile(); return showAlert('Sesi Google kedaluwarsa. Silakan klik "Daftar dengan Google" lagi.'); }
      if (r.data.code === 'exists') return showAlert('Email sudah terdaftar. <a href="/login">Login di sini</a>');
      if (r.data.field) setErr(r.data.field, r.data.error);
      showAlert(r.data.error || 'Pendaftaran gagal.');
    });
  }

  initGoogle();
})();
