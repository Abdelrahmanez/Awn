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
const organizationRegistrationValidation = require("../middlewares/validations/organizationRegisterValidation");
const loginValidation = require("../middlewares/validations/loginValidation");
const addBranchValidation = require("../middlewares/validations/addBranchValidation");
const validation = require("../middlewares/validations/validationResult");
// POST / - add a new organization
router.post(
  "/register",
  organizationRegistrationValidation(),
  checkOrganizationExists,
  registerOrganizationController
);

router.post(
  "/login",
  loginValidation(),
  organizationConrollers.loginOrganizationController
);

router.post(
  "/problem",
  addProblemValidation(),
  validation,
  authentication,
  authorise(userRoles.post_problems, userRoles.organizationAdmin , userRoles.organization),
  organizationControllers.addProblemController
);

router.patch(
  "/problem/:id",
  updateProblemValidation(),
  authentication,
  authorise(userRoles.post_problems, userRoles.organizationAdmin)
  // organizationControllers.updateProblemController
);

router.post(
  "/add-branch",
  addBranchValidation(),
  validation,
  authentication,
  authorise(userRoles.manage_branches, userRoles.organization),
  organizationControllers.addBranchController
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
    user.role = userRoles.admin; // Assuming `role` is a field on the User model
    await user.save();

    res.status(201).jsend.success({ admin, user });
  } catch (error) {
    res.status(500).jsend.error({ message: error.message });
  }
});

module.exports = router;
