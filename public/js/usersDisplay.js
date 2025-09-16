function editUser(id) {
  window.location.href = `/edit-user/${id}`;
}
function deleteUser(id) {
  if (confirm("Are you sure you want to delete this user?")) {
    fetch(`/delete-user/${id}`, { method: "DELETE" })
      .then((res) => res.json())
      .then((data) => {
        alert(data.message || "Deleted successfully");
        location.reload();
      })
      .catch((err) => alert("Error deleting user"));
  }
}


document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  const tableBody = document.getElementById("userTableBody");

  searchInput.addEventListener("keyup", function () {
    const filter = this.value.toLowerCase();
    const rows = tableBody.getElementsByTagName("tr");

    for (let i = 0; i < rows.length; i++) {
      const rowText = rows[i].innerText.toLowerCase();
      rows[i].style.display = rowText.includes(filter) ? "" : "none";
    }
  });
});

