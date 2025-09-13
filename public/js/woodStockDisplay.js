// Placeholder functions for Edit and Delete
function editWood(id) {
  window.location.href = `/editWood/${id}`;
}

function deleteWood(id) {
  if(confirm("Are you sure you want to delete this item?")) {
    fetch(`/deleteWood/${id}`, { method: "DELETE" })
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
  document.querySelectorAll("#woodTableBody tr").forEach(row => {
    row.style.display = row.textContent.toLowerCase().includes(filter) ? "" : "none";
  });
});

