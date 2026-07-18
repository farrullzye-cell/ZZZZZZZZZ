document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('toggleSidebar');
  const sidebar = document.getElementById('adminSidebar');
  const overlay = document.getElementById('sidebarOverlay');

  function openSidebar() {
    if (!sidebar) return;
    if (window.innerWidth <= 768) {
      sidebar.classList.add('open');
      if (overlay) overlay.classList.add('open');
    } else {
      sidebar.classList.toggle('collapsed');
    }
  }

  function closeSidebar() {
    if (sidebar) sidebar.classList.remove('open');
    if (overlay) overlay.classList.remove('open');
  }

  if (toggle) toggle.addEventListener('click', openSidebar);

  if (overlay) overlay.addEventListener('click', closeSidebar);

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

  const main = document.querySelector('.admin-main');
  if (sidebar && main) {
    main.addEventListener('click', () => {
      if (window.innerWidth <= 768 && sidebar.classList.contains('open')) {
        closeSidebar();
      }
    });
  }

  // Close sidebar when a nav link is clicked on mobile
  if (sidebar) {
    sidebar.querySelectorAll('.sidebar-item').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) closeSidebar();
      });
    });
  }

  window.addEventListener('resize', () => {
    if (window.innerWidth > 768) closeSidebar();
  });
});
