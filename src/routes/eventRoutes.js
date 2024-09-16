const express = require("express");
const router = express.Router();
const eventController = require("../controllers/event.controller");
const authentication = require("../middlewares/auth/authentication");
const authorise = require("../middlewares/auth/authorise");
const eventValidation = require("../middlewares/validations/eventValidation");
const validation = require("../middlewares/validations/validationResult");
const isMongoId = require("../middlewares/validations/isMongoObjectId");

// GET all events
router.get(
  "/",
  eventValidation.validateEventFilters,
  validation,
  eventController.getEventsByFilter
);

// GET a single event
router.get(
  "/:eventId",
  isMongoId("eventId"),
  validation,
  eventController.getEvent
);

// Create a new event
router.post(
  "/",
  authentication,
  eventValidation.createEventValidation(),
  validation,
  authorise("add_event", "organization"),
  eventController.createEvent
);

// Update an event
router.patch(
  "/:eventId",
  authentication,
  eventValidation.updateEventValidation(),
  validation,
  authorise,
  eventController.updateEvent
);

// Delete an event (soft delete)
router.delete(
  "/:eventId",
  authentication,
  authorise,
  eventController.deleteEvent
);

module.exports = router;
