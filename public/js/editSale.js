document.addEventListener("DOMContentLoaded", () => {
  const unitPriceInput = document.getElementById("unitPrice");
  const quantityInput = document.getElementById("quantity");
  const transportationSelect = document.getElementById("transportation");
  const totalCostInput = document.getElementById("totalCost");

  function calculateTotal() {
    const unitPrice = parseFloat(unitPriceInput.value) || 0;
    const quantity = parseInt(quantityInput.value) || 0;
    let total = unitPrice * quantity;

    if (transportationSelect.value === "company") {
      total += total * 0.05;
    }

    totalCostInput.value = Math.round(total);
  }

  quantityInput.addEventListener("input", calculateTotal);
  transportationSelect.addEventListener("change", calculateTotal);

  calculateTotal(); // run on page load
});
