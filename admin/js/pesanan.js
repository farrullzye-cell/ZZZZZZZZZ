document.addEventListener('DOMContentLoaded', () => {
  async function loadOrders() {
    try {
      const data = await API.get('/orders');
      window.crud.items = data;
      window.crud.render();
      document.getElementById('statAllOrders').textContent = data.length;
      document.getElementById('statPendingCount').textContent = data.filter(o => o.status === 'pending').length;
      document.getElementById('statProcessingCount').textContent = data.filter(o => o.status === 'processing').length;
      document.getElementById('statCompletedCount').textContent = data.filter(o => o.status === 'completed').length;
    } catch (err) { console.error(err); }
  }

  window.crud = new CrudManager({
    apiEndpoint: '/orders', tableId: 'pesananTable',
    modalId: 'pesananModal', modalTitleId: 'pesananModalTitle',
    formId: 'pesananForm', searchId: 'searchPesanan', label: 'Pesanan',
    columns: [
      { field: 'orderNumber', render: (item) => item.orderNumber || '#' + item.id.slice(0, 8) },
      { field: 'customerName' }, { field: 'packageName' },
      { field: 'createdAt', render: (item) => API.formatDate(item.createdAt) },
      { field: 'totalAmount', render: (item) => API.formatCurrency(item.totalAmount) },
      { field: 'status', render: (item) => API.statusBadge(item.status) },
      { field: 'progress', render: (item) => item.progress != null ? item.progress + '%' : '-' },
      { field: 'paymentStatus', render: (item) => API.statusBadge(item.paymentStatus) },
    ],
    fields: [{ field: 'orderNumber' }, { field: 'customerName' }, { field: 'customerEmail' }, { field: 'customerPhone' }, { field: 'packageName' }, { field: 'packagePrice' }, { field: 'totalAmount' }, { field: 'status' }, { field: 'progress' }, { field: 'paymentStatus' }, { field: 'notes' }],
  });
  window.crud.load = loadOrders;
  loadOrders();
  document.getElementById('closeModal')?.addEventListener('click', () => crud.closeModal());
});
