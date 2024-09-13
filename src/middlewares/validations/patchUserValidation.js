const { body } = require("express-validator");

const patchUserValidation = () => {
  return [
    // Validate fullName if provided
    body("fullName")
      .optional()
      .isLength({ min: 5 })
      .matches(/^[a-zA-Z]+ [a-zA-Z]+$/)
      .withMessage("Please enter your first and last name"),

    // Validate username if provided
    body("username")
      .optional()
      .isLength({ min: 3 })
      .matches(/^[a-zA-Z0-9_]*$/)
      .withMessage("Username must be at least 3 characters long"),

    // Validate email if provided
    body("email")
      .optional()
      .isEmail()
      .withMessage("Please enter a valid email address"),

    // Validate phoneNumber if provided
    body("phoneNumber")
      .optional()
      .isMobilePhone()
      .matches(/^(01)[0-2,5]{1}[0-9]{8}$/)
      .withMessage("Please enter a valid phone number"),

    // Validate password if provided
    body("password")
      .optional()
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long"),

    // Validate passwordConfirmation if provided
    body("passwordConfirmation")
      .optional()
      .custom((value, { req }) => {
        if (value && value !== req.body.password) {
          throw new Error("Passwords do not match");
        }
        return true;
      }),

    // Validate address fields if provided
    body("address.street").optional().isString(),
    body("address.city").optional().isString(),
    body("address.state").optional().isString(),
    body("address.country").optional().isString(),

    // Validate age if provided
    body("birthDate")
      .optional()
      .isDate()
      .withMessage("Please enter a valid date of birth"),
    body("skills").optional().isArray().withMessage("Skills must be an array"),
    body("isScorePrivate").optional().isBoolean().withMessage("Invalid value must be a boolean"),
  ];
};

module.exports = patchUserValidation;
