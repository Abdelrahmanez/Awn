// src/controllers/eventController.js
const Event = require("../models/event");
const Branch = require("../models/branch");
const asyncHandler = require("express-async-handler");

// Create a new event
exports.createEvent = async (req, res) => {
  try {
    const {
      title,
      description,
      startDate,
      endDate,
      location,
      branchId,
      externalLocation,
    } = req.body;
    const organizationId = req.user.organizationId; // Assume this comes from auth middleware

    const event = new Event({
      title,
      description,
      startDate,
      endDate,
      location,
      branchId,
      externalLocation,
      organizationId,
    });

    await event.save();
    res.status(201).json({ event });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Update an event
exports.updateEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const updates = req.body;

    // Add admin update info
    updates.updatedBy = updates.updatedBy || [];
    updates.updatedBy.push({
      admin: req.user._id,
      updateTime: new Date(),
    });

    const event = await Event.findByIdAndUpdate(eventId, updates, {
      new: true,
    });
    if (!event)
      return res.status(404).jsend.fail({ message: "Event not found" });

    res.jsend.success({ event });
  } catch (error) {
    res.status(500).jsend.error({ message: error.message });
  }
};

// Delete an event (soft delete)
exports.deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findByIdAndUpdate(
      eventId,
      { deletedAt: new Date() },
      { new: true }
    );
    if (!event)
      return res.status(404).jsend.fail({ message: "Event not found" });

    res.jsend.success({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).jsend.error({ message: error.message });
  }
};

// Retrieve an event
exports.getEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    res.jsend.success({ event });
  } catch (error) {
    res.status(500).jsend.error({ message: error.message });
  }
};

// List all events for an organization
exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find({ deletedAt: null });
    if (!events || events.length === 0)
      return res.status(404).jsend.fail({ message: "No events found" });
    res.jsend.success({ events });
  } catch (error) {
    res.status(500).jsend.error({ message: error.message });
  }
};

// List all events for a branch
exports.getBranchEvents = async (req, res) => {
  try {
    const { branchId } = req.params;
    const events = await Event.find({ branchId, deletedAt: null });
    if (!events || events.length === 0)
      return res.status(404).jsend.fail({ message: "No events found" });
    res.jsend.success({ events });
  } catch (error) {
    res.status(500).jsend.error({ message: error.message });
  }
};

// Function to get events based on query filters
exports.getEventsByFilter = asyncHandler(async (req, res) => {
  const { startDate, branchId, city, state, organizationId } = req.query;

  // Base query object
  let query = {
    deletedAt: null,
    ...(organizationId && { organizationId }),
  };

  // Date filter
  if (startDate) {
    query.startDate = { $gte: new Date(startDate) };
  }

  // Location filter
  if (branchId) {
    // Directly filter by branchId if provided
    query.branchId = branchId;
  } else if (city || state) {
    // If city or state are provided, find matching branches
    const branchQuery = {};

    if (city) {
      branchQuery["address.city"] = city;
    }
    if (state) {
      branchQuery["address.state"] = state;
    }

    const branches = await Branch.find(branchQuery).select("_id");
    const branchIds = branches.map((branch) => branch._id);

    if (branchIds.length > 0) {
      query.branchId = { $in: branchIds };
    } else {
      query.branchId = { $in: [] }; // If no branches match, filter out events with no branches
    }
  } else {
    // If neither branchId, city, nor state are provided, include events with any branchId
    query.branchId = { $exists: true, $ne: [] };
  }

  // Fetching events based on the query
  const events = await Event.find(query)
    .populate({
      path: "organizationId",
      select: "name -_id",
    })
    .populate({
      path: "branchId",
      select: "name address -_id",
    })
    .sort({ startDate: 1 });

  if (!events || events.length === 0) {
    return res.status(404).json({ message: "No events found" });
  }

  return res.status(200).json({ events });
});
