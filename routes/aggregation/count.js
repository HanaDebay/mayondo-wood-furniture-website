const express = require("express");
const router = express.Router();
const User = require("../../models/userModel");
const Supplier = require("../../models/supplierModel");
const Sale = require("../../models/salesModel");

const { ensureAuthenticated, ensureManager } = require("../../middleware/auth");

router.get("/count", ensureAuthenticated, ensureManager, async (req, res) => {
  try {
    const attendantsCount = await User.countDocuments({ role: "Sales-Agent" });
    const suppliersCount = await Supplier.countDocuments();

    res.json({ attendantsCount, suppliersCount });
  } catch (err) {
    console.error("Count error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/revenu", ensureAuthenticated, ensureManager, async(req, res) => {
try {
  const result = await Sale.aggregate([
    {$group: {_id: null, totalRevenue: {$sum: "$totalAmount"}}}
  ]);
  const revenue = result[0]?.totalRevenue || 0;
  res.render("managerDashboard", {revenue})
} catch (error) {
  console.error("Error calculating revenue:", err)
  res.status(500).send("Server error");
}
});


router.get("/total-sales", ensureAuthenticated, ensureManager, async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

    // Sum totalCost for all sales within the current month
    const result = await Sale.aggregate([
      {
        $match: {
          dateOfSale: { $gte: startOfMonth, $lte: endOfMonth },
        },
      },
      {
        $group: {
          _id: null,
          totalSalesThisMonth: { $sum: "$totalCost" },
        },
      },
    ]);

    const totalSalesThisMonth = result[0]?.totalSalesThisMonth || 0;

    // Option 1: If rendering directly
    // res.render("managerDashboard", { totalSalesThisMonth });

    // Option 2: If updating dynamically via fetch()
    res.json({ totalSalesThisMonth });

  } catch (err) {
    console.error("Error calculating total sales:", err);
    res.status(500).send("Server error");
  }
});



module.exports = router;
