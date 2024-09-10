const { body } = require("express-validator");
const problemsType = require("../../utils/problemsType");

const addProblemValidation = () => {
  const problemTypesArray = problemsType.map((problemType) => problemType.name);
  console.log(problemTypesArray);
  return [
    body("title")
      .isLength({ min: 5 })
      .withMessage("Title must be at least 5 characters long"),
    body("description")
      .isLength({ min: 20 })
      .withMessage("Description must be at least 20 characters long"),
    body("problemType")
      .isIn(["donation", "volunteering", "both"])
      .withMessage(
        "Problem type must be one of the following: donation, volunteering, both"
      ),
    body("problemCategory")
      .isIn(problemTypesArray)
      .withMessage(
        `Category must be one of the following: ${problemTypesArray.join(", ")}`
      ),
    body("location").isString().withMessage("Location must be a string"),
  ];
};

module.exports = addProblemValidation;
