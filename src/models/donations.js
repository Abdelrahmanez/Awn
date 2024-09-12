const moongose = require("mongoose");

const donationSchema = new moongose.Schema({
  userId: {
    type: moongose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  problemId: {
    type: moongose.Schema.Types.ObjectId,
    ref: "Problem",
    required: true,
  },
  amount: { type: Number, required: true },
  //   method: { type: String, required: true },
  //   proofImage: { type: String },
  date: { type: Date, default: Date.now },
  verified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
});

const DonationHistory = moongose.model("Donations", donationSchema);

module.exports = DonationHistory;
