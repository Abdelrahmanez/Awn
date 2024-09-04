const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const problemSchema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  Image: { type: String, required: true },
  category: { type: String, required: true },
  location: { type: String, required: true },
  volunteering: { type: Boolean, required: true },
  donation: { type: Boolean, required: true },
  maxVolunteers: { type: Number, required: true },
  donationGoal: { type: Number, required: true },
  currentDonation: { type: Number, required: true },
  currentVolunteers: { type: Number, required: true },
  date: { type: Date, required: true },
  organization: { type: Schema.Types.ObjectId, ref: "Organization" },
  volunteers: [{ type: Schema.Types.ObjectId, ref: "User" }],
  volunteersCount: { type: Number, required: true },
  donations: [{ type: Schema.Types.ObjectId, ref: "Donation" }],
  likes: [{ type: Schema.Types.ObjectId, ref: "User" }],
  likesCount: { type: Number, required: true },
});

const Problem = mongoose.model("Problem", problemSchema);
module.exports = Problem;
