document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const tableBody = document.getElementById("salesTableBody");
  const rows = Array.from(tableBody.getElementsByTagName("tr"));

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.toLowerCase();

    rows.forEach(row => {
      const cells = Array.from(row.getElementsByTagName("td"));
      const match = cells.some(cell => cell.textContent.toLowerCase().includes(query));
      row.style.display = match ? "" : "none";
    });
  });
});

