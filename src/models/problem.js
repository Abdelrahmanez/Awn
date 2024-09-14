const mongoose = require("mongoose");
const problemsType = require("../utils/problemsType");

// Problem Schema Definition
const problemSchema = new mongoose.Schema({
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization", // Correctly references the Organization model
    required: true,
  },
  title: { type: String, required: true },
  description: { type: String, maxlength: 1000 },
  problemType: {
    type: String,
    enum: ["donation", "volunteering", "both"],
    required: true,
  },
  problemCategory: {
    type: [String],
    enum: problemsType.map((problemType) => problemType.name), // Enum validation for problem types
    required: true,
  },
  donationDetails: {
    prices: [{ label: String, amount: Number }], // Array of donation options
  },
  volunteeringDetails: {
    branches: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Branch", // Correctly references the Branch model
        required: true,
      },
    ],
    activities: [
      {
        type: {
          type: String,
          required: true,
        },
        volunteersNeeded: { type: Number, default: 1 },
      },
    ],
    availableDates: [
      {
        date: { type: Date },
        startTime: { type: Date },
        endTime: { type: Date },
      },
    ],
  },
  status: {
    type: String,
    enum: ["open", "closed", "in_progress"],
    default: "open",
  },
  endDate: { type: Date },
  terminated: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deletedAt: { type: Date, default: null },
});

// Middleware to update `updatedAt` field before saving
// Middleware to update `updatedAt` field before saving
problemSchema.pre("save", function (next) {
  this.updatedAt = Date.now();

  if (
    (this.problemType === "both" || this.problemType === "volunteering") &&
    this.volunteeringDetails.availableDates.length !== 0
  ) {
    // Ensure all dates in availableDates are stored as UTC midnight
    this.volunteeringDetails.availableDates =
      this.volunteeringDetails.availableDates.map((dateEntry) => {
        if (dateEntry.date) {
          // Set the time to midnight in UTC
          dateEntry.date = new Date(dateEntry.date.setUTCHours(0, 0, 0, 0));
        }
        return dateEntry;
      });
  }

  next();
});

module.exports = mongoose.model("Problem", problemSchema);
