const { body, param } = require("express-validator");

const volunteerValidation = () => {
  return [
    // validate the problem ID in the endpoint
    param("problemId")
      .isMongoId()
      .withMessage("Problem ID must be a valid mongo ID"),
    body("branchId")
      .isMongoId()
      .withMessage("Branch ID must be a valid mongo ID"),
    body("joinedDays").isArray().withMessage("Joined days must be an array"),
    body("joinedDays.*.dateId")
      .isMongoId()
      .withMessage("Date ID must be a valid mongo ID"),
    body("joinedDays.*.attended")
      .optional()
      .isBoolean()
      .withMessage("Attended must be a boolean"),
    body("updatedBy")
      .optional()
      .isMongoId()
      .withMessage("Updated by must be a valid mongo ID"),
  ];
};

module.exports = volunteerValidation;
