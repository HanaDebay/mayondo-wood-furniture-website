document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signupForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const username = document.getElementById("username").value.trim();
    const role = document.getElementById("role").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const res = await fetch("/register-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fullName, email, phone, username, role, password, confirmPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        alert("User registered successfully as " + role);
        window.location.href = "/login";
      } else {
        alert("Error: " + data.error);
      }
    } catch (err) {
      console.error("Signup Error:", err);
      alert("Something went wrong, please try again.");
    }
  });
});
