const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "productType", // dynamic reference based on productType
    },
    productName: {
      type: String,
      required: true,
    },
    productType: {
      type: String,
      required: true,
      enum: ["WoodStock", "FurnitureStock"],
    },
    quantity: {
      type: Number,
      required: true,
    },
    sellingPrice: {
      type: Number,
      required: true,
    },
    totalCost: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    transportation: {
      type: String,
      default: "none", // "none" or "company"
    }, 
    salesAgent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    dateOfSale: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);
module.exports = mongoose.model("Sale", saleSchema);
