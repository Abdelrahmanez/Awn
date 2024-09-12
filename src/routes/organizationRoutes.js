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
const User = require("../models/user");
const updateProblemValidation = require("../middlewares/validations/updateProblemValidation");

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
  authorise(userRoles.post_problems, userRoles.organizationAdmin),
  organizationControllers.addProblemController
);

router.patch(
  "/problem/:id",
  updateProblemValidation(),
  authentication,
  authorise(userRoles.post_problems, userRoles.organizationAdmin)
  // organizationControllers.updateProblemController
);

router.post("/add-admin", async (req, res) => {
  try {
    const { userId, organizationId, role } = req.body;

    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).jsend.fail({ message: "User not found" });
    }

    // Create a new OrganizationAdmin document
    const admin = new OrganizationAdmin({
      userId,
      organizationId,
      role,
    });

    await admin.save(); // Save the new OrganizationAdmin document

    // Update the user role
    user.role = role; // Assuming `role` is a field on the User model
    await user.save();

    res.status(201).jsend.success({ admin, user });
  } catch (error) {
    res.status(500).jsend.error({ message: error.message });
  }
});

module.exports = router;
