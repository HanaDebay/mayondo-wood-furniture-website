// Bar Chart - Sales Per Attendant
new Chart(document.getElementById("barChart"), {
  type: "bar",
  data: {
    labels: ["Attendant A", "Attendant B", "Attendant C", "Attendant D"],
    datasets: [
      {
        label: "Sales ($)",
        data: [12000, 9500, 7800, 13400],
        backgroundColor: ["#4e79a7", "#f28e2b", "#e15759", "#76b7b2"],
      },
    ],
  },
});

// Pie Chart - Product Categories
new Chart(document.getElementById("pieChart"), {
  type: "pie",
  data: {
    labels: ["Timber", "Furniture", "Poles"],
    datasets: [
      {
        data: [40, 35, 25],
        backgroundColor: ["#59a14f", "#edc948", "#af7aa1"],
      },
    ],
  },
});

// Line Chart - Monthly Sales Trend
new Chart(document.getElementById("lineChart"), {
  type: "line",
  data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
    datasets: [
      {
        label: "Sales ($)",
        data: [5000, 7000, 8000, 12000, 9000, 15000, 11000, 18000],
        borderColor: "#4e79a7",
        fill: false,
        tension: 0.3,
      },
    ],
  },
});


