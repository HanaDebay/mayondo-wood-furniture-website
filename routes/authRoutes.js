// Dependencies
const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const bcrypt = require("bcrypt"); //bcrypt is a library for hashing passwords securely.
const saltRounds = 10; //A salt is random data added to the password before hashing.

// GET Routes
router.get("/register-user", (req, res) => {
  res.render("userSignup"); // Pug file name
});

// POST Routes
router.post("/register-user", async (req, res) => {
  try {
    const { fullName, email, phone, username, password, role } = req.body;

    // Check if email or username already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).send("Email or username already in use");
    }

    // Create new user instance
    const user = new User({ fullName, email, phone, username, role });

    // Register user with password
    await User.register(user, password);

    console.log("User registered:", user);
    res.redirect("/login"); // redirect after successful registration

  } catch (error) {
    console.error("Error saving user:", error.message);
    res.status(500).send("Server error. Please try again.");
  }
});


// Manager Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find manager by email
    const manager = await Manager.findOne({ email });
    if (!manager) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare password
    const match = await bcrypt.compare(password, manager.password);
    if (!match) {
      return res.send("Invalid email or password");
    }

    // TODO: Add session or JWT here for authentication
    res.json({
      message: "Login successful",
      role: "manager",
      token: "fake-jwt-token-for-now",
    });

    // Redirect to dashboard
    res.redirect("/managerDashboard");
  } catch (err) {
    console.error("Login Error:", err);
    res.send("Server error. Please try again.");
  }
});

// Show Login Form
router.get("/login", (req, res) => {
  res.render("login"); // Pug file name for login
});

module.exports = router;
