// Dependencies
const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const passport = require("passport");
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
    const user = new User({ fullName, email, phone, username, role });
    await User.register(user, password);
    console.log("User registered:", user);
    res.redirect("/login"); 
  } catch (error) {
    console.error("Error saving user:", error.message);
    res.status(500).send("Server error. Please try again.");
  }
});

// Show Login Form
router.get("/login", (req, res) => {
  res.render("login"); 
});

router.post("/login", passport.authenticate("local", { failureRedirect: "/login" }),
  (req, res) => {
    req.session.user = req.user;
    if (req.user.role === "Manager") {
      res.redirect("/manager-dashboard");
    } else if (req.user.role == "Sales-Agent") {
      res.redirect("/salesAgentDashboard");
    } else {
      res.render("nonUser");
    }
  }
);

router.get("/logout", (req, res) => {
  if (req.session) {
    req.session.destroy((error) => {
      if (error) {
        return res.status(500).send("Error Logging out");
      }
      res.redirect("/");
    });
  }
  res.render("managerDashboard");
});


module.exports = router;
