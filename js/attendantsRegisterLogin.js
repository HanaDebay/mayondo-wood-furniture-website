document.getElementById("loginForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const username = document.getElementById("username").value.trim();
  const password = document.getElementById("password").value.trim();

  // ⚠️ Temporary mock users (replace with backend later)
  const users = [
    { username: "manager1", password: "1234", role: "manager" },
    { username: "sales1", password: "1234", role: "sales" },
    { username: "loader1", password: "1234", role: "loader" },
    { username: "offloader1", password: "1234", role: "offloader" }
  ];

  // Find matching user
  const user = users.find(u => u.username === username && u.password === password);

  if (user) {
    // Redirect based on role
    if (user.role === "manager") {
      window.location.href = "managerDashboard.html";
    } else if (user.role === "sales") {
      window.location.href = "salesDashboard.html";
    } else if (user.role === "loader") {
      window.location.href = "loaderDashboard.html";
    } else if (user.role === "offloader") {
      window.location.href = "offloaderDashboard.html";
    }
  } else {
    alert("❌ Invalid username or password");
  }
});
