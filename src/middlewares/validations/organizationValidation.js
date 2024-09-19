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
      .withMessage(
        "Description must be at least 5 characters long if provided"
      ),
    body("slogan")
      .optional()
      .isLength({ min: 5 })
      .withMessage("Slogan must be at least 5 characters long if provided"),
    body("website")
      .optional()
      .isURL()
      .withMessage("Please enter a valid URL for the website"),
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
    body("contactEmails")
      .optional()
      .isArray()
      .withMessage("Contact emails must be an array"),
    body("contactEmails.*")
      .optional()
      .isEmail()
      .withMessage("Please enter a valid email address"),
    body("contactPhoneNumbers")
      .optional()
      .isArray()
      .withMessage("Contact phone numbers must be an array"),
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
      .withMessage("Password must be at least 8 characters long"),
  ];
};

const patchOrganizationValidation = () => {
  return [
    body("description")
      .optional()
      .isLength({ min: 5 })
      .withMessage(
        "Description must be at least 5 characters long if provided"
      ),
    body("slogan")
      .optional()
      .isLength({ min: 5 })
      .withMessage("Slogan must be at least 5 characters long if provided"),
    body("website")
      .optional()
      .isURL()
      .withMessage("Please enter a valid URL for the website"),
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
    body("contactEmails")
      .optional()
      .isArray()
      .withMessage("Contact emails must be an array"),
    body("contactEmails.*")
      .optional()
      .isEmail()
      .withMessage("Please enter a valid email address"),
    body("contactPhoneNumbers")
      .optional()
      .isArray()
      .withMessage("Contact phone numbers must be an array"),
    body("contactPhoneNumbers.*")
      .optional()
      .isMobilePhone()
      .withMessage("Please enter a valid phone number"),
    body("paymentDetails.*.method")
      .optional()
      .isLength({ min: 5 })
      .withMessage("Payment method must be at least 5 characters long"),
    body("paymentDetails.*.details")
      .optional()
      .isLength({ min: 5 })
      .withMessage("Payment details must be at least 5 characters long"),
    body("password")
      .optional()
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters long"),
    body("mainBranch").optional().isMongoId().withMessage("Invalid branch ID"),
  ];
};

module.exports = {
  registerValidation,
  patchOrganizationValidation,
};
