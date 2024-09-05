// routes/users.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const {
  registerOrganizationController,
} = require("../controllers/organization.controllers");
const checkUserExists = require("../middlewares/checkUserExists");
const registerValidation = require("../middlewares/registerValidation");
const tokenBlocked = require("../middlewares/tokenBlocked");
const loginValidation = require("../middlewares/loginValidation");

// GET / - prints hello world
router.get("/", userController.sendHello);

// GET /hey - prints hey
router.post("/", userController.sendhey);

// POST /signup - Create a new user
router.post(
  "/signup",
  registerValidation(),
  checkUserExists,
  userController.registerUserController
);

router.post("/login", loginValidation() , userController.loginUserController);

//
router.post("/api/v1/register_organization", registerOrganizationController);

module.exports = router;
