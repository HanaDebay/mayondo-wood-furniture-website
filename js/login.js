document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('form');
  const usernameInput = document.getElementById('username');
  const passwordInput = document.getElementById('password');

  form.addEventListener('submit', function (event) {
    event.preventDefault(); // prevent default form submission

    const username = usernameInput.value.trim();
    const password = passwordInput.value.trim();

    if (username && password) {
      // Redirect to home/index page
      window.location.href = 'dashboard.html'; 
    } else {
      alert('Please enter both username and password');
    }
  });
});