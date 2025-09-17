const express = require("express");
const router = express.Router();
const { ensureAuthenticated, ensureSalesAgent, ensureManager } = require("../middleware/auth")
const Sale = require("../models/salesModel");
const WoodStock = require("../models/woodStockModel");
const FurnitureStock = require("../models/furnitureStockModel");



// GET: Record Sale Form (Sales Agent only)
router.get("/record-sale", ensureAuthenticated, ensureSalesAgent, async (req, res) => {
  try {
    const woodStocks = await WoodStock.find();
    const furnitureStocks = await FurnitureStock.find();

    res.render("recordSale", {
      agent: req.session.user,
      woodStocks,         // send raw objects
      furnitureStocks     // send raw objects
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading sales form");
  }
});


// 🟢 POST: Save Sale Record (Sales Agent only)
router.post("/record-sale", ensureAuthenticated, ensureSalesAgent, async (req, res) => {
  try {
    const { productId, productType, quantity, paymentMethod, customerName, transportation, dateOfSale } = req.body;

    let stock;
    if (productType === "WoodStock") {
      stock = await WoodStock.findById(productId);
    } else if (productType === "FurnitureStock") {
      stock = await FurnitureStock.findById(productId);
    }

    if (!stock) return res.status(404).send("Stock not found");

    // ✅ Check stock availability
    if (quantity > stock.quantity) {
      return res.status(400).send("Error: Quantity exceeds available stock!");
    }

    // ✅ Calculate total cost
    let totalCost = stock.sellingPrice * quantity;
    if (transportation === "company") {
      totalCost += totalCost * 0.05; // add 5%
    }

    // ✅ Create new Sale
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
      salesAgent: req.session.user._id, // track agent
      dateOfSale: new Date(dateOfSale) || new Date()
    });

    await newSale.save();

    // ✅ Update stock quantity
    stock.quantity -= quantity;
    await stock.save();

    res.redirect("/sales-agent-dashboard");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error saving sales record");
  }
});

// 🟢 GET: My Sales (Agent can only see their sales)
router.get("/my-sales", ensureAuthenticated, ensureSalesAgent, async (req, res) => {
  try {
    const sales = await Sale.find({ salesAgent: req.session.user._id });
    res.render("mySales", { sales });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading your sales");
  }
});


// 🟢 GET: All Sales (Manager only)
router.get("/all-sales", ensureAuthenticated, ensureManager, async (req, res) => {
  try {
    const sales = await Sale.find()
      .populate("salesAgent", "username fullName")
      .populate("productId");
console.log("Sales Fetched:", sales)
    res.render("allSales", { sales });
  } catch (err) {
    console.error("Error fetching all sales:", err);
    res.status(500).send("Error loading all sales");
  }
});



module.exports = router