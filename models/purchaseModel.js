const mongoose = require("mongoose");

const purchaseSchema = new mongoose.Schema({
  productName: { 
    type: String, 
    required: true },
  productType: {
    type: String,
    enum: ["WoodStock", "FurnitureStock"],
    required: true,
  },
  quantity: { 
    type: Number, 
    required: true },
  costPrice: { 
    type: Number, 
    required: true },
  totalPurchaseCost: { 
    type: Number, 
    required: true }, // quantity * costPrice
  supplierName: { 
    type: String },
  purchaseDate: { 
    type: Date, default: Date.now },
});

module.exports = mongoose.model("Purchase", purchaseSchema);
