document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('toggleSidebar');
  if (toggle) toggle.addEventListener('click', () => {
    const sidebar = document.getElementById('adminSidebar');
    if (!sidebar) return;
    if (window.innerWidth <= 768) {
      sidebar.classList.toggle('open');
    } else {
      sidebar.classList.toggle('collapsed');
    }
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
  const sidebar = document.getElementById('adminSidebar');
  const main = document.querySelector('.admin-main');
  if (sidebar && main) {
    main.addEventListener('click', () => {
      if (window.innerWidth <= 768 && sidebar.classList.contains('open')) {
        sidebar.classList.remove('open');
      }
    });
  }
  window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && sidebar) {
      sidebar.classList.remove('open');
    }
  });
});
