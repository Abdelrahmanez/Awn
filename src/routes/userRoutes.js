// routes/users.js
const express = require("express");
const router = express.Router();
const {
  registerUserController,
  loginUserController,
  sendHello,
  sendhey,
} = require("../controllers/userController");
const {
  registerOrganizationController,
} = require("../controllers/organizationControllers");
const validateRegister = require("../middlewares/validations/userValidation");
const checkUserExists = require("../middlewares/checkUserExists");

// GET / - prints hello world
router.get("/api/v1/", sendHello);

// GET /hey - prints hey
router.post("/api/v1/", sendhey);

// POST /signup - Create a new user
router.post(
  "/api/v1/signup",
  validateRegister,
  checkUserExists,
  registerUserController
);

router.post("/api/v1/login", loginUserController);

//
router.post("/api/v1/register_organization", registerOrganizationController);

module.exports = router;
