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
const validOrganizationId = require("../middlewares/validOrganizationId");
const OrganizationAdmin = require("../models/organizationAdmin");

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

router.post("/add-admin", (req, res) => {
  try {
    const { userId, organizationId, role } = req.body;
    const admin = new OrganizationAdmin({
      userId,
      organizationId,
      role,
    });
    admin.save();
    res.status(201).jsend.success(admin);
  } catch (error) {
    res.status(500).jsend.error({ message: error.message });
  }
});

module.exports = router;
