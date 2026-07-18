document.addEventListener('DOMContentLoaded', () => {
  window.crud = new CrudManager({
    apiEndpoint: '/faqs', tableId: 'faqTable',
    modalId: 'faqModal', modalTitleId: 'faqModalTitle',
    formId: 'faqForm', searchId: 'searchFaq', label: 'FAQ',
    columns: [
      { field: 'question', render: (item) => (item.question || '').substring(0, 80) + '...' },
      { field: 'sortOrder' },
      { field: 'isActive', render: (item) => API.statusBadge(item.isActive ? 'active' : 'inactive') },
    ],
    fields: [{ field: 'question' }, { field: 'answer' }, { field: 'sortOrder' }, { field: 'isActive' }],
  });
  document.getElementById('btnTambah')?.addEventListener('click', () => crud.create());
  document.getElementById('closeModal')?.addEventListener('click', () => crud.closeModal());
});
