class CrudManager {
  constructor(config) {
    this.config = config;
    this.items = [];
    this.editingId = null;
    this.init();
  }

  init() {
    this.load();
    this.setupEventListeners();
  }

  setupEventListeners() {
    const tbody = document.getElementById(this.config.tableId);
    if (tbody) {
      tbody.addEventListener('click', (e) => {
        const btn = e.target.closest('.edit, .delete');
        if (!btn) return;
        const id = btn.dataset.id;
        if (btn.classList.contains('edit')) this.edit(id);
        if (btn.classList.contains('delete')) this.delete(id);
      });
    }
    const search = document.getElementById(this.config.searchId);
    if (search) search.addEventListener('input', (e) => this.handleSearch(e));
    const form = document.getElementById(this.config.formId);
    if (form) form.addEventListener('submit', (e) => this.handleSubmit(e));
  }

  async load() {
    try {
      this.items = await API.get(this.config.apiEndpoint);
      this.render();
    } catch (err) {
      this.showError(err.message);
    }
  }

  render() {
    const tbody = document.getElementById(this.config.tableId);
    if (!tbody) return;
    if (this.items.length === 0) {
      tbody.innerHTML = `<tr><td colspan="${this.config.columns.length + 1}" style="text-align:center;padding:32px;color:var(--text-muted)">Tidak ada data</td></tr>`;
      return;
    }
    tbody.innerHTML = this.items.map((item) => {
      const cells = this.config.columns.map(col => {
        if (col.render) return col.render(item);
        const val = this.getNestedValue(item, col.field);
        return val != null ? val : '-';
      });
      cells.push(`<div class="table-actions">
        <button class="edit" data-id="${item.id}" title="Edit"><i class="fas fa-edit"></i></button>
        <button class="delete" data-id="${item.id}" title="Hapus"><i class="fas fa-trash"></i></button>
      </div>`);
      return `<tr>${cells.map(c => `<td>${c}</td>`).join('')}</tr>`;
    }).join('');
  }

  getNestedValue(obj, path) {
    return path.split('.').reduce((o, k) => (o || {})[k], obj);
  }

  async edit(id) {
    const item = this.items.find(i => i.id === id);
    if (!item) return;
    this.editingId = id;
    const form = document.getElementById(this.config.formId);
    if (!form) return;
    this.config.fields.forEach(f => {
      const el = form.elements[f.field];
      if (!el) return;
      const val = this.getNestedValue(item, f.field);
      if (el.type === 'checkbox') el.checked = !!val;
      else el.value = val != null ? val : '';
    });
    const title = document.getElementById(this.config.modalTitleId);
    if (title) title.textContent = 'Edit ' + this.config.label;
    this.openModal();
  }

  create() {
    this.editingId = null;
    const form = document.getElementById(this.config.formId);
    if (!form) return;
    form.reset();
    this.config.fields.forEach(f => {
      const el = form.elements[f.field];
      if (el && el.type === 'checkbox') el.checked = f.default || false;
    });
    const title = document.getElementById(this.config.modalTitleId);
    if (title) title.textContent = 'Tambah ' + this.config.label;
    this.openModal();
  }

  async delete(id) {
    if (!confirm('Yakin ingin menghapus data ini?')) return;
    try {
      await API.del(`${this.config.apiEndpoint}/${id}`);
      this.load();
      this.showSuccess('Data berhasil dihapus');
    } catch (err) {
      this.showError(err.message);
    }
  }

  async handleSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const data = {};
    this.config.fields.forEach(f => {
      const el = form.elements[f.field];
      if (!el) return;
      if (el.type === 'checkbox') data[f.field] = el.checked;
      else data[f.field] = el.value;
    });
    try {
      if (this.editingId) {
        await API.put(`${this.config.apiEndpoint}/${this.editingId}`, data);
        this.showSuccess('Data berhasil diperbarui');
      } else {
        await API.post(this.config.apiEndpoint, data);
        this.showSuccess('Data berhasil ditambahkan');
      }
      this.closeModal();
      this.load();
    } catch (err) {
      this.showError(err.message);
    }
  }

  openModal() {
    const modal = document.getElementById(this.config.modalId);
    if (modal) modal.style.display = 'flex';
  }

  closeModal() {
    const modal = document.getElementById(this.config.modalId);
    if (modal) modal.style.display = 'none';
    this.editingId = null;
  }

  handleSearch(e) {
    const q = e.target.value.toLowerCase();
    const rows = document.querySelectorAll(`#${this.config.tableId} tr`);
    rows.forEach(row => {
      const text = row.textContent.toLowerCase();
      row.style.display = text.includes(q) ? '' : 'none';
    });
  }

  showSuccess(msg) { this.showToast(msg, 'var(--emerald)'); }
  showError(msg) { this.showToast(msg, 'var(--rose)'); }

  showToast(msg, color) {
    const existing = document.querySelector('.crud-toast');
    if (existing) existing.remove();
    const toast = document.createElement('div');
    toast.className = 'crud-toast';
    toast.textContent = msg;
    toast.style.cssText = `position:fixed;bottom:24px;right:24px;background:${color};color:#fff;padding:12px 24px;border-radius:8px;font-size:14px;z-index:9999;box-shadow:0 4px 20px rgba(0,0,0,.3);animation:fadeIn .3s;max-width:400px`;
    document.body.appendChild(toast);
    setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity .3s'; setTimeout(() => toast.remove(), 300); }, 3000);
  }
}
