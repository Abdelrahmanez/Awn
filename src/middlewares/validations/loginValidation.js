const { body } = require("express-validator");

const loginValidation = () => {
  //  one of email or username must be provided in the request body

  body("emailOrUsername").exists().withMessage("Email or username is required");

  body("password")
    .exists()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long");
};

module.exports = loginValidation;
