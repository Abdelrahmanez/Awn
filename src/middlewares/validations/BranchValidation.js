const { body } = require("express-validator");

const addBranchValidation = () => {
  return [
    body("name")
      .isLength({ min: 5 })
      .withMessage("Name must be at least 5 characters long"),
    body("address.street").isString().withMessage("Street must be a string"),
    body("address.city").isString().withMessage("City must be a string"),
    body("address.state").isString().withMessage("State must be a string"),
    body("address.locationLink")
      .optional()
      .isURL()
      .withMessage("Location link must be a URL"),
    body("contactPhoneNumbers.*")
      .isMobilePhone()
      .matches(/^(01)[0-2,5]{1}[0-9]{8}$/)
      .withMessage("Please enter a valid phone number"),
  ];
};

module.exports = addBranchValidation;
