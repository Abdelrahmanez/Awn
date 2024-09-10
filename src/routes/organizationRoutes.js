// routes/users.js
const express = require("express");
const router = express.Router();
const {
  registerOrganizationController,
} = require("../controllers/organization.controllers");
const checkOrganizationExists = require("../middlewares/checkOrganizationExists");
const organizationConrollers = require("../controllers/organization.controllers");
const addProblemValidation = require("../middlewares/validations/addProblemValidation");

// POST / - add a new organization
router.post(
  "/register",
  checkOrganizationExists,
  registerOrganizationController
);

router.post("/login", organizationConrollers.loginOrganizationController);

router.post(
  "/problem",
  addProblemValidation,
  // organizationConrollers.addProblemController
);

module.exports = router;
