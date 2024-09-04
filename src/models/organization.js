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

  address: {
    street: { type: String, required: false },
    city: { type: String, required: false },
    country: { type: String, required: true },
    locatoionLink: { type: String, required: false },
  },
  // array of phone numbers
  phoneNumber: {
    type: String,
    required: true, // At least one phone number is required
  },
  email: {
    type: String,
    required: true, // Optional email address
  },
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
  // the policies of the organization
  policies: {
    termsAndConditions: { type: String, required: false },
    privacyPolicy: { type: String, required: false },
  },
  // the organization's logo
  logo: {
    type: String,
    required: false,
  },
  // the organization's social media links
  socialMedia: {
    facebook: { type: String, required: false },
    x: { type: String, required: false },
    linkedIn: { type: String, required: false },
    instagram: { type: String, required: false },
  },
  // the organization's mission statement
  mission: {
    type: String,
    required: false,
  },
});

// Middleware to update the `updatedAt` field before saving
OrganizationSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Organization", OrganizationSchema);
