document.addEventListener('DOMContentLoaded', () => {
  async function loadCustomers() {
    try {
      const data = await API.get('/customers');
      window.crud.items = data;
      window.crud.render();
      document.getElementById('statTotalCust').textContent = data.length;
      document.getElementById('statActiveCust').textContent = data.filter(c => c.isActive !== false).length;
      document.getElementById('statInactiveCust').textContent = data.filter(c => c.isActive === false).length;
    } catch (err) { console.error(err); }
  }

  window.crud = new CrudManager({
    apiEndpoint: '/customers', tableId: 'customerTable',
    modalId: 'customerModal', modalTitleId: 'customerModalTitle',
    formId: 'customerForm', searchId: 'searchCustomer', label: 'Customer',
    columns: [
      { field: 'name' }, { field: 'email' },
      { field: 'phone', render: (item) => item.phone || '-' },
      { field: 'createdAt', render: (item) => API.formatDate(item.createdAt) },
      { field: 'isActive', render: (item) => API.statusBadge(item.isActive !== false ? 'active' : 'inactive') },
    ],
    fields: [{ field: 'name' }, { field: 'email' }, { field: 'phone' }, { field: 'isActive' }],
  });
  window.crud.load = loadCustomers;
  loadCustomers();
  document.getElementById('closeModal')?.addEventListener('click', () => crud.closeModal());
});
