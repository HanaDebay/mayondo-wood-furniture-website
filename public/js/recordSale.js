// Stocks passed from Pug
const woodStocks = window.woodStocks || [];
const furnitureStocks = window.furnitureStocks || [];

// DOM Elements
const productType = document.getElementById("productType");
const productId = document.getElementById("productId");
const availableStockInput = document.getElementById("availableStock");
const unitPrice = document.getElementById("unitPrice");
const quantity = document.getElementById("quantity");
const transportation = document.getElementById("transportation");
const totalCost = document.getElementById("totalCost");
const form = document.getElementById("recordSaleForm");

// Populate products based on product type
productType.addEventListener("change", () => {
  const type = productType.value;
  let selectedStocks = [];

  if (type === "WoodStock") selectedStocks = woodStocks;
  else if (type === "FurnitureStock") selectedStocks = furnitureStocks;

  // Clear previous options
  productId.innerHTML = `<option value="" disabled selected>Select product</option>`;

  // Add options dynamically with available stock
  selectedStocks.forEach(item => {
    const option = document.createElement("option");
    option.value = item._id;
    option.text = `${item.productName} (Available: ${item.quantity})`;
    option.setAttribute("data-price", item.sellingPrice);
    option.setAttribute("data-available", item.quantity);
    productId.appendChild(option);
  });

  // Reset unit price, available stock, quantity, total cost
  unitPrice.value = "";
  availableStockInput.value = "";
  quantity.value = "";
  totalCost.value = "";
});

// Update unit price and available stock when a product is selected
productId.addEventListener("change", () => {
  const selectedOption = productId.selectedOptions[0];
  unitPrice.value = selectedOption.getAttribute("data-price");
  availableStockInput.value = selectedOption.getAttribute("data-available");
  calculateTotal();
});

// Calculate total cost
function calculateTotal() {
  const qty = parseFloat(quantity.value) || 0;
  const price = parseFloat(unitPrice.value) || 0;
  let total = qty * price;

  if (transportation.checked) {
    total += total * 0.05;
  }

  totalCost.value = total.toFixed(2);
}

// Recalculate total when quantity or transportation changes
quantity.addEventListener("input", calculateTotal);
transportation.addEventListener("change", calculateTotal);

// Prevent selling more than available stock
form.addEventListener("submit", (e) => {
  const qty = parseFloat(quantity.value);
  const available = parseFloat(availableStockInput.value);
  if (qty > available) {
    e.preventDefault();
    alert("Quantity exceeds available stock!");
  }
});
