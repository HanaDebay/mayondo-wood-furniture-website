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
