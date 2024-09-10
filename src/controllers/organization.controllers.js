const Organization = require("../models/organization");
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

  const organizationId = OrganizationAdmin.findOne({
    userId: req.user._id,
  }).organizationId;

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

  const problem = await Problem.create({
    organizationId,
    title,
    description,
    problemType,
    donationDetails,
    volunteeringDetails,
    volunteers,
    donations,
    status,
    endDate,
  });

  res.status(201).jsend.success({
    message: "Problem created successfully",
    problem: problem,
  });

  return;
});
