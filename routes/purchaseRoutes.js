const express = require("express");
const router = express.Router();
const Purchase = require("../models/purchaseModel");

router.post("/add", async (req, res) => {
  try {
    const { productName, productType, quantity, costPrice, supplierName } = req.body;

    // Calculate totalPurchaseCost
    const totalPurchaseCost = quantity * costPrice;

    const newPurchase = new Purchase({
      productName,
      productType,
      quantity,
      costPrice,
      totalPurchaseCost,
      supplierName,
      purchaseDate: new Date()
    });

    await newPurchase.save();
    res.status(201).json({ message: "Purchase added successfully", purchase: newPurchase });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/:id", async (req, res) => {
  try {
    const purchase = await Purchase.findById(req.params.id);
    if (!purchase) return res.status(404).json({ error: "Purchase not found" });
    res.json(purchase);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;







