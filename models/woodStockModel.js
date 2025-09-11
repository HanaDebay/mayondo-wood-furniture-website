const mongoose = require('mongoose');

const woodStockSchema = new mongoose.Schema({
  productName: {
    type: String,
    required: true,
    trim: true
  },
  productType: {
    type: String,
    required: true,
    enum: ['timber', 'poles', 'hardwood', 'softwood']
  },
  costPrice: {
    type: Number,
    required: true,
    min: 0
  },
  sellingPrice: {
    type: Number,
    required: true,
    min: 0
  },
  quantity: {
    type: Number,
    required: true,
    min: 0
  },
  supplierName: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    required: true
  },
  quality: {
    type: String,
    required: true,
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

module.exports = mongoose.model('WoodStock', woodStockSchema);
