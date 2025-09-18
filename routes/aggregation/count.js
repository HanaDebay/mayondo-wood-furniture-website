const express = require("express");
const router = express.Router();
const User = require("../../models/userModel");
const Supplier = require("../../models/supplierModel");
const { ensureAuthenticated, ensureManager } = require("../../middleware/auth");

router.get("/count", ensureAuthenticated, ensureManager, async (req, res) => {
  try {
    const attendantsCount = await User.countDocuments({ role: "Sales-Agent" });
    const suppliersCount = await Supplier.countDocuments();

    res.json({ attendantsCount, suppliersCount });
  } catch (err) {
    console.error("Count error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
