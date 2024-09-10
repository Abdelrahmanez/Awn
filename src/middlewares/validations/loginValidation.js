const { body } = require("express-validator");

const loginValidation = () => {
  return [
    body("emailOrUsername")
      .isLength({ min: 3 })
      .withMessage("Email or username must be at least 3 characters long"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long"),
  ];
};

module.exports = loginValidation;
