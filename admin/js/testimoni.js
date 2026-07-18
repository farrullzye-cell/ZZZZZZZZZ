document.addEventListener('DOMContentLoaded', () => {
  window.crud = new CrudManager({
    apiEndpoint: '/testimonials', tableId: 'testimoniTable',
    modalId: 'testimoniModal', modalTitleId: 'testimoniModalTitle',
    formId: 'testimoniForm', searchId: 'searchTestimoni', label: 'Testimoni',
    columns: [
      { field: 'name' },
      { field: 'rating', render: (item) => '&#9733;'.repeat(item.rating || 5) + '&#9734;'.repeat(5 - (item.rating || 5)) },
      { field: 'content', render: (item) => (item.content || '').substring(0, 60) + '...' },
      { field: 'isActive', render: (item) => API.statusBadge(item.isActive ? 'active' : 'inactive') },
    ],
    fields: [{ field: 'name' }, { field: 'role' }, { field: 'content' }, { field: 'avatar' }, { field: 'rating' }, { field: 'sortOrder' }, { field: 'isActive' }],
  });
  document.getElementById('btnTambah')?.addEventListener('click', () => crud.create());
  document.getElementById('closeModal')?.addEventListener('click', () => crud.closeModal());
});
