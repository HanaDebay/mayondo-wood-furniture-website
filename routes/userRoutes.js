// Dependencies
const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Purchase = require("../models/purchaseModel");
const Sale = require("../models/salesModel");
const User = require("../models/userModel");
const Supplier = require("../models/supplierModel");
const WoodStock = require("../models/woodStockModel");
const FurnitureStock = require("../models/furnitureStockModel");
const {
  ensureAuthenticated,
  ensureManager,
  ensureSalesAgent,
} = require("../middleware/auth");

// GET Routes
router.get("/manager-dashboard", ensureAuthenticated, ensureManager, async (req, res) => {
  try {
    // --- Purchase Costs ---
    let totalExpenseTimber = await WoodStock.aggregate([
      { $match: { productType: "timber" } },
      {
        $group: {
          _id: null,
          totalCost: { $sum: { $multiply: ["$quantity", "$costPrice"] } }
        }
      }
    ]);
    let totalExpensePoles = await WoodStock.aggregate([
      { $match: { productType: "poles" } },
      {
        $group: {
          _id: null,
          totalCost: { $sum: { $multiply: ["$quantity", "$costPrice"] } }
        }
      }
    ]);
    let totalExpenseSoftWood = await WoodStock.aggregate([
      { $match: { productType: "softwood" } },
      {
        $group: {
          _id: null,
          totalCost: { $sum: { $multiply: ["$quantity", "$costPrice"] } }
        }
      }
    ]);
    let totalExpenseHardWood = await WoodStock.aggregate([
      { $match: { productType: "hardwood" } },
      {
        $group: {
          _id: null,
          totalCost: { $sum: { $multiply: ["$quantity", "$costPrice"] } }
        }
      }
    ]);

    totalExpenseTimber = totalExpenseTimber[0] ?? { totalCost: 0 };
    totalExpensePoles = totalExpensePoles[0] ?? { totalCost: 0 };
    totalExpenseSoftWood = totalExpenseSoftWood[0] ?? { totalCost: 0 };
    totalExpenseHardWood = totalExpenseHardWood[0] ?? { totalCost: 0 };

    // --- Sales (This Month) ---
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    startOfMonth.setHours(0, 0, 0, 0);

    const endOfMonth = new Date(startOfMonth);
    endOfMonth.setMonth(endOfMonth.getMonth() + 1);
    endOfMonth.setMilliseconds(-1);

    const monthlySales = await Sale.aggregate([
      {
        $match: { dateOfSale: { $gte: startOfMonth, $lte: endOfMonth } }
      },
      {
        $group: { _id: null, total: { $sum: "$totalCost" } }
      }
    ]);
    const totalSalesThisMonth = monthlySales[0]?.total || 0;

    // --- Attendants Count ---
    const attendantsCount = await User.countDocuments({ role: "SalesAgent" });

    // --- Suppliers Count ---
    const suppliersCount = await Supplier.countDocuments();

    // --- Sales Per Attendant (Bar Chart) ---
    const salesPerAttendant = await Sale.aggregate([
      {
        $group: {
          _id: "$salesAgent",
          total: { $sum: "$totalCost" }
        }
      },
      {
        $lookup: {
          from: "users",
          localField: "_id",
          foreignField: "_id",
          as: "agent"
        }
      },
      {
        $unwind: "$agent"
      },
      {
        $project: {
          agentName: "$agent.fullName",
          total: 1
        }
      }
    ]);

    // --- Product Category Breakdown (Pie Chart) ---
    const categoryBreakdown = await Sale.aggregate([
      {
        $group: {
          _id: "$productType",
          total: { $sum: "$totalCost" }
        }
      }
    ]);

    // --- Monthly Sales Trend (Line Chart) ---
    const salesTrend = await Sale.aggregate([
      {
        $group: {
          _id: { month: { $month: "$dateOfSale" }, year: { $year: "$dateOfSale" } },
          total: { $sum: "$totalCost" }
        }
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);
    
    // Total Sales
    const totalSales = await Sale.aggregate([
      { $group: { _id: null, total: { $sum: "$totalCost" } } }
    ]);
    const totalPurchaseWood = await WoodStock.aggregate([
      { $group: { _id: null, total: { $sum: "$costPrice" } } }
    ]);
    const totalPurchaseFurniture = await FurnitureStock.aggregate([
      { $group: { _id: null, total: { $sum: "$costPrice" } } }
    ]);

    const sales = totalSales[0]?.total || 0;
    const purchase = (totalPurchaseWood[0]?.total || 0) +
                     (totalPurchaseFurniture[0]?.total || 0);

    // console.log("Total Sales:", sales);
    // console.log("Total Purchase:", purchase);
    // console.log("Revenue:", sales - purchase);
    

     // Total Sales (sum of totalCost in Sale collection)
    const totalSalesResult = await Sale.aggregate([
      { $group: { _id: null, totalSales: { $sum: "$totalCost" } } }
    ]);
    const totalSalesProfit = Number(totalSalesResult[0]?.totalSalesProfit || 0);

    // Total Purchases (sum of totalPurchaseCost in Purchase collection)
    const totalPurchaseResult = await Purchase.aggregate([
      { $group: { _id: null, totalPurchase: { $sum: "$totalPurchaseCost" } } }
    ]);
    const totalPurchase = Number(totalPurchaseResult[0]?.totalPurchase || 0);

    // Calculate Gross Profit
    const grossProfit = totalSalesProfit - totalPurchase;

    res.render("managerDashboardContent", {
      manager: req.session.user,
      totalExpenseTimber,
      totalExpensePoles,
      totalExpenseSoftWood,
      totalExpenseHardWood,
      totalSalesThisMonth,
      attendantsCount,
      suppliersCount,
      salesPerAttendant,
      categoryBreakdown,
      salesTrend,
      revenue: sales - purchase, 
      sales, 
      purchase,
      totalSalesProfit,
      totalPurchase,
      grossProfit

    });

  } catch (error) {
    console.error("Aggregation Error:", error.message);
    res.status(500).send("Unable to load Manager Dashboard");
  }
});

router.get("/sales-agent-dashboard", ensureAuthenticated, ensureSalesAgent,async (req, res) => {
    try {
      const agentId = req.session.user._id;

      // First and last day of this month
      const startOfMonth = new Date();
      startOfMonth.setDate(1);
      startOfMonth.setHours(0, 0, 0, 0);

      const endOfMonth = new Date(startOfMonth);
      endOfMonth.setMonth(endOfMonth.getMonth() + 1);
      endOfMonth.setMilliseconds(-1);

      const salesThisMonth = await Sale.find({
        salesAgent: req.session.user._id,
        dateOfSale: { $gte: startOfMonth, $lte: endOfMonth },
      });
      // Total sales this month
      const monthlySalesAgg = await Sale.aggregate([
        {
          $match: {
            salesAgent: new mongoose.Types.ObjectId(agentId),
            dateOfSale: { $gte: startOfMonth, $lte: endOfMonth },
          },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$totalCost" },
            count: { $sum: 1 },
          },
        },
      ]);

      const totalThisMonth = monthlySalesAgg[0]?.total || 0;
      const totalTransactions = monthlySalesAgg[0]?.count || 0;

      const monthlySalesByDay = {};
      salesThisMonth.forEach((sale) => {
        const day = sale.dateOfSale.getDate();
        if (!monthlySalesByDay[day]) monthlySalesByDay[day] = 0;
        monthlySalesByDay[day] += sale.totalCost;
      });

      // Recent transactions (last 5)
      const recentTransactions = await Sale.find({ salesAgent: agentId })
        .sort({ dateOfSale: -1 })
        .limit(5);

      res.render("salesAgentDashboardContent", {
        agent: req.session.user,
        totalThisMonth,
        totalTransactions,
        monthlySalesByDay,
        recentTransactions,
      });
    } catch (err) {
      console.error("Dashboard Error:", err);
      res.status(500).send("Server Error");
    }
  }
);

router.get("/view-user", async (req, res) => {
  try {
    let users = await User.find();
    res.render("displayUser", { users });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

router.get("/edit-user/:id", async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    res.render("editUser", { user });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error! ");
  }
});

router.post("/edit-user/:id", async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, req.body);
    res.redirect("/view-user");
  } catch (error) {
    console.error(error);
    res.status(400).send("User not found");
  }
});

router.delete("/delete-user/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.redirect("/view-user");
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error deleting user" });
  }
});

router.get("/view-stock", ensureAuthenticated, ensureSalesAgent, async (req, res) => {
  try {
    const woodStocks = await WoodStock.find();
    const furnitureStocks = await FurnitureStock.find();

    // Combine stocks in one array
    const stocks = [...woodStocks, ...furnitureStocks];

    res.render("viewStock", { stocks });
  } catch (err) {
    console.error("Error loading stocks:", err.message);
    res.status(500).send("Error loading stocks");
  }
});



module.exports = router;
