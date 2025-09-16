const express = require("express");
const router = express.Router();

const WoodStockModel = require("../models/woodStockModel");


router.get("/registerWood", (req, res) => {
  res.render("registerWoodStock");
});

router.post("/registerWood", async (req, res) => {
  try {
    const woodStock = new WoodStockModel(req.body);
    console.log(req.body);
    await woodStock.save();
    res.redirect("/manager-dashboard");
  } catch (error) {
    console.error(error);
    res.redirect("/registerWood");
  }
});



router.get("/view-wood-stock", async (req, res) => {
  try {
    let wood = await WoodStockModel.find();
    res.render("woodStockDisplay", { wood });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

router.get("/editWood/:id", async (req, res) => {
  try {
    let item = await WoodStockModel.findById(req.params.id);
    res.render("editWoodStock", { item });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

router.post("/updateWood/:id", async (req, res) => {
  try {
    await WoodStockModel.findByIdAndUpdate(req.params.id, req.body);
    res.redirect("/view-wood-stock");
  } catch (error) {
    console.error(error)
    res.status(400).send("Item not found")
  }
});

router.delete("/deleteWood/:id", async (req, res) => {
  try {
    await WoodStockModel.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error deleting item" });
  }
});

module.exports = router;
