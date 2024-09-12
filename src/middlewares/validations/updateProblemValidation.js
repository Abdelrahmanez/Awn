const { body } = require("express-validator");

const updateProblemValidation = () => {
  return [
    body("title").isString().optional(),
    body("description").isString().optional(),
    body("status").isString().optional(),
    body("priority").isString().optional(),
    body("dueDate").isDate().optional(),
    body("assignedTo").isString().optional(),
  ];
};


module.exports = updateProblemValidation;