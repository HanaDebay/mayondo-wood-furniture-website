function editUser(id) {
  window.location.href = `/edit-user/${id}`;
}
function deleteFurniture(id) {
  if(confirm("Are you sure you want to delete this item?")) {
    fetch(`/delete-user/${id}`, { method: "DELETE" })
      .then(res => res.json())
      .then(data => {
        alert(data.message || "Deleted successfully");
        location.reload();
      })
      .catch(err => alert("Error deleting item"));
  }
}