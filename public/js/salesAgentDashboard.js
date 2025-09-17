document.addEventListener("DOMContentLoaded", () => {
  const ctx = document.getElementById("monthlySalesChart").getContext("2d");

  // Prepare labels and data
  const days = Object.keys(monthlySalesData).map(day => `Day ${day}`);
  const totals = Object.values(monthlySalesData);

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: days,
      datasets: [{
        label: "Sales (UGX)",
        data: totals,
        backgroundColor: "rgba(2, 138, 92, 0.6)",
        borderColor: "rgba(2, 138, 92, 1)",
        borderWidth: 1
      }]
    },
    options: {
      scales: {
        y: { beginAtZero: true },
        x: { title: { display: true, text: 'Day of Month' } }
      }
    }
  });
});
