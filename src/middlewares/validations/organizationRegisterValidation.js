const { body } = require("express-validator");

const registerValidation = () => {
  return [
    body("name")
      .isLength({ min: 5 })
      .withMessage("Name must be at least 5 characters long"),
    body("username")
      .isLength({ min: 5 })
      .withMessage("Username must be at least 5 characters long"),
    body("description")
      .optional()
      .isLength({ min: 5 })
      .withMessage("Description must be at least 5 characters long if provided"),
    body("slogan")
      .optional()
      .isLength({ min: 5 })
      .withMessage("Slogan must be at least 5 characters long if provided"),
    body("website")
      .optional()
      .isURL()
      .withMessage("Please enter a valid URL for the website"),
    body("logo")
      .optional()
      .isURL()
      .withMessage("Please enter a valid URL for the logo"),
    body("socialMedia.facebook")
      .optional()
      .isURL()
      .withMessage("Please enter a valid URL for Facebook"),
    body("socialMedia.x")
      .optional()
      .isURL()
      .withMessage("Please enter a valid URL for X"),
    body("socialMedia.linkedIn")
      .optional()
      .isURL()
      .withMessage("Please enter a valid URL for LinkedIn"),
    body("socialMedia.instagram")
      .optional()
      .isURL()
      .withMessage("Please enter a valid URL for Instagram"),
    body("contactEmails.*")
      .optional()
      .isEmail()
      .withMessage("Please enter a valid email address"),
    body("contactPhoneNumbers.*")
      .optional()
      .isMobilePhone()
      .withMessage("Please enter a valid phone number"),
    body("paymentDetails.*.method")
      .isLength({ min: 5 })
      .withMessage("Payment method must be at least 5 characters long"),
    body("paymentDetails.*.details")
      .isLength({ min: 5 })
      .withMessage("Payment details must be at least 5 characters long"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password hash must be at least 8 characters long"),
    body("createdAt")
      .optional()
      .isISO8601()
      .withMessage("Created date must be a valid ISO 8601 date"),
    body("updatedAt")
      .optional()
      .isISO8601()
      .withMessage("Updated date must be a valid ISO 8601 date"),
    body("isActive")
      .optional()
      .isBoolean()
      .withMessage("isActive must be a boolean value"),
  ];
};

module.exports = registerValidation;
