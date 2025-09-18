const express = require("express");
const router = express.Router();
const FurnitureStock = require("../../models/furnitureStockModel");
const WoodStock = require("../../models/woodStockModel");
const { ensureAuthenticated, ensureManager } = require("../../middleware/auth");

// 🔹 Total Furniture Cost
router.get("/totalFurnitureCost", ensureAuthenticated, ensureManager, async (req, res) => {
  try {
    const furnitureTotals = await FurnitureStock.aggregate([
      {
        $group: {
          _id: "$productType",
          totalCost: { $sum: { $multiply: ["$quantity", "$costPrice"] } }
        }
      }
    ]);

    const totalFurnitureCost = furnitureTotals.reduce((acc, f) => acc + f.totalCost, 0);
    res.json({ totalFurnitureCost });
  } catch (err) {
    console.error("Furniture cost error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

// 🔹 Total Wood Cost
router.get("/totalWoodCost", ensureAuthenticated, ensureManager, async (req, res) => {
  try {
    const woodTotals = await WoodStock.aggregate([
      {
        $group: {
          _id: "$productType",
          totalCost: { $sum: { $multiply: ["$quantity", "$costPrice"] } }
        }
      }
    ]);

    const totalWoodCost = woodTotals.reduce((acc, w) => acc + w.totalCost, 0);
    res.json({ totalWoodCost });
  } catch (err) {
    console.error("Wood cost error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
