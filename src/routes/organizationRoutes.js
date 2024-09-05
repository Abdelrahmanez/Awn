// routes/users.js
const express = require("express");
const router = express.Router();
const {
  registerOrganizationController,
} = require("../controllers/organization.controllers");

// POST / - add a new organization
router.post("/register", registerOrganizationController);

module.exports = router;
