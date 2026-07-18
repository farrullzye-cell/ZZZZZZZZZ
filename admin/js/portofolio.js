document.addEventListener('DOMContentLoaded', () => {
  window.crud = new CrudManager({
    apiEndpoint: '/portfolios', tableId: 'portofolioTable',
    modalId: 'portofolioModal', modalTitleId: 'portofolioModalTitle',
    formId: 'portofolioForm', searchId: 'searchPortofolio', label: 'Portofolio',
    columns: [
      { field: 'title' }, { field: 'category' }, { field: 'client' },
      { field: 'isActive', render: (item) => API.statusBadge(item.isActive ? 'published' : 'draft') },
    ],
    fields: [{ field: 'title' }, { field: 'description' }, { field: 'category' }, { field: 'client' }, { field: 'thumbnail' }, { field: 'linkPreview' }, { field: 'linkDetail' }, { field: 'sortOrder' }, { field: 'isActive' }],
  });
  document.getElementById('btnTambah')?.addEventListener('click', () => crud.create());
  document.getElementById('closeModal')?.addEventListener('click', () => crud.closeModal());
});
