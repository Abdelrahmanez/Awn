// src/middlewares/validations/eventValidation.js
const { body, param, query } = require("express-validator");

// Create Event Validation
const createEventValidation = () => [
  body("title")
    .isString()
    .withMessage("Title must be a string")
    .notEmpty()
    .withMessage("Title is required"),
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),
  body("startDate")
    .isISO8601()
    .withMessage("Start date must be a valid ISO 8601 date"),
  body("endDate")
    .optional()
    .isISO8601()
    .withMessage("End date must be a valid ISO 8601 date"),
  body("location")
    .isIn(["branch", "external"])
    .withMessage("Location must be either 'branch' or 'external'"),
  body("branchId")
    .optional()
    .isArray()
    .withMessage("Branch ID must be an array of Object IDs"),
  body("externalLocation")
    .optional()
    .isObject()
    .withMessage("External location must be an object"),
  body("externalLocation.street")
    .optional()
    .isString()
    .withMessage("Street must be a string"),
  body("externalLocation.city")
    .optional()
    .isString()
    .withMessage("City must be a string"),
  body("externalLocation.state")
    .optional()
    .isString()
    .withMessage("State must be a string"),
  body("externalLocation.locationLink")
    .optional()
    .isString()
    .withMessage("Location link must be a string"),
];

// Update Event Validation
const updateEventValidation = () => [
  param("eventId")
    .isMongoId()
    .withMessage("Event ID must be a valid MongoDB Object ID"),
  body("title").optional().isString().withMessage("Title must be a string"),
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string"),
  body("startDate")
    .optional()
    .isISO8601()
    .withMessage("Start date must be a valid ISO 8601 date"),
  body("endDate")
    .optional()
    .isISO8601()
    .withMessage("End date must be a valid ISO 8601 date"),
  body("location")
    .optional()
    .isIn(["branch", "external"])
    .withMessage("Location must be either 'branch' or 'external'"),
  body("branchId")
    .optional()
    .isArray()
    .withMessage("Branch ID must be an array of Object IDs"),
  body("externalLocation")
    .optional()
    .isObject()
    .withMessage("External location must be an object"),
  body("externalLocation.street")
    .optional()
    .isString()
    .withMessage("Street must be a string"),
  body("externalLocation.city")
    .optional()
    .isString()
    .withMessage("City must be a string"),
  body("externalLocation.state")
    .optional()
    .isString()
    .withMessage("State must be a string"),
  body("externalLocation.locationLink")
    .optional()
    .isString()
    .withMessage("Location link must be a string"),
];

const validateEventFilters = [
  // Validate startDate
  query("startDate")
    .optional()
    .isISO8601()
    .withMessage("startDate must be a valid ISO8601 date"),

  // Validate endDate
  query("endDate")
    .optional()
    .isISO8601()
    .withMessage("endDate must be a valid ISO8601 date"),

  // Validate branchId (assuming it's a MongoDB ObjectId)
  query("branchId")
    .optional()
    .isMongoId()
    .withMessage("branchId must be a valid MongoDB ObjectId"),

  // Validate organizationId (assuming it's a MongoDB ObjectId)
  query("organizationId")
    .optional()
    .isMongoId()
    .withMessage("organizationId must be a valid MongoDB ObjectId"),
];

module.exports = {
  createEventValidation,
  updateEventValidation,
  validateEventFilters,
};
