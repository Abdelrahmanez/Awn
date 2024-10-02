const mongoose = require("mongoose");
const Organization = require("../../models/organization");

const validOrganizationId = async (req, res, next) => {
  const { organizationId } = req.body;

  // Check if organizationId is provided
  if (!organizationId) {
    return res
      .status(400)
      .jsend.fail({ message: "Organization ID is required" });
  }

  // Check if the organizationId is a valid ObjectId
  if (!mongoose.isValidObjectId(organizationId)) {
    return res
      .status(400)
      .jsend.fail({ message: "Invalid Organization ID format" });
  }

  try {
    // Find the organization by ID
    const organization = await Organization.findById(organizationId);

    if (!organization) {
      return res.status(404).jsend.fail({ message: "Organization not found" });
    }

    req.organization = organization;
    next();
  } catch (err) {
    // Handle unexpected errors
    return res
      .status(500)
      .jsend.error({ message: "An error occurred", error: err.message });
  }
};

module.exports = validOrganizationId;
