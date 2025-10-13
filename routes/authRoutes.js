// Dependencies
const express = require("express");
const path = require("path");
const router = express.Router();
const User = require("../models/userModel");
const multer = require("multer");

const passport = require("passport");
const bcrypt = require("bcrypt"); //bcrypt is a library for hashing passwords securely.
const { error } = require("console");
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
  res.render("userSignup", { manager: req.session.user }); 
});

router.post("/register-user", async (req, res) => {
  try {
    const { fullName, email, phone, username, password, confirmPassword, role } = req.body;

    if (!fullName || !email || !phone || !username || !role || !password || !confirmPassword) {
      return res.status(400).json({ error: "All fields are required" });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    if (!/^(?:\+256|0)\d{9}$/.test(phone)) {
      return res.status(400).json({ error: "Invalid phone number" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ error: "Passwords do not match" });
    }

    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: "Email already in use" });
    }

    // Register new user
    const user = new User({ fullName, email, phone, username, role });
    await User.register(user, password);

    res.status(200).json({ message: "User registered successfully", role });

  } catch (error) {
    console.error("Registration error:", error);

    // Duplicate username
    if (error.name === "UserExistsError") {
      return res.status(400).json({ error: "Username already exists" });
    }

    // Mongo duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return res.status(400).json({ error: `${field} already in use` });
    }
    res.status(500).json({ error: "Server error. Please try again." });
  }
});

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

    //Store user and role in session
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

router.get("/register-manager", (req, res) => {
  res.render("managerSignup"); 
});

router.post("/register-manager", upload.single("profileImage"), async (req, res) => {
  try {
    const { fullName, email, phone, username, password } = req.body;

    // Check if manager already exists
    const existingManager = await User.findOne({ $or: [{email},{username}] });
    if (existingManager) {
      return res.status(400).send("Manager with this email or username already exists!");
    }

    const manager = new User({
      fullName,
      email,
      phone,
      username,
      role: "Manager",
      profileImage: req.file ? req.file.filename : null
    });

    await User.register(manager, password);
    res.redirect("/login");
  } catch (error) {
    console.error("Error registering manager:", error);
    res.status(500).send("Server error. Please try again.");
  }
});


module.exports = router;
