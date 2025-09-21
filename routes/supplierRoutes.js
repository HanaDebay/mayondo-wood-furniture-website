const express = require("express");
const router = express.Router();
const Supplier = require("../models/supplierModel");
const User = require("../models/userModel");

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

router.get("/view-supplier", async (req, res) => {
  try {
    let suppliers = await Supplier.find();
    res.render("displaySupplier", { suppliers });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

router.get("/edit-supplier/:id", async(req , res) => {
  try {
    let supplier = await Supplier.findById(req.params.id);
    res.render("editSupplier", {supplier});
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error!");
  }
});

router.post("/edit-supplier/:id", async (req, res) => {
  try {
    await Supplier.findByIdAndUpdate(req.params.id, req.body);
    res.redirect("/view-supplier");
  } catch (error) {
    console.error(error);
    res.status(400).send("Update Failed!");
  }
});

router.delete("/delete-supplier/:id", async (req, res) => {
  try {
    await Supplier.findByIdAndDelete(req.params.id);
    res.redirect("/view-supplier");
  } catch (error) {
    console.error(error);
    res.status(500).send("Delete Failed!");
  }
});


module.exports = router;
