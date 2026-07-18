const API = {
  base: '/api',
  get token() { return localStorage.getItem('admin_token'); },

  async request(method, path, body) {
    const headers = { 'Content-Type': 'application/json' };
    const t = this.token;
    if (t) headers['Authorization'] = `Bearer ${t}`;
    const opts = { method, headers };
    if (body) opts.body = JSON.stringify(body);
    const res = await fetch(this.base + path, opts);
    if (res.status === 401) {
      localStorage.removeItem('admin_token');
      window.location.href = '../customer/login.html';
      throw new Error('Unauthorized');
    }
    if (!res.ok) {
      const err = await res.json().catch(() => ({ error: res.statusText }));
      throw new Error(err.error || 'Request gagal');
    }
    return res.json();
  },

  get(path) { return this.request('GET', path); },
  post(path, body) { return this.request('POST', path, body); },
  put(path, body) { return this.request('PUT', path, body); },
  del(path) { return this.request('DELETE', path); },

  async login(email, password) {
    const data = await this.post('/auth/admin/login', { email, password });
    localStorage.setItem('admin_token', data.token);
    return data;
  },

  logout() {
    localStorage.removeItem('admin_token');
    window.location.href = '../customer/login.html';
  },

  formatCurrency(val) {
    if (!val) return 'Rp 0';
    return 'Rp ' + Number(val).toLocaleString('id-ID');
  },

  formatDate(dateStr) {
    if (!dateStr) return '-';
    const d = new Date(dateStr);
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
  },

  statusBadge(status) {
    const map = {
      pending: 'pending', consultation: 'draft', processing: 'active',
      completed: 'active', cancelled: 'inactive', unpaid: 'pending',
      dp: 'pending', paid: 'active', active: 'active', inactive: 'inactive',
      draft: 'draft', published: 'active', true: 'active', false: 'inactive',
    };
    const cls = map[status] || 'pending';
    const labels = {
      pending: 'Pending', consultation: 'Konsultasi', processing: 'Diproses',
      completed: 'Selesai', cancelled: 'Dibatalkan', unpaid: 'Belum Bayar',
      dp: 'DP', paid: 'Lunas', active: 'Aktif', inactive: 'Tidak Aktif',
      draft: 'Draft', published: 'Published',
    };
    return `<span class="status-badge ${cls}">${labels[status] || status}</span>`;
  },
};
