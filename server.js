// 1. Dependencies
const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const passport = require("passport");
const expressSession = require("express-session");
const MongoStore = require("connect-mongo");
const methodOverride = require("method-override");

require("dotenv").config();

const User = require("./models/userModel")
// 2. Import Routes
const authRoutes = require("./routes/authRoutes");
const furnitureStockRoutes = require("./routes/FurnitureStockRoutes")
const woodStockRoutes = require("./routes/woodStockRoutes")
const userRoutes = require("./routes/userRoutes");
const supplierRoutes = require("./routes/supplierRoutes");
const salesRoutes = require("./routes/salesRoutes")
const countRoutes = require("./routes/aggregation/count");
const purchaseCostRoutes = require("./routes/aggregation/purchaseCosts");
const managerDashboardChartRoutes = require("./routes/aggregation/managerDashboardCharts");
// 3. Instantiations
const app = express();

// 4. Configuration
// Settingup MongoDB connection
mongoose.connect(process.env.DATABASE, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB connected"))
  .catch(err => console.error("MongoDB error:", err));


  // setting view engin to pug
app.set('view engine', 'pug');
app.set('views',path.join(__dirname, 'views'));

// 5. Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

//EXPRESS-SESSIONS CONFIGS
app.use(expressSession({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  store: MongoStore.create({mongoUrl: process.env.DATABASE}),
  cookie:{maxAge: 24 * 60 * 60 * 1000}
}));

//PASSPORT CONFIGS
app.use(passport.initialize());
app.use(passport.session());

//AUTHENTICATE WITH PASSPORT_LOCAL_STRATEGY
passport.use(User.createStrategy()); 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// Static files
app.use(express.static(path.join(__dirname, "public")));

// 6. Routes
//  using imported routes
app.use("/", authRoutes);
app.use("/", furnitureStockRoutes);
app.use("/", woodStockRoutes);
app.use("/", userRoutes);
app.use("/", supplierRoutes);
app.use("/", salesRoutes);
app.use("/", countRoutes);
app.use("/", purchaseCostRoutes);
app.use("/", managerDashboardChartRoutes);


// Server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
