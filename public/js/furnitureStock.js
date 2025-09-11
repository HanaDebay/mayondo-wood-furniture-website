document.addEventListener("DOMContentLoaded", () => {
  const productType = document.getElementById("productType");
  const furnitureOptionsDiv = document.getElementById("furnitureOptions");
  const furnitureType = document.getElementById("furnitureType");

  const homeFurniture = [
    { value: "bed", text: "Bed" },
    { value: "sofa", text: "Sofa" },
    { value: "dining", text: "Dining Table" },
    { value: "cupboard", text: "Cupboard" },
    { value: "drawers", text: "Drawers" },
    { value: "shelf", text: "Shelf" },
    { value: "wardrobe", text: "Wardrobe" },
    { value: "tv-stand", text: "TV Stand" }
  ];

  const officeFurniture = [
    { value: "desk", text: "Desk" },
    { value: "chair", text: "Chair" },
    { value: "shelf", text: "Shelf" },
    { value: "drawers", text: "Drawers" },
    { value: "Table", text: "Table" }

  ];

  productType.addEventListener("change", () => {
    const selectedType = productType.value;
    let optionsArray = [];

    if (selectedType === "furniture-home") {
      optionsArray = homeFurniture;
    } else if (selectedType === "furniture-office") {
      optionsArray = officeFurniture;
    }

    // Clear previous options
    furnitureType.innerHTML = '<option value="" disabled selected>Select furniture type</option>';

    // Populate new options
    optionsArray.forEach((item) => {
      const opt = document.createElement("option");
      opt.value = item.value;
      opt.textContent = item.text;
      furnitureType.appendChild(opt);
    });

    // Show the dropdown only when a valid productType is selected
    furnitureOptionsDiv.style.display = optionsArray.length ? "block" : "none";
  });
});
