// async function loadManagerDashboard() {
//   try {
//     const response = await fetch("/manager-dashboard-chart");
//     const data = await response.json();

//     // Top cards
//     document.querySelector("#attendants").textContent = data.attendantsCount;

//     // Top Customers
//     const topCustomersUl = document.querySelector("#topCustomers");
//     topCustomersUl.innerHTML = "";
//     data.topCustomers.forEach(c => {
//       const li = document.createElement("li");
//       li.className = "list-group-item";
//       li.textContent = `${c._id} - UGX ${c.totalSpent.toLocaleString()}`;
//       topCustomersUl.appendChild(li);
//     });

//     // Attendant Activity Log
//     const activityTbody = document.querySelector("table tbody");
//     activityTbody.innerHTML = "";
//     data.activityLog.forEach(log => {
//       const tr = document.createElement("tr");
//       tr.innerHTML = `
//         <td>${log.salesAgent.fullName}</td>
//         <td>Recorded Sale of ${log.productName} x${log.quantity}</td>
//         <td>${new Date(log.dateOfSale).toLocaleDateString()}</td>
//       `;
//       activityTbody.appendChild(tr);
//     });

//     // Charts (same as before)
//     const barCtx = document.querySelector("#barChart").getContext("2d");
//     new Chart(barCtx, {
//       type: "bar",
//       data: {
//         labels: data.salesPerAgent.map(a => a.agentName),
//         datasets: [{ label: "Sales per Agent", data: data.salesPerAgent.map(a => a.totalSales), backgroundColor: "#3b82f6" }]
//       }
//     });

//     const pieCtx = document.querySelector("#pieChart").getContext("2d");
//     new Chart(pieCtx, {
//       type: "pie",
//       data: {
//         labels: data.categoryBreakdown.map(c => c._id),
//         datasets: [{ data: data.categoryBreakdown.map(c => c.totalSales), backgroundColor: ["#3b82f6", "#f59e0b"] }]
//       }
//     });

//     const lineCtx = document.querySelector("#lineChart").getContext("2d");
//     new Chart(lineCtx, {
//       type: "line",
//       data: {
//         labels: data.monthlySalesData.map(m => `${m._id.month}/${m._id.year}`),
//         datasets: [{ label: "Monthly Sales", data: data.monthlySalesData.map(m => m.totalSales), borderColor: "#10b981", fill: false }]
//       }
//     });

//   } catch (err) {
//     console.error("Error loading dashboard:", err);
//   }
// }

// loadManagerDashboard();
async function loadPurchaseCosts() {
  const woodResp = await fetch("/totalWoodCost");
  const woodData = await woodResp.json();
  document.querySelector("#woodCost").textContent = woodData.totalWoodCost.toLocaleString() + " UGX";

  const furnitureResp = await fetch("/totalFurnitureCost");
  const furnitureData = await furnitureResp.json();
  document.querySelector("#furnitureCost").textContent = furnitureData.totalFurnitureCost.toLocaleString() + " UGX";

  const total = woodData.totalWoodCost + furnitureData.totalFurnitureCost;
  document.querySelector("#totalPurchase").textContent = total.toLocaleString() + " UGX";
}

async function loadCounts() {
  const resp = await fetch("/count");
  const data = await resp.json();
  document.querySelector("#attendants").textContent = data.attendantsCount;
  document.querySelector("#suppliers").textContent = data.suppliersCount;
}
async function loadManagerDashboard() {
  try {
    const response = await fetch("/manager-dashboard-chart");
    const data = await response.json();
    console.log("Chart Data:", data); 
    // =====================
    // TOP CUSTOMERS
    // =====================
    const topCustomersUl = document.querySelector("#topCustomers");
    if (topCustomersUl) {
      topCustomersUl.innerHTML = "";
      data.topCustomers.forEach(c => {
        const li = document.createElement("li");
        li.className = "list-group-item";
        li.textContent = `${c._id} - UGX ${c.totalSpent.toLocaleString()}`;
        topCustomersUl.appendChild(li);
      });
    }

    // =====================
    // ACTIVITY LOG
    // =====================
    const activityTbody = document.querySelector("table tbody");
    if (activityTbody) {
      activityTbody.innerHTML = "";
      data.activityLog.forEach(log => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${log.salesAgent?.fullName || "Unknown"}</td>
          <td>Recorded Sale of ${log.productName || "N/A"} x${log.quantity || 0}</td>
          <td>${new Date(log.dateOfSale).toLocaleDateString()}</td>
        `;
        activityTbody.appendChild(tr);
      });
    }

    // =====================
    // CHARTS
    // =====================

    // 🔹 Sales per Agent
    const barCtx = document.querySelector("#barChart")?.getContext("2d");
if (barCtx) {
  new Chart(barCtx, {
    type: "bar",
    data: {
      labels: data.salesPerAgent.map(a => a._id || "Unknown"), // 👈 now _id is the name
      datasets: [{
        label: "Sales per Agent",
        data: data.salesPerAgent.map(a => a.totalSales),
        backgroundColor: "#3b82f6"
      }]
    }
  });
}


    // 🔹 Product Category Breakdown
    const pieCtx = document.querySelector("#pieChart")?.getContext("2d");
    if (pieCtx) {
      new Chart(pieCtx, {
        type: "pie",
        data: {
          labels: data.categoryBreakdown.map(c => c._id || "Unknown"),
          datasets: [{
            data: data.categoryBreakdown.map(c => c.totalSales),
            backgroundColor: ["#3b82f6", "#f59e0b", "#10b981", "#ef4444"]
          }]
        }
      });
    }

    // 🔹 Monthly Sales Trend
    const lineCtx = document.querySelector("#lineChart")?.getContext("2d");
    if (lineCtx) {
      new Chart(lineCtx, {
        type: "line",
        data: {
          labels: data.monthlySalesData.map(m =>m._id),
          datasets: [{
            label: "Monthly Sales",
            data: data.monthlySalesData.map(m => m.totalSales),
            borderColor: "#10b981",
            fill: false
          }]
        }
      });
    }

  } catch (err) {
    console.error("Error loading dashboard:", err);
  }
}


loadManagerDashboard();
loadPurchaseCosts();
loadCounts();
