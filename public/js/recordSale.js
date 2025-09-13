document.addEventListener("DOMContentLoaded", () => {
  const yearSpan = document.getElementById("year");
  yearSpan.textContent = new Date().getFullYear();

  const stockType = document.getElementById("stockType");
  const stockId = document.getElementById("stockId");
  const priceInput = document.getElementById("price");
  const quantityInput = document.getElementById("quantity");
  const totalPriceInput = document.getElementById("totalPrice");

  // Load products dynamically based on stockType
  stockType.addEventListener("change", async () => {
    const type = stockType.value;
    stockId.innerHTML = `<option value="" disabled selected>Loading...</option>`;

    try {
      const response = await fetch(`/api/${type}Stocks`); // e.g. /api/woodStocks or /api/furnitureStocks
      const products = await response.json();

      stockId.innerHTML = `<option value="" disabled selected>Select a product</option>`;
      products.forEach(item => {
        const option = document.createElement("option");
        option.value = item._id;
        option.textContent = `${item.productName} (Qty: ${item.quantity})`;
        option.dataset.price = item.sellingPrice;
        stockId.appendChild(option);
      });
    } catch (err) {
      stockId.innerHTML = `<option value="" disabled selected>Error loading products</option>`;
    }
  });

  // Update price when product selected
  stockId.addEventListener("change", () => {
    const selectedOption = stockId.options[stockId.selectedIndex];
    priceInput.value = selectedOption.dataset.price || "";
    calculateTotal();
  });

  // Update total price when quantity changes
  quantityInput.addEventListener("input", calculateTotal);

  function calculateTotal() {
    const price = parseFloat(priceInput.value) || 0;
    const qty = parseInt(quantityInput.value) || 0;
    totalPriceInput.value = price * qty;
  }
});
