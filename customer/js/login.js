const API_BASE = '/api';
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  btn.disabled = true; btn.textContent = 'Memproses...';
  const email = e.target.querySelector('input[type="email"]').value;
  const password = e.target.querySelector('input[type="password"]').value;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(API_BASE + '/auth/admin/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
      signal: controller.signal,
    });
    clearTimeout(timeout);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Login gagal');
    localStorage.setItem('admin_token', data.token);
    window.location.href = '../admin/index.html';
  } catch (err) {
    clearTimeout(timeout);
    if (err.name === 'AbortError') {
      alert('Server tidak merespons. Cek koneksi atau coba lagi.');
    } else {
      alert('Error: ' + (err.message || 'Gagal login'));
    }
    btn.disabled = false;
    btn.textContent = 'Masuk';
  }
});
