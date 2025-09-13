// Dependencies
const express = require("express");
const router = express.Router();

const User = require("../models/userModel");


// GET Routes
router.get("/manager-dashboard", (req, res) => {
  res.render("managerDashboard"); 
});

router.get("/sales-agent-dashboard", (req, res) => {
  res.render("salesAgentDashboard"); 
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
    res.status(500).send("User not found! ");
  }
});

router.post("/edit-user/:id", async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, req.body);
    res.redirect("/view-user");
  } catch (error) {
    console.error(error)
    res.status(400).send("Item not found")
  }
});


router.delete("/delete-user/:id", async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.redirect("/view-user")
    res.json({ message: "Deleted successfully" });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error deleting user" });
  }
});


module.exports = router;
