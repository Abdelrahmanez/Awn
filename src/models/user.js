const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  name: { type: String, required: true },
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
  role: { type: String, enum: ["user", "organization_rep"], default: "user" },
  location: {
    city: String,
    state: String,
    country: String,
  },
  age: { type: Number, min: 5, max: 100 },
  skills: [String],
  volunteeringScore: { type: Number, default: 0, min: 0, max: 100 },
  volunteeringHistory: [{ type: Schema.Types.ObjectId, ref: "Volunteer" }],
  donationHistory: [{ type: Schema.Types.ObjectId, ref: "Donation" }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  tokens: [{ token: String, blocked: { type: Boolean, default: false } }],
  isActive: { type: Boolean, default: true },
});

const User = mongoose.model("User", userSchema);
module.exports = User;
