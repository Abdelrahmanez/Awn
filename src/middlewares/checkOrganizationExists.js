const Organization = require("../models/organization");
const asyncHandler = require("express-async-handler");

const checkOrganizationExists = asyncHandler(async (req, res, next) => {
  const { email, phoneNumber, username } = req.params;

  const organization = await Organization.findOne({
    $or: [{ email }, { phoneNumber }, { username }],
  });

  if (organization) {
    res.status(400).jsend.fail("Organization already exists");
  }

  next();
});

module.exports = checkOrganizationExists;
