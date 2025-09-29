const express = require("express");
const router = express.Router();
const FurnitureStock = require("../../models/furnitureStockModel");
const WoodStock = require("../../models/woodStockModel");
const Sales = require("../../models/salesModel");


router.get("/profitMargin", async (req, res) => {
  try {
    const totalSalesData = await Sales.aggregate([
      { $group: { _id: null, total: { $sum: "$totalPrice" } } }
    ]);

    const totalPurchaseWood = await WoodStock.aggregate([
      { $group: { _id: null, total: { $sum: { $multiply: ["$costPrice", "$quantity"] } } } }
    ]);

    const totalPurchaseFurniture = await FurnitureStock.aggregate([
      { $group: { _id: null, total: { $sum: { $multiply: ["$costPrice", "$quantity"] } } } }
    ]);

    const totalPurchase =
      (totalPurchaseWood[0]?.total || 0) +
      (totalPurchaseFurniture[0]?.total || 0);

    const totalSales = totalSalesData[0]?.total || 0;

    const profitMargin =
      totalSales > 0 ? ((totalSales - totalPurchase) / totalSales) * 100 : 0;

    res.json({ profitMargin: profitMargin.toFixed(2) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error calculating profit margin" });
  }
});


module.exports = router;
