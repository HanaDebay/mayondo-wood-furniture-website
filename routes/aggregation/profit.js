const express = require("express");
const router = express.Router();
const FurnitureStock = require("../../models/furnitureStockModel");
const WoodStock = require("../../models/woodStockModel");
const Sale = require("../../models/salesModel");
const Purchase = require("../../models/purchaseModel");


// router.get("/profitMargin", async (req, res) => {
//   try {
//     const totalSalesData = await Sales.aggregate([
//       { $group: { _id: null, total: { $sum: "$totalPrice" } } }
//     ]);

//     const totalPurchaseWood = await WoodStock.aggregate([
//       { $group: { _id: null, total: { $sum: { $multiply: ["$costPrice", "$quantity"] } } } }
//     ]);

//     const totalPurchaseFurniture = await FurnitureStock.aggregate([
//       { $group: { _id: null, total: { $sum: { $multiply: ["$costPrice", "$quantity"] } } } }
//     ]);

//     const totalPurchase =
//       (totalPurchaseWood[0]?.total || 0) +
//       (totalPurchaseFurniture[0]?.total || 0);

//     const totalSales = totalSalesData[0]?.total || 0;

//     const profitMargin =
//       totalSales > 0 ? ((totalSales - totalPurchase) / totalSales) * 100 : 0;

//     res.json({ profitMargin: profitMargin.toFixed(2) });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Error calculating profit margin" });
//   }
// });

router.get("/profit-margin", async (req, res) => {
  try {
    const totalSalesResult = await Sale.aggregate([
      { $group: { _id: null, totalSales: { $sum: "$totalCost" } } }
    ]);
    const totalSales = Number(totalSalesResult[0]?.totalSales || 0);

    const totalPurchaseResult = await Purchase.aggregate([
      { $group: { _id: null, totalPurchase: { $sum: "$totalPurchaseCost" } } }
    ]);
    const totalPurchase = Number(totalPurchaseResult[0]?.totalPurchase || 0);

    const profit = (totalSales - totalPurchase).toFixed(2);
    const profitMargin = totalSales > 0 ? ((profit / totalSales) * 100).toFixed(2) : 0;
       

    res.json({
      totalSales,
      totalPurchase,
      profitMargin,
      profit
    });

  } catch (error) {
    console.error("Error calculating profit margin:", error);
    res.status(500).send("Server error");
  }
});

module.exports = router;
