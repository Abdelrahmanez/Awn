// models/Event.js
const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
  },
  title: { type: String, required: true },
  description: { type: String },
  startDate: { type: Date, required: true }, // Start date
  endDate: { type: Date }, // End date (optional, for multi-day events)
  location: { type: String, enum: ["branch", "external"] }, // Location (could be branch or external)
  branchId: [{ type: mongoose.Schema.Types.ObjectId, ref: "Branch" }], // Reference to a branch, if applicable
  externalLocation: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    locationLink: { type: String },
  },
  createdAt: { type: Date, default: Date.now },
  deletedAt: { type: Date, default: null },
  updatedBy: [
    {
      admin: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
      updateTime: { type: Date, default: Date.now },
    },
  ],
});

const Event = mongoose.model("Event", eventSchema);

module.exports = Event;
