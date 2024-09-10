const mongoose = require("mongoose");
const problemsType = require("../utils/problemsType");

const problemSchema = new mongoose.Schema({
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
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
    enum: problemsType.map((problemType) => problemType.name), // Enum applies to each element of the array
    required: true,
  },
  donationDetails: {
    isFixedPrice: { type: Boolean, default: false },
    prices: [{ label: String, amount: Number }],
  },
  volunteeringDetails: {
    location: {
      street: { type: String },
      city: { type: String },
      state: { type: String },
      country: { type: String },
      locationLink: { type: String },
    },
    requiredSkills: [{ type: String }],
    availableDates: [
      {
        date: { type: Date },
        startTime: { type: Date },
        endTime: { type: Date },
      },
    ],
  },
  volunteers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  donations: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      amount: { type: Number, required: true },
      method: { type: String, enum: ["IBAN", "Instapay"], required: true },
      date: { type: Date, default: Date.now },
    },
  ],
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

module.exports = mongoose.model("Problem", problemSchema);
