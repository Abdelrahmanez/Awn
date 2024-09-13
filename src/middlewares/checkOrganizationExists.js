const Organization = require("../models/Organization");
const asyncHandler = require("express-async-handler");

const checkOrganizationExists = asyncHandler(async (req, res, next) => {
  const { username } = req.body;

  const organization = await Organization.findOne({
    username,
  });

  if (organization) {
    res.status(400).jsend.fail("Organization already exists");
  }

  next();
});

module.exports = checkOrganizationExists;
