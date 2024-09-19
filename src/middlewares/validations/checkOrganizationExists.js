const Organization = require("../../models/Organization");
const asyncHandler = require("express-async-handler");

const checkOrganizationExists = asyncHandler(async (req, res, next) => {
  const { username } = req.body;
  console.log(username);

  

  const organization = await Organization.findOne({
    username: username.toLowerCase(),
  });

  console.log(organization);

  if (organization) {
    return res.status(400).jsend.fail("Organization already exists with this username");
  }

  next();
});

module.exports = checkOrganizationExists;
