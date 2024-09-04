// routes/users.js
const express = require("express");
const router = express.Router();
const {
  registerOrganizationController,
} = require("../controllers/organizationControllers");

// POST / - add a new organization
router.post("/register_organization", registerOrganizationController);

module.exports = router;
