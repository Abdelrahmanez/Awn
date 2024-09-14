const { query } = require("express-validator");

const isValidDate = (value) => {
  const date = new Date(value);
  return !isNaN(date.getTime());
};

const problemQueriesValidation = () => {
  return [
    query("category")
      .isString()
      .withMessage("category must be a string")
      .optional(),
    query("status")
      .isString()
      .withMessage("status must be a string")
      .optional(),
    query("date")
      .custom(isValidDate)
      .withMessage("date must be a valid date")
      .optional(),
    query("problemType")
      .isString()
      .withMessage("problemType must be a string")
      .optional(),
    query("city")
      .isString()
      .withMessage("location must be a string")
      .optional(),
    query("state")
      .isString()
      .withMessage("location must be a string")
      .optional(),
    query("skills")
      .isString()
      .withMessage("skills must be a string")
      .optional(),
  ];
};

module.exports = problemQueriesValidation;
