const { body } = require("express-validator");

const registerValidation = () => {
  return [
    body("fullName")
      .isLength({ min: 5 })
      .matches(/^[a-zA-Z ]*$/)
      .withMessage("Name must be at least 3 characters long"),
    body("username")
      .isLength({ min: 3 })
      .matches(/^[a-zA-Z0-9_]*$/)
      .withMessage("Username must be at least 3 characters long"),
    body("email").isEmail().withMessage("Please enter a valid email address"),
    body("phoneNumber")
      .isMobilePhone()
      .matches(/^(01)[0-2,5]{1}[0-9]{8}$/)
      .withMessage("Please enter a valid phone number"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long"),
    body("passwordConfirmation").custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Passwords do not match");
      }
      return true;
    }),
    // if the address is defined, then validate the address fields
    body("address.street").optional().isString(),
    body("address.city").optional().isString(),
    body("address.state").optional().isString(),
    body("address.country").optional().isString(),
    body("age")
      .optional()
      .isInt({ min: 5, max: 100 })
      .withMessage("Age must be between 5 and 100"),
  ];
};

module.exports = registerValidation;
