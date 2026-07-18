document.addEventListener('DOMContentLoaded', () => {
  window.crud = new CrudManager({
    apiEndpoint: '/blogs', tableId: 'artikelTable',
    modalId: 'artikelModal', modalTitleId: 'artikelModalTitle',
    formId: 'artikelForm', searchId: 'searchArtikel', label: 'Artikel',
    columns: [
      { field: 'title' }, { field: 'slug' },
      { field: 'createdAt', render: (item) => API.formatDate(item.createdAt) },
      { field: 'status', render: (item) => API.statusBadge(item.status || (item.isActive ? 'published' : 'draft')) },
    ],
    fields: [{ field: 'title' }, { field: 'content' }, { field: 'thumbnail' }, { field: 'status' }, { field: 'isActive' }],
  });
  document.getElementById('btnTambah')?.addEventListener('click', () => crud.create());
  document.getElementById('closeModal')?.addEventListener('click', () => crud.closeModal());
});
