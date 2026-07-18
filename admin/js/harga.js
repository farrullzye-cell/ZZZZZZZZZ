document.addEventListener('DOMContentLoaded', () => {
  window.crud = new CrudManager({
    apiEndpoint: '/pricings', tableId: 'hargaTable',
    modalId: 'hargaModal', modalTitleId: 'hargaModalTitle',
    formId: 'hargaForm', searchId: 'searchHarga', label: 'Paket Harga',
    columns: [
      { field: 'name' },
      { field: 'priceMonthly', render: (item) => item.priceMonthly || '-' },
      { field: 'priceAnnual', render: (item) => item.priceAnnual || '-' },
      { field: 'features', render: (item) => Array.isArray(item.features) ? item.features.length + ' fitur' : '-' },
      { field: 'isFeatured', render: (item) => item.isFeatured ? '<span style="color:var(--amber)"><i class="fas fa-star"></i></span>' : '-' },
      { field: 'isActive', render: (item) => API.statusBadge(item.isActive ? 'active' : 'inactive') },
    ],
    fields: [{ field: 'name' }, { field: 'priceMonthly' }, { field: 'priceAnnual' }, { field: 'currency' }, { field: 'period' }, { field: 'buttonText' }, { field: 'buttonLink' }, { field: 'popularLabel' }, { field: 'features' }, { field: 'sortOrder' }, { field: 'isFeatured' }, { field: 'isActive' }],
  });

  // Override submit to serialize features array
  const origSubmit = crud.handleSubmit;
  crud.handleSubmit = async function(e) {
    e.preventDefault();
    const form = e.target;
    const data = {};
    this.config.fields.forEach(f => {
      const el = form.elements[f.field];
      if (!el) return;
      if (el.type === 'checkbox') data[f.field] = el.checked;
      else data[f.field] = el.value;
    });
    if (typeof data.features === 'string') data.features = data.features.split('\n').filter(f => f.trim());
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
    } catch (err) { this.showError(err.message); }
  };

  // Override edit to handle features array -> textarea
  const origEdit = crud.edit;
  crud.edit = async function(id) {
    const item = this.items.find(i => i.id === id);
    if (!item) return;
    this.editingId = id;
    const form = document.getElementById(this.config.formId);
    if (!form) return;
    this.config.fields.forEach(f => {
      const el = form.elements[f.field];
      if (!el) return;
      const val = this.getNestedValue(item, f.field);
      if (f.field === 'features' && Array.isArray(val)) {
        el.value = val.join('\n');
      } else if (el.type === 'checkbox') {
        el.checked = !!val;
      } else {
        el.value = val != null ? val : '';
      }
    });
    document.getElementById(this.config.modalTitleId).textContent = 'Edit ' + this.config.label;
    this.openModal();
  };

  document.getElementById('btnTambah')?.addEventListener('click', () => crud.create());
  document.getElementById('closeModal')?.addEventListener('click', () => crud.closeModal());
});
