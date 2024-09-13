const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const userRoles = require("../utils/userRoles");

const userSchema = new Schema({
  fullName: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  email: {
    type: String,
    required: true,
    unique: true,
    match: [/.+@.+\..+/, "Please fill a valid email address"],
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
    match: [/^(01)[0-2,5]{1}[0-9]{8}$/, "Please fill a valid phone number"],
  },
  passwordHash: { type: String, required: true },
  role: {
    type: String,
    enum: [
      userRoles.admin,
      userRoles.organizationAdmin,
      userRoles.superAdmin,
      userRoles.user,
      userRoles.post_problems,
    ],
    default: userRoles.user,
  },
  address: {
    street: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
  },
  age: { type: Number, min: 5, max: 100 },
  skills: [String],
  points: { type: Number, default: 0 },
  isScorePrivate: { type: Boolean, default: false },
  // volunteeringHistory: [
  //   {
  //     problemId: {
  //       type: mongoose.Schema.Types.ObjectId,
  //       ref: "Problem",
  //       required: true,
  //     },
  //     feedback: { type: String }, // Optional: Feedback provided by the user
  //   },
  // ],

  // donationHistory: [
  //   {
  //     problemId: {
  //       type: mongoose.Schema.Types.ObjectId,
  //       ref: "Problem",
  //       required: true,
  //     },
  //     amount: { type: Number, required: true },
  //     date: { type: Date, default: Date.now },
  //     proofImage: { type: String }, // Optional: Image of the receipt
  //   },
  // ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  tokens: [{ token: String, blocked: { type: Boolean, default: false } }],
  isActive: { type: Boolean, default: true },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
