async function loadDashboard() {
  try {
    const [orders, customers] = await Promise.all([
      API.get('/orders'),
      API.get('/customers'),
    ]);

    const total = orders.length;
    const pending = orders.filter(o => o.status === 'pending').length;
    const processing = orders.filter(o => o.status === 'processing').length;
    const completed = orders.filter(o => o.status === 'completed').length;
    const totalRevenue = orders.reduce((sum, o) => sum + Number(o.totalAmount || 0), 0);

    const activeCustomers = customers.filter(c => c.isActive !== false).length;
    const inactiveCustomers = customers.length - activeCustomers;

    document.getElementById('statTotalOrders').textContent = total;
    document.getElementById('statCompletedOrders').textContent = completed;
    document.getElementById('statTotalCustomers').textContent = customers.length;
    document.getElementById('statPendingOrders').textContent = pending;

    // Recent orders table
    const tbody = document.getElementById('recentOrdersBody');
    if (tbody) {
      const recent = orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
      tbody.innerHTML = recent.map(o => `<tr>
        <td>${o.orderNumber || '#' + o.id.slice(0, 8)}</td>
        <td>${o.customerName}</td>
        <td>${o.packageName}</td>
        <td>${API.formatDate(o.createdAt)}</td>
        <td>${API.formatCurrency(o.totalAmount)}</td>
        <td>${API.statusBadge(o.status)}</td>
      </tr>`).join('');
    }

    // Mini chart bars
    const chart = document.getElementById('revenueChart');
    if (chart && orders.length > 0) {
      const last30 = orders.filter(o => {
        const d = new Date(o.createdAt);
        return d > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      });
      const days = Array.from({ length: 12 }, (_, i) => {
        const dayStart = new Date(Date.now() - (11 - i) * 24 * 60 * 60 * 1000);
        const dayEnd = new Date(dayStart.getTime() + 24 * 60 * 60 * 1000);
        return last30.filter(o => {
          const d = new Date(o.createdAt);
          return d >= dayStart && d < dayEnd;
        }).reduce((s, o) => s + Number(o.totalAmount || 0), 0);
      });
      const max = Math.max(...days, 1);
      chart.innerHTML = days.map(v => `<div class="chart-bar" style="height:${(v / max) * 100}%"></div>`).join('');
      setTimeout(() => {
        document.querySelectorAll('.chart-bar').forEach((bar, i) => {
          const h = bar.style.height;
          bar.style.height = '0%';
          setTimeout(() => { bar.style.height = h; }, i * 80);
        });
      }, 100);
    }
  } catch (err) {
    console.error('Dashboard load error:', err);
  }
}

document.addEventListener('DOMContentLoaded', loadDashboard);
