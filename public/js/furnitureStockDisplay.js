// Placeholder functions for actions
function editFurniture(id) {
  window.location.href = `/editFurniture/${id}`;
}

function deleteFurniture(id) {
  if(confirm("Are you sure you want to delete this item?")) {
    fetch(`/deleteFurniture/${id}`, { method: "DELETE" })
      .then(res => res.json())
      .then(data => {
        alert(data.message || "Deleted successfully");
        location.reload();
      })
      .catch(err => alert("Error deleting item"));
  }
}
document.getElementById("searchInput").addEventListener("keyup", function() {
  const filter = this.value.toLowerCase();
  document.querySelectorAll("#furnitureTableBody tr").forEach(row => {
    row.style.display = row.textContent.toLowerCase().includes(filter) ? "" : "none";
  });
});