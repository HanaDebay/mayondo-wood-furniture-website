// Dependencies
const express = require("express");
const router = express.Router();

const User = require("../models/userModel");
const WoodStock = require("../models/woodStockModel");


// GET Routes
router.get("/manager-dashboard", async (req, res) => {
  try {
    // expenses for buying wood-stock
    let totalExpenseTimber = await WoodStock.aggregate([
      { $match: { productType: "timber" } },
      {
        $group: {
          _id: null,
          totalQuantity: { $sum: "$quantity" },
          // Cost price is unit price for each one item
          totalCost: { $sum: { $multiply: ["$quantity", "$costPrice"] } },
        },
      },
    ]);

    let totalExpensePoles = await WoodStock.aggregate([
      { $match: { productType: "poles" } },
      {
        $group: {
          _id: null,
          totalQuantity: { $sum: "$quantity" },
          // Cost price is unit price for each one item
          totalCost: { $sum: { $multiply: ["$quantity", "$costPrice"] } },
        },
      },
    ]);

    let totalExpenseHardWood = await WoodStock.aggregate([
      { $match: { productType: "hardwood" } },
      {
        $group: {
          _id: null,
          totalQuantity: { $sum: "$quantity" },
          // Cost price is unit price for each one item
          totalCost: { $sum: { $multiply: ["$quantity", "$costPrice"] } },
        },
      },
    ]);

    let totalExpenseSoftWood = await WoodStock.aggregate([
      { $match: { productType: "softwood" } },
      {
        $group: {
          _id: null,
          totalQuantity: { $sum: "$quantity" },
          // Cost price is unit price for each one item
          totalCost: { $sum: { $multiply: ["$quantity", "$costPrice"] } },
        },
      },
    ]);
    // To avoid crusing the app if no expense have been added
    // Set default values if no expenses in the DB
    totalExpenseTimber = totalExpenseTimber[0] ?? {
      totalQuantity: 0,
      totalCost: 0,
    };
    totalExpensePoles = totalExpensePoles[0] ?? {
      totalQuantity: 0,
      totalCost: 0,
    };
    totalExpenseHardWood= totalExpenseHardWood[0] ?? {
      totalQuantity: 0,
      totalCost: 0,
    };
    totalExpenseSoftWood = totalExpenseSoftWood[0] ?? {
      totalQuantity: 0,
      totalCost: 0,
    };
    res.render("managerDashboard", {manager:req.session.user,totalExpenseTimber,totalExpenseHardWood,totalExpensePoles,totalExpenseSoftWood});
  } catch (error) {
    res.status(400).send("Unable to find the Items from the DB")
    console.error("Aggregation Error:", error.message)
  }
});

router.get("/sales-agent-dashboard", (req, res) => {
  res.render("salesAgentDashboard",{agent: req.session.user});
});

router.get("/view-user", async (req, res) => {
  try {
    let users = await User.find();
    res.render("displayUser", { users });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});

router.get("/edit-user/:id", async (req, res) => {
  try {
    let user = await User.findById(req.params.id);
    res.render("editUser", { user });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error! ");
  }
});

router.post("/edit-user/:id", async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, req.body);
    res.redirect("/view-user");
  } catch (error) {
    console.error(error);
    res.status(400).send("User not found");
  }
});

router.delete("/delete-user/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.redirect("/view-user");
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error deleting user" });
  }
});

module.exports = router;
