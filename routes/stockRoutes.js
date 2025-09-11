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

module.exports = router;
