const mongoose = require("mongoose");
const userRoles = require("../utils/userRoles");

const OrganizationSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    default: userRoles.organization,
  },
  description: {
    type: String,
  },
  slogan: {
    type: String,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  contactPhoneNumbers: [
    {
      type: String,
    },
  ],
  contactEmails: [
    {
      type: String,
    },
  ],
  paymentDetails: [
    {
      method: {
        type: String,
        required: true,
      },
      details: {
        type: String,
        required: true,
      },
    },
  ],
  website: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  logo: {
    type: String,
  },
  socialMedia: {
    facebook: { type: String },
    x: { type: String },
    linkedIn: { type: String },
    instagram: { type: String },
  },
  tokens: [{ token: String, blocked: { type: Boolean, default: false } }],
  deletedAt: {
    type: Date,
    default: null,
  },
});

// Middleware to update the `updatedAt` field before saving
OrganizationSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Organization", OrganizationSchema);
