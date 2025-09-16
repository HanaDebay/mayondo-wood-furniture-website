function editSupplier(id) {
  window.location.href = `/edit-supplier/${id}`;
}


function deleteSupplier(id) {
  if(confirm("Are you sure you want to delete this Supplier?")) {
    fetch(`/delete-supplier/${id}`, { method: "DELETE" })
      .then(res => res.json())
      .then(data => {
        alert(data.message || "Deleted successfully");
        location.reload();
      })
      .catch(err => alert("Error deleting Supplier"));
  }
}