const { body } = require("express-validator");
const problemsType = require("../../utils/problemsType");

const addProblemValidation = () => {
  const problemTypesArray = problemsType.map((problemType) => problemType.name);

  return [
    // Title Validation
    body("title")
      .isString()
      .withMessage("Title must be a string")
      .isLength({ min: 5 })
      .withMessage("Title must be at least 5 characters long"),

    // Description Validation
    body("description")
      .isString()
      .withMessage("Description must be a string")
      .isLength({ min: 20 })
      .withMessage("Description must be at least 20 characters long"),

    // Problem Type Validation
    body("problemType")
      .isIn(["donation", "volunteering", "both"])
      .withMessage("Problem type must be one of the following: donation, volunteering, both"),

    // Problem Category Validation
    body("problemCategory")
      .isArray()
      .withMessage("Problem category must be an array")
      .custom((value) => value.every((v) => problemTypesArray.includes(v)))
      .withMessage(`Category must be one of the following: ${problemTypesArray.join(", ")}`),

    // Donation Details Validation
    body("donationDetails.prices")
      .optional()
      .isArray()
      .withMessage("Prices must be an array"),
    body("donationDetails.prices.*")
      .custom((price) => {
        if (!price || typeof price !== "object") {
          throw new Error("Each price must be an object with 'label' and 'amount' properties.");
        }

        // Check that 'label' exists and is a non-empty string
        if (!price.label || typeof price.label !== "string" || price.label.trim() === "") {
          throw new Error("Each price object must have a non-empty 'label' of type string.");
        }

        // Check that 'amount' exists and is a number
        if (typeof price.amount !== "number" || isNaN(price.amount)) {
          throw new Error("Each price object must have an 'amount' of type number.");
        }

        return true;
      }),

    // Volunteering Details Location Validation
    body("volunteeringDetails.location.street")
      .optional()
      .isLength({ min: 5 })
      .withMessage("Street must be at least 5 characters long"),
    body("volunteeringDetails.location.city")
      .optional()
      .isLength({ min: 3 })
      .withMessage("City must be at least 3 characters long"),
    body("volunteeringDetails.location.state")
      .optional()
      .isLength({ min: 3 })
      .withMessage("State must be at least 3 characters long"),
    body("volunteeringDetails.location.country")
      .optional()
      .isLength({ min: 3 })
      .withMessage("Country must be at least 3 characters long"),
    body("volunteeringDetails.location.locationLink")
      .optional()
      .isURL()
      .withMessage("Location link must be a valid URL"),

    // Required Skills Validation
    body("volunteeringDetails.requiredSkills")
      .optional()
      .isArray()
      .withMessage("Required skills must be an array"),
    body("volunteeringDetails.requiredSkills.*.type")
      .isString()
      .withMessage("Skill type must be a string"),
    body("volunteeringDetails.requiredSkills.*.volunteersNeeded")
      .isInt({ min: 1 })
      .withMessage("Volunteers needed must be a positive integer"),

    // Available Dates Validation
    body("volunteeringDetails.availableDates")
      .optional()
      .isArray()
      .withMessage("Available dates must be an array"),
    body("volunteeringDetails.availableDates.*.date")
      .optional()
      .isISO8601()
      .withMessage("Date must be a valid ISO 8601 date"),
    body("volunteeringDetails.availableDates.*.startTime")
      .optional()
      .isISO8601()
      .withMessage("Start time must be a valid ISO 8601 date-time"),
    body("volunteeringDetails.availableDates.*.endTime")
      .optional()
      .isISO8601()
      .withMessage("End time must be a valid ISO 8601 date-time"),
    body("volunteeringDetails.availableDates.*")
      .custom((dateObj) => {
        if (new Date(dateObj.startTime) >= new Date(dateObj.endTime)) {
          throw new Error("Start time must be before end time");
        }
        return true;
      }),

    // End Date Validation
    body("endDate")
      .optional()
      .isISO8601()
      .withMessage("End date must be a valid ISO 8601 date")
      .custom((endDate) => {
        if (new Date(endDate) <= new Date()) {
          throw new Error("End date must be in the future");
        }
        return true;
      }),
  ];
};

module.exports = addProblemValidation;
