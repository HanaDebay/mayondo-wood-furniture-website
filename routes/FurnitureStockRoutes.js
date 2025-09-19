const express = require("express");
const router = express.Router();

const FurnitureStockModel = require("../models/furnitureStockModel");


router.get("/registerFurniture", (req, res) => {
  res.render("registerFurnitureStock");
});

router.post("/registerFurniture", async (req, res) => {
  try {
    const furnitureStock = new FurnitureStockModel(req.body);
    console.log(req.body);
    await furnitureStock.save();
    res.redirect("/manager-dashboard");
  } catch (error) {
    console.error(error);
    res.redirect("/registerFurniture");
  }
});

router.get("/view-furniure-stock", async (req, res) => {
  try {
    let furniture = await FurnitureStockModel.find();
    res.render("furnitureStockDisplay", { furniture });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

router.get("/view-furniure-stock", async (req, res) => {
  try {
    let furniture = await FurnitureStockModel.find();
    res.render("furnitureStockDisplay", { furniture });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

router.get("/editFurniture/:id", async (req, res) => {
  try {
    let item = await FurnitureStockModel.findById(req.params.id);
    res.render("editFurnitureStock", { item });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

router.post("/updateFurniture/:id", async (req, res) => {
  try {
    await FurnitureStockModel.findByIdAndUpdate(req.params.id, req.body);
    res.redirect("/view-furniure-stock");
  } catch (error) {
    console.error(error)
    res.status(400).send("Item not found")
  }
});

router.delete("/deleteFurniture/:id", async (req, res) => {
  try {
    await FurnitureStockModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error deleting item" });
  }
});

module.exports = router;
