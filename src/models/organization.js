const mongoose = require("mongoose");

const OrganizationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Organization name is required
  },
  description: {
    type: String,
    required: false, // Optional description of the organization
  },
  slogan: {
    type: String,
    required: false, // Optional slogan of the organization
  },
  contactPhoneNumbers: [
    {
      type: String,
      required: false, // Optional phone numbers
    },
  ],
  contactEmails: [
    {
      type: String,
      required: false, // Optional email addresses
    },
  ],
  branches: [
    {
      name: { type: String, required: true },
      address: {
        street: { type: String, required: false },
        state: { type: String, required: false },
        city: { type: String, required: false },
        country: { type: String, required: true },
        locationLink: { type: String, required: false }, // Fixed typo here
      },
      contactPhoneNumbers: [
        {
          type: String,
          required: false,
        },
      ], // Changed to an array of strings
    },
  ],
  paymentDetails: [
    {
      method: {
        type: String,
        required: true,
      },
      details: { type: String, required: true }, // Added `required: true`
    },
  ],
  admins: [
    {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      role: {
        type: String,
        enum: ["manage_volunteers", "post_problems", "manage_roles"],
        required: true,
      },
    },
  ],
  problems: [{ type: mongoose.Schema.Types.ObjectId, ref: "Problem" }],
  website: {
    type: String,
    required: false, // Optional website URL
  },
  createdAt: {
    type: Date,
    default: Date.now, // Automatically set to the current date
  },
  updatedAt: {
    type: Date,
    default: Date.now, // Automatically set to the current date
  },
  isActive: {
    type: Boolean,
    default: true, // Organization is active by default
  },
  logo: {
    type: String,
    required: false, // Organization's logo
  },
  socialMedia: {
    facebook: { type: String, required: false },
    x: { type: String, required: false },
    linkedIn: { type: String, required: false },
    instagram: { type: String, required: false },
  },
});

// Middleware to update the `updatedAt` field before saving
OrganizationSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Organization", OrganizationSchema);
