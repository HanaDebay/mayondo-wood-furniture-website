const express = require("express");
const PDFDocument = require("pdfkit");
const router = express.Router();
const { ensureAuthenticated, ensureSalesAgent, ensureManager } = require("../middleware/auth")
const Sale = require("../models/salesModel");
const User = require("../models/userModel");
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

// POST: Save Sale Record (Sales Agent only)
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

// GET: My Sales (Agent can only see their sales)
router.get("/my-sales", ensureAuthenticated, ensureSalesAgent, async (req, res) => {
  try {
    const sales = await Sale.find({ salesAgent: req.session.user._id });
    res.render("mySales", { sales });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading your sales");
  }
});

// GET: All Sales (Manager only)
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

router.get("/edit-sale/:id", ensureManager, async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id).populate("salesAgent", "fullName");
    if (!sale) return res.redirect("/all-sales");
    res.render("editSale", { sale });
  } catch (err) {
    console.error("Error loading sale for edit:", err);
    res.redirect("/all-sales");
  }
});

router.post("/edit-sale/:id", ensureManager, async (req, res) => {
  try {
    const { quantity, sellingPrice, customerName, paymentMethod, transportation } = req.body;

    let sale = await Sale.findByIdAndUpdate(req.params.id, req.body);
    if (!sale) return res.redirect("/all-sales");

    sale.quantity = quantity;
    sale.sellingPrice = sellingPrice;
    sale.totalCost = quantity * sellingPrice;
    sale.customerName = customerName;
    sale.paymentMethod = paymentMethod;
    sale.transportation = transportation;

    await sale.save();
    res.redirect("/all-sales");
  } catch (err) {
    console.error("Error updating sale:", err);
    res.redirect("/all-sales");
  }
});

router.delete("/delete-sale/:id", ensureAuthenticated, ensureManager, async (req, res) => {
  try {
    await Sale.findByIdAndDelete(req.params.id);
    res.redirect("/all-sales");
  } catch (err) {
    console.error("Error deleting sale:", err);
    res.status(500).send("Error deleting sale");
  }
});

router.get("/receipt/:id", ensureAuthenticated, async (req, res) => {
  try {
    const sale = await Sale.findById(req.params.id).populate("salesAgent", "fullName");

    if (!sale) {
      return res.status(404).send("Sale not found");
    }

    // Role-based check
    if (req.user.role === "Sales-Agent" && sale.salesAgent._id.toString() !== req.user._id.toString()) {
      return res.status(403).send("Not authorized to view this receipt");
    }

    // Generate PDF
    const doc = new PDFDocument();
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename=receipt-${sale._id}.pdf`);
    doc.pipe(res);

    // Company info
    doc.fontSize(18).text("Mayondo Wood & Furniture Ltd", { align: "center" });
    doc.fontSize(12).text("Official Sales Receipt", { align: "center" });
    doc.moveDown();

    // Receipt details
    doc.text(`Receipt ID: ${sale._id}`);
    doc.text(`Date: ${new Date(sale.dateOfSale).toLocaleDateString()}`);
    doc.text(`Sales Agent: ${sale.salesAgent.fullName}`);
    doc.text(`Customer: ${sale.customerName}`);
    doc.text(`Payment Method: ${sale.paymentMethod}`);
    doc.moveDown();

    // Products
    doc.text("Products:", { underline: true });
    doc.text(`${sale.productName} x${sale.quantity} @ UGX ${sale.sellingPrice.toLocaleString()}`);
    doc.moveDown();

    // Total
    doc.fontSize(14).text(`TOTAL: UGX ${sale.totalCost.toLocaleString()}`, { align: "right" });

    doc.end();
  } catch (err) {
    console.error("Error generating receipt:", err);
    res.status(500).send("Server error");
  }
});





module.exports = router