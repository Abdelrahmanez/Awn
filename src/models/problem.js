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
      }
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
});

// Middleware to update `updatedAt` field before saving
problemSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Problem", problemSchema);
