const express = require("express");
const router = express.Router();
const Supplier = require("../models/supplierModel");

router.get("/register-supplier", (req, res) => {
  res.render("registerSupplier");
});

router.post("/register-supplier", async (req, res) => {
  try {
    const supplier = new Supplier(req.body);
    console.log(req.body);
    await supplier.save();
    res.redirect("/manager-dashboard");
  } catch (error) {
    console.error(error);
    res.redirect("/register-supplier")
  }
});

module.exports = router;
