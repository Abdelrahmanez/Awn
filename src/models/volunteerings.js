const { date } = require("joi");
const moongose = require("mongoose");
const branch = require("./branch");

const volunteeringsSchema = new moongose.Schema({
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
  branchId: {
    type: moongose.Schema.Types.ObjectId,
    ref: "Organization.branches",
    required: true,
  },
  activityId: {
    type: moongose.Schema.Types.ObjectId,
    ref: "Problem.volunteeringDetails.activities",
    required: true,
  },
  joinedDays: [
    {
      dateId: {
        type: moongose.Schema.Types.ObjectId,
        ref: "Problem.availableDates",
      },
      attended: { type: Boolean, default: false },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deletedAt: { type: Date, default: null },
});

volunteeringsSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const VolunteeringHistory = moongose.model(
  "Volunteerings",
  volunteeringsSchema
);

module.exports = VolunteeringHistory;
