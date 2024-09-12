const { date } = require("joi");
const moongose = require("mongoose");

const volunteeringsSchema = new moongose.Schema({
  userId: {
    type: moongose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  // organizationId: {
  //   type: moongose.Schema.Types.ObjectId,
  //   ref: "Organization",
  //   required: true,
  // },
  problemId: {
    type: moongose.Schema.Types.ObjectId,
    ref: "Problem",
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
  updatedBy: { type: moongose.Schema.Types.ObjectId, ref: "User"  },
});

const VolunteeringHistory = moongose.model(
  "Volunteerings",
  volunteeringsSchema
);

module.exports = VolunteeringHistory;
