const { body, param } = require("express-validator");

const isMongoObjectId = ({ attribute }) => {
  return [
    param(attribute)
      .isMongoId()
      .withMessage(`${attribute} is not a valid mongo id`),
  ];
};

module.exports = isMongoObjectId;
