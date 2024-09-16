const Organization = require("../models/Organization");
const Problem = require("../models/problem");
const mongoose = require("mongoose");
const Branch = require("../models/branch");

// get specific organization which is not deleted and active
exports.getActiveAndNotDeletedOrganization = async ({ organizationId }) => {
  const organization = await Organization.findOne({
    _id: organizationId,
    deletedAt: null,
    isActive: true,
  });

  return organization;
};

// get all organizations which are not deleted and active
exports.getAllOrganizations = async () => {
  const organizations = await Organization.find({
    deletedAt: null,
    isActive: true,
  });

  console.log;

  return organizations;
};

// get a problem by id which is not deleted and terminated and not completed (open or in progress)
exports.getProblemById = async ({ problemId }) => {
  const problem = await Problem.findOne({
    _id: problemId,
    deletedAt: null,
    terminated: false,
    status: {
      $ne: "completed",
    },
  });

  return problem;
};

// get all problems for a specific organization which are not deleted and not terminated
exports.getOrganizationProblems = async ({ organizationId, status }) => {
  const problems = await Problem.find({
    organizationId,
    deletedAt: null,
    terminated: false,
    status,
  });

  return problems;
};

// gets all deleted problems for a specific organization
exports.getOrganizationDeletedProblem = async ({ organizationId }) => {
  const problems = await Problem.find({
    organizationId,
    deletedAt: { $ne: null },
  });

  return problems;
};

// get all problems which are not deleted and not terminated

exports.getAllProblems = async ({
  status,
  category,
  city,
  state,
  skills,
  problemType,
  date,
}) => {
  try {
    let query = {
      deletedAt: null,
      terminated: false,
    };

    // If status is provided, filter by status
    if (status) {
      query.status = status;
    }

    // If category is provided, filter by category
    if (category) {
      query.problemCategory = { $in: category };
    }

    // If skills are provided, filter by skills
    if (skills) {
      const skillsArray = skills.split(",").map((skill) => skill.trim());
      query["volunteeringDetails.activities.type"] = { $in: skillsArray };
    }

    // If problemType is provided, filter by problemType
    if (problemType) {
      const problemTypeArray = problemType
        .split(",")
        .map((type) => type.trim());
      query.problemType = { $in: problemTypeArray };
    }

    // If date is provided, filter by date
    if (date) {
      const startOfDay = new Date(date.trim());
      const endOfDay = new Date(date.trim());
      startOfDay.setUTCHours(0, 0, 0, 0);
      endOfDay.setUTCHours(23, 59, 59, 999);

      query["volunteeringDetails.availableDates"] = {
        $elemMatch: {
          date: { $gte: startOfDay, $lt: endOfDay },
        },
      };
    }

    console.log(query);

    let branchIds = [];

    // Combine both city and state conditions for branches
    if (city || state) {
      const branchQuery = {};
      if (city) {
        branchQuery["address.city"] = city;
      }
      if (state) {
        branchQuery["address.state"] = state;
      }

      // Find branches that match the city and/or state
      const matchingBranches = await Branch.find(branchQuery).select("_id");
      branchIds = matchingBranches.map((branch) => branch._id);
    }

    // If branchIds are found, filter problems based on them
    if (branchIds.length > 0) {
      query["volunteeringDetails.branches"] = { $in: branchIds };
    }

    const problems = await Problem.find(query);
    return problems;
  } catch (error) {
    throw error;
  }
};


exports.getOrganizationBranches = async ({ organizationId }) => {
  const branches = await Branch.find({
    organizationId,
    deletedAt: null,
  });

  if (!branches) {
    throw new Error("No branches found for this organization");
  }

  return branches;
};
