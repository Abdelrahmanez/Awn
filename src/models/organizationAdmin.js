const moongose = require("mongoose");

const organizationAdminSchema = new moongose.Schema({
  userId: { type: moongose.Schema.Types.ObjectId, ref: "User" },
  organizationId: { type: moongose.Schema.Types.ObjectId, ref: "Organization" },
  role: {
    type: String,
    enum: ["manage_volunteers", "post_problems", "manage_roles"],
    default: "manage_volunteers",
  },
});

module.exports = moongose.model("OrganizationAdmin", organizationAdminSchema);
