
  const signupForm = document.getElementById('signupForm');

  signupForm.addEventListener('submit', function(e) {
    e.preventDefault(); // Prevent default form submission

    // Optional: you can validate passwords here
    const password = signupForm.password.value;
    const confirmPassword = signupForm.confirmPassword.value;

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Optional: store data in localStorage if you want to keep it temporarily
    const managerData = {
      name: signupForm.name.value,
      email: signupForm.email.value,
      password: password
    };
    localStorage.setItem('manager', JSON.stringify(managerData));

    // Redirect to login page
    window.location.href = 'login.html';
  });

