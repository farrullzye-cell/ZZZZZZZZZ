(function() {
  if (!localStorage.getItem('admin_token')) {
    window.location.href = '../customer/login.html';
  }
})();
