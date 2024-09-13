const Organization = require("../models/Organization");
const bcrypt = require("bcryptjs");
const hash = 10;
const {
  generateAccessToken,
  generateRefreshToken,
  generateOrganizationAccessToken,
  generateOrganizationRefreshToken,
} = require("../middlewares/jwtTokens");
const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const Problem = require("../models/problem");
const OrganizationAdmin = require("../models/organizationAdmin");
const Branch = require("../models/branch");

exports.registerOrganizationController = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.jsend.fail(errors.array());
  }

  const {
    name,
    description,
    username,
    slogan,
    password,
    contactPhoneNumbers,
    contactEmails,
    paymentDetails,
    website,
    logo,
    socialMedia,
  } = req.body;

  const hashedPassword = await bcrypt.hash(password, hash);

  // Create the new user
  const organization = await Organization.create({
    name,
    description,
    username: username.toLowerCase(),
    slogan,
    passwordHash: hashedPassword,
    contactPhoneNumbers,
    contactEmails,
    paymentDetails,
    website,
    logo,
    socialMedia,
  });
  organization.save();
  res.status(201).json({
    message: "organization created successfully",
    organization: organization,
  });
  return organization;
});

exports.loginOrganizationController = asyncHandler(async (req, res) => {
  const { emailOrUsername, password } = req.body;

  const organization = await Organization.findOne({
    username: emailOrUsername.toLowerCase(),
  });

  if (!organization) {
    return res.status(400).jsend.fail("Organization does not exist");
  }

  if (!organization.isActive) {
    return res.status(400).jsend.fail("Organization is not active");
  }

  const validPassword = await bcrypt.compare(
    password,
    organization.passwordHash
  );

  if (!validPassword) {
    return res.status(400).jsend.fail("Invalid password");
  }

  const accessToken = await generateOrganizationAccessToken(organization);
  const refreshToken = await generateOrganizationRefreshToken(organization);

  res.status(200).jsend.success({
    accessToken: accessToken,
    refreshToken: refreshToken,
  });

  return organization;
});

exports.addProblemController = asyncHandler(async (req, res) => {
  const organizationId = req.user.organizationId;

  const {
    title,
    description,
    problemType,
    problemCategory,
    donationDetails,
    volunteeringDetails,
    availableDates,
    endDate,
  } = req.body;

  // Prepare the problem data based on the problemType
  const problemData = {
    organizationId,
    title,
    description,
    problemType,
    problemCategory,
    availableDates,
    endDate,
  };

  // Attach donationDetails if the problemType is "donation" or "both"
  if (problemType === "donation" || problemType === "both") {
    problemData.donationDetails = donationDetails;
  }

  // Attach volunteeringDetails if the problemType is "volunteering" or "both"
  if (problemType === "volunteering" || problemType === "both") {
    problemData.volunteeringDetails = volunteeringDetails;
  }

  // Create the problem with the appropriate details
  const problem = await Problem.create(problemData);

  res.status(201).jsend.success({
    message: "Problem created successfully",
    problem: problem,
  });

  return;
});

exports.addBranchController = asyncHandler(async (req, res) => {
  console.log("addBranchController");

  const { name, address, location, contactPhoneNumbers } = req.body;
  const organizationId = req.user.organizationId;

  const branch = await Branch.create({
    organizationId,
    name,
    address,
    location,
    contactPhoneNumbers,
  });

  res.status(201).jsend.success({
    message: "Branch created successfully",
    branch: branch,
  });

  return;
});
