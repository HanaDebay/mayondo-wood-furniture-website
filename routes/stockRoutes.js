const express = require("express");
const router = express.Router();

const FurnitureStockModel = require("../models/furnitureStockModel");
const WoodStockModel = require("../models/woodStockModel");

router.get("/registerFurniture", (req, res) => {
  console.log("GET /registerFurniture hit!");
  res.render("registerFurnitureStock");
});

router.post("/registerFurniture", async (req, res) => {
  try {
    const furnitureStock = new FurnitureStockModel(req.body);
    console.log(req.body);
    await furnitureStock.save();
    res.redirect("/managerDashboard");
  } catch (error) {
    console.error(error);
    res.redirect("/registerFurniture");
  }
});

router.get("/registerWood", (req, res) => {
  res.render("registerWoodStock");
});

router.post("/registerWood", async (req, res) => {
  try {
    const woodStock = new WoodStockModel(req.body);
    console.log(req.body);
    await woodStock.save();
    res.redirect("/managerDashboard");
  } catch (error) {
    console.error(error);
    res.redirect("/registerWood");
  }
});



// GET furniture stock
router.get("/api/furniture-stock", async (req, res) => {
  try {
    const { furnitureType } = req.query;
    const query = {};
    if (furnitureType) query.furnitureType = furnitureType;
    const stock = await FurnitureStockModel.find(query).select("productName quantity");
    res.json(stock);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch furniture stock" });
  }
});

// GET wood stock
router.get("/api/wood-stock", async (req, res) => {
  try {
    const stock = await WoodStockModel.find().select("productName quantity");
    res.json(stock);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch wood stock" });
  }
});



module.exports = router;
