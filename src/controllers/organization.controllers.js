const Organization = require("../models/organization");
const bcrypt = require("bcryptjs");
const hash = 10;
const {
  passwordValidation,
  emailValidation,
  phoneNumberValidation,
  nameValidation,
  usernameValidation,
  authenticate,
  userExists,
  registerValidation,
} = require("../middlewares/validations");
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../middlewares/jwtTokens");
const authenticateToken = require("../middlewares/authentication");
const isActiveAccount = require("../middlewares/isActiveAccount");
const asyncHandler = require("express-async-handler");

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
