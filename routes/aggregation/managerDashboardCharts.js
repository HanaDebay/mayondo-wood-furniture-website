// userRoutes.js (or manager routes)
const express = require("express");
const router = express.Router();
const Sale = require("../../models/salesModel");
const { ensureAuthenticated, ensureManager } = require("../../middleware/auth");

// Manager Dashboard Charts Route
router.get("/manager-dashboard-chart",ensureAuthenticated,ensureManager,async (req, res) => {
    try {
      // Monthly sales data (group by month & year)
      const monthlySalesData = await Sale.aggregate([
        {
          $group: {
            _id: {
              month: { $month: "$dateOfSale" },
              year: { $year: "$dateOfSale" },
            },
            totalSales: { $sum: "$totalCost" },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
      ]);

      // Sales per agent
      const salesPerAgent = await Sale.aggregate([
        {
          $lookup: {
            from: "users",
            localField: "salesAgent",
            foreignField: "_id",
            as: "agentInfo",
          },
        },
        { $unwind: "$agentInfo" },
        {
          $group: {
            _id: "$agentInfo.fullName",
            totalSales: { $sum: "$totalCost" },
          },
        },
        { $sort: { totalSales: -1 } },
      ]);

      // Category breakdown
      const categoryBreakdown = await Sale.aggregate([
        {
          $group: {
            _id: "$productType",
            totalSales: { $sum: "$totalCost" },
          },
        },
      ]);

      // Top customers
      const topCustomers = await Sale.aggregate([
        {
          $group: {
            _id: "$customerName",
            totalSpent: { $sum: "$totalCost" },
          },
        },
        { $sort: { totalSpent: -1 } },
        { $limit: 5 },
      ]);

      // Attendant activity log
      const activityLog = await Sale.find({})
        .sort({ dateOfSale: -1 })
        .limit(5)
        .populate("salesAgent", "fullName")
        .select("salesAgent dateOfSale productName quantity");
      res.json({
        monthlySalesData,
        salesPerAgent,
        categoryBreakdown,
        topCustomers,
        activityLog,
      });
    } catch (err) {
      console.error("Error fetching dashboard chart data:", err);
      res.status(500).json({ error: "Server error" });
    }
  }
);

module.exports = router;
