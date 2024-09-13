const moongose = require("mongoose");

const organizationAdminSchema = new moongose.Schema({
  userId: { type: moongose.Schema.Types.ObjectId, ref: "User" },
  organizationId: { type: moongose.Schema.Types.ObjectId, ref: "Organization" },
  role: [
    {
      type: String,
      enum: [
        "manage_volunteers",
        "post_problems",
        "manage_roles",
        "manage_branches",
      ],
      default: "manage_volunteers",
    },
  ],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  deletedAt: { type: Date, default: null },
});

organizationAdminSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = moongose.model("OrganizationAdmin", organizationAdminSchema);
