const { body } = require("express-validator");
const { getProblemTypes } = require("../../services/getProblemTypse");

const addProblemValidation = async () => {
  const problemTypes = await getProblemTypes();
  console.log(problemTypes);
  return [
    body("title")
      .isLength({ min: 5 })
      .withMessage("Title must be at least 5 characters long"),
    body("description")
      .isLength({ min: 10 })
      .withMessage("Description must be at least 10 characters long"),
    body("problemType").isString().withMessage("Problem type must be a string"),
    body("organizationId")
      .isString()
      .withMessage("Organization ID must be a string"),
    body("location").isString().withMessage("Location must be a string"),
    body("date").isDate().withMessage("Date must be a valid date"),
    body("time").isString().withMessage("Time must be a string"),
    body("volunteersNeeded")
      .isInt({ min: 1 })
      .withMessage("Volunteers needed must be at least 1"),
  ];
};

module.exports = addProblemValidation;
