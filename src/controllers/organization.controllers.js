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
const authenticateToken = require("../middlewares/auth");
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

  const dataValid = await registerValidation({
    registerType: "organization",
    name,
    username,
    email,
    phoneNumber,
    password,
    passwordConfirmation,
  });
  if (dataValid) {
    return res.status(400).json(dataValid);
  }

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

exports.addNewProblemController = asyncHandler(async (req, res) => {
  const { title, description, category, location, media } = req.body;

  const problem = await Problem.create({
    title,
    description,
    category,
    location,
    media,
    organization: req.user._id,
  });
  problem.save();
  res.status(201).json({
    message: "problem created successfully",
    problem: problem,
  });
  return problem;
});
