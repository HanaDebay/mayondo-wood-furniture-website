// Dependencies
const express = require("express");
const router = express.Router();


// GET Routes
router.get("/manager-dashboard", (req, res) => {
  res.render("managerDashboard"); 
});


module.exports = router;
