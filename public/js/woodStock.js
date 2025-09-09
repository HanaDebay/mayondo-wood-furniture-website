document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("form");

  form.addEventListener("submit", (e) => {
    e.preventDefault(); // Stop default submission

    // Collect required fields
    const requiredFields = [
      "productName",
      "productType",
      "costPrice",
      "sellingPrice",
      "quantity",
      "supplierName",
      "date",
      "quality"
    ];

    let valid = true;
    requiredFields.forEach((id) => {
      const field = document.getElementById(id);
      if (!field.value.trim()) {
        field.classList.add("is-invalid");
        valid = false;
      } else {
        field.classList.remove("is-invalid");
      }
    });

    if (!valid) {
      alert("⚠️ Please fill in all required fields before submitting.");
      return;
    }

    // Optional: Confirmation before saving
    const confirmSave = confirm("Do you want to save this wood stock entry?");
    if (confirmSave) {
      form.submit(); // Submit the form if confirmed
    }
  });

  // Remove invalid class when user types
  const inputs = form.querySelectorAll("input, select");
  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      if (input.value.trim()) {
        input.classList.remove("is-invalid");
      }
    });
  });
});
