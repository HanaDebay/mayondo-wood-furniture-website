document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Login failed. Try again.");
        return;
      }

      // Store token (for authentication in future requests)
      localStorage.setItem("token", data.token);

      // Redirect based on role
      if (data.role === "manager") {
        window.location.href = "managerDashboard.html";
      } else if (data.role === "attendant") {
        window.location.href = "attendantDashboard.html";
      } else {
        alert("Unknown role. Contact admin.");
      }

    } catch (error) {
      console.error("Error:", error);
      alert("Something went wrong. Please try again later.");
    }
  });
});
