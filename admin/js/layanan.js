document.addEventListener('DOMContentLoaded', () => {
  window.crud = new CrudManager({
    apiEndpoint: '/services', tableId: 'layananTable',
    modalId: 'layananModal', modalTitleId: 'layananModalTitle',
    formId: 'layananForm', searchId: 'searchLayanan', label: 'Layanan',
    columns: [
      { field: 'name' },
      { field: 'description', render: (item) => (item.description || '').substring(0, 60) + '...' },
      { field: 'icon', render: (item) => item.icon ? `<i class="${item.icon}" style="color:var(--cyan)"></i>` : '-' },
      { field: 'sortOrder' },
      { field: 'isActive', render: (item) => API.statusBadge(item.isActive ? 'active' : 'inactive') },
    ],
    fields: [{ field: 'name' }, { field: 'description' }, { field: 'icon' }, { field: 'image' }, { field: 'sortOrder' }, { field: 'isActive' }],
  });
  document.getElementById('btnTambah')?.addEventListener('click', () => crud.create());
  document.getElementById('closeModal')?.addEventListener('click', () => crud.closeModal());
});
