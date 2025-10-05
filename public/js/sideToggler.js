document.addEventListener("DOMContentLoaded", () => {
  const sidebar = document.querySelector(".sidebar");
  const toggleBtn = document.getElementById("toggleBtn");

  toggleBtn.addEventListener("click", () => {
    sidebar.classList.toggle("collapsed");
  });
});