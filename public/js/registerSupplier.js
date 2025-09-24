document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("year").textContent = new Date().getFullYear();

  const form = document.querySelector("form");
  form.addEventListener("submit", (e) => {
    const supplierName = document.getElementById("supplierName").value.trim();
    const email = document.getElementById("email").value.trim();

    if (!supplierName || !email) {
      e.preventDefault();
      alert("Please fill all required fields.");
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
    localStorage.setItem("sidebar-collapsed", sidebar.classList.contains("collapsed"));
  });