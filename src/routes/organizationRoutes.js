// routes/users.js
const express = require("express");
const router = express.Router();
const {
  registerOrganizationController,
} = require("../controllers/organization.controllers");
const checkOrganizationExists = require("../middlewares/validations/checkOrganizationExists");
const organizationConrollers = require("../controllers/organization.controllers");
const ProblemValidation = require("../middlewares/validations/ProblemValidation");
const authorise = require("../middlewares/auth/authorise");
const userRoles = require("../utils/userRoles");
const authentication = require("../middlewares/auth/authentication");
const organizationControllers = require("../controllers/organization.controllers");
const OrganizationAdmin = require("../models/organizationAdmin");
const User = require("../models/user");
const {
  registerValidation,
  patchOrganizationValidation,
} = require("../middlewares/validations/organizationValidation");
const loginValidation = require("../middlewares/validations/loginValidation");
const addBranchValidation = require("../middlewares/validations/BranchValidation");
const validation = require("../middlewares/validations/validationResult");
const problem = require("../models/problem");
const uploadOrganizationLogo = require("../middlewares/organizationMulterConfig");
const { branchesBelongsToOrganization } = require("../utils/organizationUtils");

// POST / - add a new organization
router.post(
  "/register",
  uploadOrganizationLogo.single("logo"),
  registerValidation(),
  validation,
  checkOrganizationExists,
  registerOrganizationController
);

router.post(
  "/login",
  loginValidation(),
  organizationConrollers.loginOrganizationController
);

router.patch(
  "/update",
  authentication,
  authorise(userRoles.organizationAdmin, userRoles.organization),
  patchOrganizationValidation(),
  validation,
  organizationControllers.updateOrganizationController
);

router.post(
  "/problem",
  ProblemValidation.addProblemValidation(),
  validation,
  authentication,
  authorise(
    userRoles.post_problems,
    userRoles.organizationAdmin,
    userRoles.organization
  ),
  organizationControllers.addProblemController
);

router.patch(
  "/problem/:id",
  ProblemValidation.updateProblemValidation(),
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

router.post(
  "/add-admin",
  authentication,
  authorise(userRoles.manage_roles, userRoles.organization),
  branchesBelongsToOrganization,
  async (req, res) => {
    try {
      console.log(req.body);
      const { organizationId } = req.body;
      const { userId, role, branches } = req.body;

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
        branches,
      });

      await admin.save(); // Save the new OrganizationAdmin document

      // Update the user role
      user.role = userRoles.admin; // Assuming `role` is a field on the User model
      await user.save();

      res.status(201).jsend.success({ admin, user });
    } catch (error) {
      res.status(500).jsend.error({ message: error.message });
    }
  }
);

module.exports = router;
