// document.addEventListener("DOMContentLoaded", () => {
//   const form = document.getElementById("signupForm");
//   const messageModal = new bootstrap.Modal(document.getElementById("messageModal"));
//   const messageBody = document.getElementById("messageModalBody");
//   const messageTitle = document.getElementById("messageModalLabel");

//   // Helper function to show modal with custom text
//   function showMessage(title, body, redirect = null) {
//     messageTitle.textContent = title;
//     messageBody.textContent = body;
//     messageModal.show();

//     if (redirect) {
//       document.getElementById("messageModal").addEventListener("hidden.bs.modal", () => {
//         window.location.href = redirect;
//       }, { once: true });
//     }
//   }

  
//   form.addEventListener("submit", async (e) => {
//     e.preventDefault();

//     const fullName = document.getElementById("fullName").value.trim();
//     const email = document.getElementById("email").value.trim();
//     const phone = document.getElementById("phone").value.trim();
//     const username = document.getElementById("username").value.trim();
//     const role = document.getElementById("role").value;
//     const password = document.getElementById("password").value;
//     const confirmPassword = document.getElementById("confirmPassword").value;

//     if (password !== confirmPassword) {
//       showMessage("Password Error", "Passwords do not match!");
//       return;
//     }

//     try {
//       const res = await fetch("/register-user", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ fullName, email, phone, username, role, password, confirmPassword }),
//       });

//       const data = await res.json();

//       if (res.ok) {
//         showMessage("Registration Successful", username + " Registered successfully as " + role, "/manager-dashboard");
//         form.reset();
//       } else {
//         showMessage("Error", data.error || "Registration failed, please try again.");
//       }
//     } catch (err) {
//       console.error("Signup Error:", err);
//       showMessage("Error", "Something went wrong, please try again.");
//     }
//   });
// });

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("signupForm");
  const messageModal = new bootstrap.Modal(document.getElementById("messageModal"));
  const messageBody = document.getElementById("messageModalBody");
  const messageTitle = document.getElementById("messageModalLabel");

  // Helper function to show modal with custom text
  function showMessage(title, body, redirect = null) {
    messageTitle.textContent = title;
    messageBody.textContent = body;
    messageModal.show();

    if (redirect) {
      document.getElementById("messageModal").addEventListener("hidden.bs.modal", () => {
        window.location.href = redirect;
      }, { once: true });
    }
  }

  // Email validation function
  function isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  // Phone validation function
  function isValidPhone(phone) {
    const re = /^(?:\+256|0)\d{9}$/;
    return re.test(phone);
  }

  // Clear inputs on page load to prevent autofill
  form.reset();

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();
    const email = document.getElementById("email").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const username = document.getElementById("username").value.trim();
    const role = document.getElementById("role").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    // Client-side validations
    if (!fullName || !email || !phone || !username || !role || !password || !confirmPassword) {
      showMessage("Error", "All fields are required!");
      return;
    }

    if (!isValidEmail(email)) {
      showMessage("Email Error", "Please enter a valid email address!");
      return;
    }

    if (!isValidPhone(phone)) {
      showMessage("Phone Error", "Please enter a valid phone number!");
      return;
    }

    if (password !== confirmPassword) {
      showMessage("Password Error", "Passwords do not match!");
      return;
    }

    try {
      const res = await fetch("/register-user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, phone, username, role, password, confirmPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        showMessage("Registration Successful", `${username} Registered successfully as ${role}`, "/manager-dashboard");
        form.reset();
      } else {
        showMessage("Error", data.error || "Registration failed, please try again.");
      }
    } catch (err) {
      console.error("Signup Error:", err);
      showMessage("Error", "Something went wrong, please try again.");
    }
  });
});


const sidebar = document.querySelector(".sidebar");
const toggleIcon = document.getElementById("sidebarToggle");

// Restore saved state from localStorage
if (localStorage.getItem("sidebar-collapsed") === "true") {
  sidebar.classList.add("collapsed");
}

toggleIcon.addEventListener("click", () => {
  sidebar.classList.toggle("collapsed");

  // Save state so it's remembered after refresh
  localStorage.setItem(
    "sidebar-collapsed",
    sidebar.classList.contains("collapsed")
  );
});
