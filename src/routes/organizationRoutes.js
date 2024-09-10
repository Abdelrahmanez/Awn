// routes/users.js
const express = require("express");
const router = express.Router();
const {
  registerOrganizationController,
} = require("../controllers/organization.controllers");
const checkOrganizationExists = require("../middlewares/checkOrganizationExists");
const organizationConrollers = require("../controllers/organization.controllers");
const addProblemValidation = require("../middlewares/validations/addProblemValidation");
const authorise = require("../middlewares/authorise");
const userRoles = require("../utils/userRoles");
const authentication = require("../middlewares/authentication");
const organizationControllers = require("../controllers/organization.controllers");
// POST / - add a new organization
router.post(
  "/register",
  checkOrganizationExists,
  registerOrganizationController
);

router.post("/login", organizationConrollers.loginOrganizationController);

router.post(
  "/problem",
  addProblemValidation(),
  authentication,
  // authorise(userRoles.organizationAdmin),
  organizationControllers.addProblemController
);

module.exports = router;
