// routes/users.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const {
  registerOrganizationController,
} = require("../controllers/organization.controllers");
const checkUserExists = require("../middlewares/checkUserExists");
const registerValidation = require("../middlewares/validations/userRegisterValidation");
const tokenBlocked = require("../middlewares/tokenBlocked");
const loginValidation = require("../middlewares/validations/loginValidation");
const auth = require("../middlewares/authentication");
const authentication = require("../middlewares/authentication");
const authorise = require("../middlewares/authorise");
const userRoles = require("../utils/userRoles");
const volnuteerValidation = require("../middlewares/validations/volnuteerValidation");
const validation = require("../middlewares/validations/validationResult");
const patchUserValidation = require("../middlewares/validations/patchUserValidation");

// GET / - prints hello world
router.get("/", auth, userController.sendHello);

// GET /hey - prints hey
router.post("/", userController.sendhey);

// POST /signup - Create a new user
router.post(
  "/signup",
  registerValidation(),
  validation,
  checkUserExists,
  userController.registerUserController
);

router.post("/login", loginValidation(), userController.loginUserController);

router
  .get(
    "/profile",
    authentication,
    authorise(userRoles.user),
    userController.getProfile
  )
  .patch(
    "/profile",
    patchUserValidation(),
    authentication,
    authorise(userRoles.user),
    userController.updateUserController
  );

router.get(
  "/volunteeringHistory",
  authentication,
  authorise(userRoles.user),
  userController.getVolunteeringHistory
);

router.post(
  "/problem/:problemId/volunteer",
  volnuteerValidation(),
  validation,
  authentication,
  authorise(userRoles.user),
  userController.volunteerController
);

module.exports = router;
