const Organization = require("../models/Organization");
const Problem = require("../models/problem");

exports.getActiveAndNotDeletedOrganization = async ({ organizationId }) => {
  const organization = await Organization.findOne({
    _id: organizationId,
    deletedAt: null,
    isActive: true,
  });

  return organization;
};

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

exports.getAllOrganizationProblem = async ({ organizationId, status }) => {
  const problems = await Problem.find({
    organizationId,
    deletedAt: null,
    terminated: false,
    status,
  });

  return problems;
};

exports.getOrganizationDeletedProblem = async ({ organizationId }) => {
  const problems = await Problem.find({
    organizationId,
    deletedAt: { $ne: null },
  });

  return problems;
};
