const Organization = require("../models/Organization");
const Branch = require("../models/branch");

exports.branchesBelongsToOrganization = async (req, res, next) => {
  try {
    const organizationId = req.user.organizationId;
    const branchIds = req.body.branches; // Fixed typo: "brancesh" -> "branches"

    // Validate branchIds
    if (!Array.isArray(branchIds) || branchIds.length === 0) {
      return res
        .status(400)
        .json({ message: "Branches must be provided as an array" });
    }

    // Find the organization
    const organization = await Organization.findById(organizationId);
    if (!organization) {
      return res.status(404).json({ message: "Organization not found" });
    }

    // Find branches associated with the organization
    const branches = await Branch.find({ organizationId });

    // Convert branches array to a Set of branch IDs for easy lookup
    const branchIdsSet = new Set(branches.map((b) => b._id.toString()));

    // Check if every branchId in branchIds is in the branchIdsSet
    const allBranchesValid = branchIds.every((branchId) =>
      branchIdsSet.has(branchId)
    );

    if (!allBranchesValid) {
      return res.status(400).json({
        message: "One or more branches do not belong to the organization",
      });
    }

    next();
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal server error" });
  }
};
