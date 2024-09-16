const mongoose = require("mongoose");

const monthlyPlanSchema = new mongoose.Schema({
  organizationId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Organization",
    required: true,
  },
  month: { type: String, required: true },
  year: { type: Number, required: true },
  events: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

monthlyPlanSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const MonthlyPlan = mongoose.model("MonthlyPlan", monthlyPlanSchema);

module.exports = MonthlyPlan;
