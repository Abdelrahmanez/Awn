const Organization = require("../models/Organization");
const bcrypt = require("bcryptjs");
const hash = 10;
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../middlewares/jwtTokens");
const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const Problem = require("../models/problem");
const OrganizationAdmin = require("../models/organizationAdmin");

exports.registerOrganizationController = asyncHandler(async (req, res) => {
  const {
    name,
    slogan,
    description,
    website,
    policies,
    address,
    logo,
    socialMedia,
    mission,
    username,
    email,
    phoneNumber,
    password,
    passwordConfirmation,
  } = req.body;

  const hashedPassword = await bcrypt.hash(password, hash);

  // Create the new user
  const organization = await Organization.create({
    name,
    slogan,
    description,
    website,
    policies,
    address,
    logo,
    socialMedia,
    mission,
    // Convert the username to lowercase
    username: username.toLowerCase(),
    // Convert the email to lowercase
    email: email.toLowerCase(),
    phoneNumber,
    passwordHash: hashedPassword,
  });
  organization.save();
  res.status(201).json({
    message: "organization created successfully",
    organization: organization,
  });
  return user;
});

exports.loginOrganizationController = asyncHandler(async (req, res) => {
  const { username, password } = req.body;

  const organization = await Organization.findOne({
    username: username.toLowerCase(),
  });

  if (!organization) {
    res.status(400).jsend.fail("Organization does not exist");
  }

  const validPassword = await bcrypt.compare(
    password,
    organization.passwordHash
  );

  if (!validPassword) {
    res.status(400).jsend.fail("Invalid password");
  }

  const accessToken = generateAccessToken(organization);
  const refreshToken = generateRefreshToken(organization);

  res.status(200).jsend.success({
    accessToken: accessToken,
    refreshToken: refreshToken,
  });

  return organization;
});

exports.addProblemController = asyncHandler(async (req, res) => {
  console.log("addProblemController");
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.jsend.fail(errors.array());
  }

  const organizationAdmin = await OrganizationAdmin.findOne({
    userId: req.user.id,
  });

  if (!organizationAdmin) {
    return res.status(404).jsend.fail({ message: "Organization admin not found" });
  }

  const organizationId = organizationAdmin.organizationId;

  const {
    title,
    description,
    problemType,
    donationDetails,
    volunteeringDetails,
    volunteers,
    donations,
    status,
    endDate,
  } = req.body;

  // Prepare the problem data based on the problemType
  const problemData = {
    organizationId,
    title,
    description,
    problemType,
    volunteers,
    donations,
    status,
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
