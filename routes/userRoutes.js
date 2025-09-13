// Dependencies
const express = require("express");
const router = express.Router();


// GET Routes
router.get("/manager-dashboard", (req, res) => {
  res.render("managerDashboard"); 
});

router.get("/sales-agent-dashboard", (req, res) => {
  res.render("salesAgentDashboard"); 
});

module.exports = router;
