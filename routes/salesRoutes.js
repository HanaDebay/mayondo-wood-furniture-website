const express = require("express");
const router = express.Router();
const { ensureAuthenticated, ensureSalesAgent, ensureManager } = require("../middleware/auth")
const Sale = require("../models/salesModel");
const WoodStock = require("../models/woodStockModel");
const FurnitureStock = require("../models/furnitureStockModel");


router.get("/record-sale", ensureAuthenticated, ensureSalesAgent, async (req, res) => {
  try {
    const woodStocks = await WoodStock.find();
    const furnitureStocks = await FurnitureStock.find();

    // Pass stocks as JSON strings for external JS
    res.render("recordSale", {
      agent: req.session.user, 
      woodStocks: JSON.stringify(woodStocks),
      furnitureStocks: JSON.stringify(furnitureStocks)
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading sales form");
  }
});


router.post("/record-sale", ensureAuthenticated, ensureSalesAgent, async (req, res) => {
  try {
    const { productId, productType, quantity, paymentMethod, customerName, transportation, dateOfSale } = req.body;

    let stock;
    if (productType === "wood") stock = await WoodStock.findById(productId);
    else if (productType === "furniture") stock = await FurnitureStock.findById(productId);

    if (!stock) return res.status(404).send("Stock not found");

    const totalCost = quantity * stock.sellingPrice * (transportation === "company" ? 1.05 : 1);

    const newSale = new Sale({
      productId,
      productName: stock.productName,
      productType,
      quantity,
      sellingPrice: stock.sellingPrice,
      totalCost,
      paymentMethod,
      customerName,
      transportation,
      salesAgent: req.session.user._id,
      dateOfSale: new Date(dateOfSale)
    });

    await newSale.save();

    // Update stock quantity
    stock.quantity -= quantity;
    await stock.save();

    res.redirect("/sales-agent-dashboard");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error saving sales record");
  }
});


router.get("/my-sales", ensureAuthenticated, ensureSalesAgent, async (req, res) => {
  try {
    const sales = await Sale.find({ salesAgent: req.session.user._id })
      .populate("salesAgent", "username") // get agent name
      .populate("productId"); // optional if you want full stock details

    res.render("mySales", { sales });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading your sales");
  }
});


// 🟢 Manager can view ALL sales
router.get("/all-sales", ensureAuthenticated, ensureManager, async (req, res) => {
  try {
    const sales = await Sale.find()
      .populate("salesAgent", "username role") // show all agents
      .populate("productId");

    res.render("allSales", { sales });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading all sales");
  }
});


module.exports = router