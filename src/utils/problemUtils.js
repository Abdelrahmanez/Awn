exports.isProblemClosed = (problem) => {
  return problem.status === "closed" || problem.terminated;
};

exports.isVolunteeringProblem = (problem) => {
  return (
    problem.problemType === "volunteering" || problem.problemType === "both"
  );
};
