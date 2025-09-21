// Dependencies
const express = require("express");
const path = require("path");
const router = express.Router();
const User = require("../models/userModel");
const multer = require("multer");

const passport = require("passport");
const bcrypt = require("bcrypt"); //bcrypt is a library for hashing passwords securely.
const saltRounds = 10; //A salt is random data added to the password before hashing.

let storage = multer.diskStorage({
  destination: (req , file , cb) => {
    cb(null, "public/uploads")
  },
   filename: (req , file , cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
})

const upload = multer({storage})

// GET Routes
router.get("/register-user", (req, res) => {
  res.render("userSignup", { manager: req.session.user }); // Pug file name
});
// POST Routes
router.post("/register-user", upload.single("profileImage"), async (req, res) => {
  try {
    const { fullName, email, phone, username, password, role } = req.body;
    // Check if email or username already exists
    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).send("Email or username already in use");
    }

    const user = new User({ 
      fullName: req.body.fullName, 
      email: req.body.email, 
      phone: req.body.phone, 
      username: req.body.username, 
      role: req.body.role, 
      profileImage: req.file ? req.file.filename : null,
    });
    
    await User.register(user, password);
    res.redirect("/manager-dashboard")
  } catch (error) {
    console.error("Error saving user:", error.message);
    res.status(500).send("Server error. Please try again.");
  }
});
// Show Login Form
router.get("/login", (req, res) => {
  res.render("login"); 
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.redirect("/login?error=Invalid credentials");
    }

    // ✅ Store user and role in session
    req.session.user = user;
    req.session.role = user.role; // "Sales-Agent" or "Manager"

    // Redirect based on role
    if (user.role === "Manager") {
      return res.redirect("/manager-dashboard");
    } else if (user.role === "Sales-Agent") {
      return res.redirect("/sales-agent-dashboard");
    } else {
      return res.redirect("/login");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Login error");
  }
});

router.get("/logout", (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      return res.status(500).send("Error logging out");
    }
    res.clearCookie("connect.sid"); // clear session cookie
    res.redirect("/login"); // redirect to login page
  });
});


module.exports = router;
