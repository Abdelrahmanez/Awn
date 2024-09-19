const Problem = require("../../../models/problem");
const {
  isProblemClosed,
  isVolunteeringProblem,
} = require("../../../utils/problemUtils");

exports.validateVolunteerToProblem = async (req, res, next) => {
  const { problemId } = req.params;
  const { branchId, activityId } = req.body;

  if (!problemId) {
    return res.status(400).jsend.fail({ message: "Problem ID is required" });
  }

  // Fetch the problem data
  const problem = await Problem.findById(problemId);

  if (!problem) {
    return res.status(404).jsend.fail({ message: "Problem not found" });
  }

  req.problem = problem; // Pass the problem data to the controller

  // Ensure the problem is a volunteering type and is active
  if (!isVolunteeringProblem(problem)) {
    return res.status(400).jsend.fail({ message: "Not a volunteering problem" });
  }
  if (isProblemClosed(problem)) {
    return res.status(400).jsend.fail({ message: "Problem is not active" });
  }

  // Ensure volunteeringDetails is populated
  if (!problem.volunteeringDetails) {
    return res
      .status(400)
      .jsend.fail({ message: "Volunteering details not found for the problem" });
  }

  // Check if branches exist and if branchId is valid for the problem
  if (branchId) {
    const { branches } = problem.volunteeringDetails;
    if (!branches || !Array.isArray(branches)) {
      return res
        .status(400)
        .jsend.fail({ message: "Branches not found in problem" });
    }
    if (!branches.includes(branchId)) {
      return res.status(400).jsend.fail({
        message: "Branch is not associated with this problem",
      });
    }
  }

  // Check if activities exist and if activityId is valid for the problem
  if (activityId) {
    const { activities } = problem.volunteeringDetails;
    if (!activities || !Array.isArray(activities)) {
      return res
        .status(400)
        .jsend.fail({ message: "Activities not found in problem" });
    }
    const validActivity = activities.some(
      (activity) => activity._id.toString() === activityId
    );
    if (!validActivity) {
      return res.status(400).jsend.fail({
        message: "Activity is not associated with this problem",
      });
    }
  }

  next(); // Proceed to the next middleware/controller
};
