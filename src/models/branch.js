const mongoose = require("mongoose");

const branchSchema = new mongoose.Schema({
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
  },
  name: { type: String, required: true },
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    // country: { type: String, required: true },
    locationLink: { type: String },
  },
  contactPhoneNumbers: [
    {
      type: String,
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to update the `updatedAt` field before saving
branchSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Branch", branchSchema);
