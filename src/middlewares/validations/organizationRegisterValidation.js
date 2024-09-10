const { body } = require("express-validator");

const registerValidation = () => {
  return [
    body("name")
      .isLength({ min: 5 })
      .withMessage("Name must be at least 5 characters long"),
    body("slogan")
      .isLength({ min: 5 })
      .withMessage("Slogan must be at least 5 characters long"),
    body("description")
      .isLength({ min: 5 })
      .withMessage("Description must be at least 5 characters long"),
    body("website").isURL().withMessage("Please enter a valid URL"),
    body("policies")
      .isLength({ min: 5 })
      .withMessage("Policies must be at least 5 characters long"),
    body("address").isString().withMessage("Address must be a string"),
    body("logo").isURL().withMessage("Please enter a valid URL"),
    body("socialMedia").isURL().withMessage("Please enter a valid URL"),
    body("mission")
      .isLength({ min: 5 })
      .withMessage("Mission must be at least 5 characters long"),
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
  ];
};

module.exports = registerValidation;
