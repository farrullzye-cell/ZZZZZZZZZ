document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('toggleSidebar');
  if (toggle) toggle.addEventListener('click', () => {
    document.getElementById('adminSidebar')?.classList.toggle('collapsed');
  });
  const logout = document.getElementById('logoutBtn');
  if (logout) logout.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('admin_token');
    window.location.href = '../index.html';
  });
  const batalBtns = document.querySelectorAll('#btnBatal');
  batalBtns.forEach(btn => btn.addEventListener('click', () => {
    const modal = btn.closest('.modal-overlay');
    if (modal && window.crud) {
      modal.style.display = 'none';
      window.crud.editingId = null;
    }
  }));
});
