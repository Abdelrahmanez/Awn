const Organization = require("../models/Organization");
const Problem = require("../models/problem");
const mongoose = require("mongoose");

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
exports.getAllProblems = async ({ status }) => {
  const problems = await Problem.find({
    deletedAt: null,
    terminated: false,
    status,
  });

  return problems;
};
