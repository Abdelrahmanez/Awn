// src/middlewares/validations/problemValidation.js
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
    body("donationDetails.prices.*").custom((price) => {
      if (!price || typeof price !== "object") {
        throw new Error("Each price must be an object with 'label' and 'amount' properties.");
      }

      if (!price.label || typeof price.label !== "string" || price.label.trim() === "") {
        throw new Error("Each price object must have a non-empty 'label' of type string.");
      }

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
    body("volunteeringDetails.branches.*")
      .isMongoId()
      .withMessage("Branch ID must be a valid MongoDB ID"),

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
    body("volunteeringDetails.availableDates.*").custom((dateObj) => {
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

const updateProblemValidation = () => {
  return [
    // Title Validation
    body("title")
      .optional()
      .isString()
      .withMessage("Title must be a string")
      .isLength({ min: 5 })
      .withMessage("Title must be at least 5 characters long"),

    // Description Validation
    body("description")
      .optional()
      .isString()
      .withMessage("Description must be a string")
      .isLength({ min: 20 })
      .withMessage("Description must be at least 20 characters long"),

    // Problem Type Validation
    body("problemType")
      .optional()
      .isIn(["donation", "volunteering", "both"])
      .withMessage("Problem type must be one of the following: donation, volunteering, both"),

    // Problem Category Validation
    body("problemCategory")
      .optional()
      .isArray()
      .withMessage("Problem category must be an array")
      .custom((value) => value.every((v) => problemsType.map((pt) => pt.name).includes(v)))
      .withMessage(`Category must be one of the following: ${problemsType.map((pt) => pt.name).join(", ")}`),

    // Donation Details Validation
    body("donationDetails.prices")
      .optional()
      .isArray()
      .withMessage("Prices must be an array"),
    body("donationDetails.prices.*").optional().custom((price) => {
      if (price && (typeof price !== "object" || !price.label || !price.amount)) {
        throw new Error("Each price must be an object with 'label' and 'amount' properties.");
      }

      if (price && (typeof price.label !== "string" || price.label.trim() === "")) {
        throw new Error("Each price object must have a non-empty 'label' of type string.");
      }

      if (price && (typeof price.amount !== "number" || isNaN(price.amount))) {
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
      .optional()
      .isString()
      .withMessage("Skill type must be a string"),
    body("volunteeringDetails.requiredSkills.*.volunteersNeeded")
      .optional()
      .isInt({ min: 1 })
      .withMessage("Volunteers needed must be a positive integer"),
    body("volunteeringDetails.branches.*")
      .optional()
      .isMongoId()
      .withMessage("Branch ID must be a valid MongoDB ID"),

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
    body("volunteeringDetails.availableDates.*").optional().custom((dateObj) => {
      if (dateObj && new Date(dateObj.startTime) >= new Date(dateObj.endTime)) {
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
        if (endDate && new Date(endDate) <= new Date()) {
          throw new Error("End date must be in the future");
        }
        return true;
      }),
  ];
};


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

module.exports = {
  addProblemValidation,
  updateProblemValidation,
  problemQueriesValidation,
};
