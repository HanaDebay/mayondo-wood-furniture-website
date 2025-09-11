const mongoose = require('mongoose');

const furnitureStockSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: [true, 'Product name is required'],
    trim: true
  },
  productType: {
    type: String,
    required: [true, 'Product type is required'],
    enum: ['furniture-home', 'furniture-office'] 
  },
  furnitureType: {
    type: String,
    required: [true, 'Furniture type is required'],
    enum: [
      'bed', 'sofa', 'dining', 'cupboard', 'drawers',
      'desk', 'chair', 'shelf', 'wardrobe', 'tv-stand','Table'
    ] 
  },
  costPrice: {
    type: Number,
    required: [true, 'Cost price is required'],
    min: [0, 'Cost price must be at least 0']
  },
  sellingPrice: {
    type: Number,
    required: [true, 'Selling price is required'],
    min: [0, 'Selling price must be at least 0']
  },
  quantity: {
    type: Number,
    required: [true, 'Quantity is required'],
    min: [0, 'Quantity must be at least 0']
  },
  supplierName: {
    type: String,
    required: [true, 'Supplier name is required'],
    trim: true
  },
  date: {
    type: Date,
    required: [true, 'Date received is required']
  },
  quality: {
    type: String,
    required: [true, 'Quality grade is required'],
    enum: ['A', 'B', 'C'] // Premium, Standard, Economy
  },
  color: {
    type: String,
    trim: true 
  },
  measurements: {
    type: String,
    trim: true 
  },
  // createdAt: {
  //   type: Date,
  //   default: Date.now
  // }
});

module.exports = mongoose.model('FurnitureStock', furnitureStockSchema);
