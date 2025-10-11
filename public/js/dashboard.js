const sidebar = document.querySelector(".sidebar");
const toggleIcon = document.getElementById("sidebarToggle");

// Restore saved state from localStorage
if (localStorage.getItem("sidebar-collapsed") === "true") {
  sidebar.classList.add("collapsed");
}

toggleIcon.addEventListener("click", () => {
  sidebar.classList.toggle("collapsed");

  // Save state so it's remembered after refresh
  localStorage.setItem(
    "sidebar-collapsed",
    sidebar.classList.contains("collapsed")
  );
});

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
      data.topCustomers.forEach((c) => {
        const li = document.createElement("li");
        li.className = "list-group-item";
        li.textContent = `${c._id} - UGX ${c.totalSpent.toLocaleString()}`;
        topCustomersUl.appendChild(li);
      });
    }


    // ACTIVITY LOG
    const activityTbody = document.querySelector("table tbody");
    if (activityTbody) {
      activityTbody.innerHTML = "";
      data.activityLog.forEach((log) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
          <td>${log.salesAgent?.fullName || "Unknown"}</td>
          <td>Recorded Sale of ${log.productName || "N/A"} x${
          log.quantity || 0
        }</td>
          <td>${new Date(log.dateOfSale).toLocaleDateString()}</td>
        `;
        activityTbody.appendChild(tr);
      });
    }

 
    // CHARTS
    // Sales per Agent
    const barCtx = document.querySelector("#barChart")?.getContext("2d");
    if (barCtx) {
      new Chart(barCtx, {
        type: "bar",
        data: {
          labels: data.salesPerAgent.map((a) => a._id || "Unknown"), // 👈 now _id is the name
          datasets: [
            {
              label: "Sales per Agent",
              data: data.salesPerAgent.map((a) => a.totalSales),
              backgroundColor: "#3b82f6",
            },
          ],
        },
      });
    }

    // 🔹 Product Category Breakdown
    const pieCtx = document.querySelector("#pieChart")?.getContext("2d");
    if (pieCtx) {
      new Chart(pieCtx, {
        type: "pie",
        data: {
          labels: data.categoryBreakdown.map((c) => c._id || "Unknown"),
          datasets: [
            {
              data: data.categoryBreakdown.map((c) => c.totalSales),
              backgroundColor: ["#3b82f6", "#f59e0b", "#10b981", "#ef4444"],
            },
          ],
        },
      });
    }

    // 🔹 Monthly Sales Trend
    const lineCtx = document.querySelector("#lineChart")?.getContext("2d");
    if (lineCtx) {
      new Chart(lineCtx, {
        type: "line",
        data: {
          labels: data.monthlySalesData.map(
            (m) =>
              `${new Date(m._id.year, m._id.month - 1).toLocaleString(
                "default",
                { month: "short" }
              )} ${m._id.year}`
          ),
          datasets: [
            {
              label: "Monthly Sales",
              data: data.monthlySalesData.map((m) => m.totalSales),
              borderColor: "#10b981",
              fill: false,
            },
          ],
        },
      });
    }
  } catch (err) {
    console.error("Error loading dashboard:", err);
  }
}

async function fetchTotalPurchase() {
  try {
    const response = await fetch("/totalPurchase");
    const data = await response.json();
    document.getElementById(
      "totalPurchase"
    ).textContent = `${data.totalPurchase.toLocaleString()} UGX`;
  } catch (error) {
    console.error(error);
    document.getElementById("totalPurchase").textContent =
      "Error fetching data";
  }
}

// async function fetchProfitMargin() {
//   try {
//       const res = await fetch("/profit-margin");
//       const data = await res.json();

//       document.getElementById("profitMargin").textContent = `${data.profitMargin}%`;
//       // optional: show profit too if you have an element for it
//       if (document.getElementById("profit")) {
//         document.getElementById("profit").textContent = `${data.profit} UGX`;
//       }
//     } catch (error) {
//       console.error("Error fetching profit margin:", error);
//       document.getElementById("profitMargin").textContent = "Error";
//     }
//   }

  document.addEventListener("DOMContentLoaded", () => {
    fetchProfitMargin();
  });

  async function fetchProfitMargin() {
    try {
      const res = await fetch("/profit-margin");
      const data = await res.json();

      document.getElementById("profitMargin").textContent = `${data.profitMargin}%`;
      // optional: show profit too if you have an element for it
      if (document.getElementById("profit")) {
        document.getElementById("profit").textContent = `${data.profit} UGX`;
      }
    } catch (error) {
      console.error("Error fetching profit margin:", error);
      document.getElementById("profitMargin").textContent = "Error";
    }
  }

document.addEventListener("DOMContentLoaded", async () => {
  const totalSalesElement = document.getElementById("totalSales");

  try {
    const res = await fetch("/total-sales");
    const data = await res.json();

    const formatted = data.totalSalesThisMonth.toLocaleString();
    totalSalesElement.textContent = `${formatted} UGX`;
  } catch (err) {
    console.error("Error fetching total sales:", err);
    totalSalesElement.textContent = "Error";
  }
});

async function fetchMonthlyRevenue() {
  try {
    const response = await fetch("/monthly-revenue");
    const data = await response.json();
    document.getElementById(
      "revenu"
    ).textContent = `${data.totalRevenueThisMonth.toLocaleString()} UGX`;
  } catch (error) {
    console.error(error);
    document.getElementById("revenu").textContent =
      "Error fetching data";
  }
}

async function loadLowStock() {
  const ul = document.getElementById("lowStockList");
  ul.innerHTML = ""; 

  try {
    const response = await fetch("/low-stock"); 
    const data = await response.json();

    // Combine furniture and wood
    const lowStockItems = [
      ...data.furniture.map(item => ({
        name: item.productName,
        type: "Furniture",
        quantity: item.quantity
      })),
      ...data.wood.map(item => ({
        name: item.productName,
        type: "Wood",
        quantity: item.quantity
      }))
    ];

    if (lowStockItems.length === 0) {
      ul.innerHTML = `<li class="text-success">All products sufficiently stocked!</li>`;
      return;
    }

    // Populate list
    lowStockItems.forEach(item => {
      const li = document.createElement("li");
      li.textContent = `${item.name} (${item.type}) - Qty: ${item.quantity}`;
      ul.appendChild(li);
    });

  } catch (err) {
    console.error(err);
    ul.innerHTML = `<li class="text-danger">Error loading low stock</li>`;
  }
}

async function loadTotalStock() {
  const totalStockElem = document.getElementById("totalStock");
  try {
    const res = await fetch("/total-stock", {
      headers: { Accept: "application/json" }
    });
    const data = await res.json();
    totalStockElem.textContent = data.totalStock;
  } catch (err) {
    console.error(err);
    totalStockElem.textContent = "Error";
  }
}

// Call on page load
loadTotalStock();





// Call on page load
loadLowStock();


fetchMonthlyRevenue();
// fetchProfitMargin();
fetchTotalPurchase();
loadManagerDashboard();
// loadPurchaseCosts();
loadCounts();
