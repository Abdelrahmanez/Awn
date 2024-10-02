const Organization = require("../models/organization");
const bcrypt = require("bcryptjs");
const hash = 10;
const {
  generateAccessToken,
  generateRefreshToken,
  generateOrganizationAccessToken,
  generateOrganizationRefreshToken,
} = require("../middlewares/auth/jwtTokens");
const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const Problem = require("../models/problem");
const OrganizationAdmin = require("../models/organizationAdmin");
const Branch = require("../models/branch");
const { renameOrganizationLogo } = require("../utils/imageHelper");
const saveAndCompressFile = require("../utils/compressImage");
const processImage = require("../utils/compressImage");
const mongoose = require("mongoose");

exports.registerOrganizationController = asyncHandler(async (req, res) => {
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
    socialMedia,
  } = req.body;

  const hashedPassword = await bcrypt.hash(password, hash);

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
    socialMedia,
  });

  if (req.file) {
    try {
      const logoPath = await processImage(req.file, organization._id, "logo");
      organization.logo = logoPath;
      await organization.save();
    } catch (error) {
      console.error("Error processing image:", error);
      return res.status(500).jsend.fail("Error processing image");
    }
  } else {
    return res.status(400).jsend.fail("Logo is required");
  }

  res.status(201).jsend.success({
    organization,
  });
});

exports.updateOrganizationController = asyncHandler(async (req, res) => {
  const organizationId = req.user.organizationId;

  const {
    name,
    description,
    slogan,
    contactPhoneNumbers,
    contactEmails,
    paymentDetails,
    website,
    socialMedia,
    mainBranch,
  } = req.body;

  const organization = await Organization.findById(organizationId);

  if (!organization) {
    return res.status(404).jsend.fail("Organization not found");
  }

  organization.name = name || organization.name;
  organization.description = description || organization.description;
  organization.slogan = slogan || organization.slogan;
  organization.contactPhoneNumbers =
    contactPhoneNumbers || organization.contactPhoneNumbers;
  organization.contactEmails = contactEmails || organization.contactEmails;
  organization.paymentDetails = paymentDetails || organization.paymentDetails;
  organization.website = website || organization.website;
  organization.socialMedia = socialMedia || organization.socialMedia;
  organization.mainBranch = mainBranch || organization.mainBranch;

  if (req.file) {
    try {
      const logoPath = await processImage(req.file, organization._id, "logo");
      organization.logo = logoPath;
    } catch (error) {
      console.error("Error processing image:", error);
      return res.status(500).jsend.fail("Error processing image");
    }
  }

  await organization.save();

  res.status(200).jsend.success({
    organization,
  });
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

  if (!req.file) {
    return res.status(400).jsend.fail("Image is required");
  }

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

  // Set the image to an empty string
  problemData.image = "aa";

  console.log("Problem data:", problemData);

  // Create the problem with the appropriate details
  const problem = await Problem.create(problemData);

  console.log("Problem created:", problem);

  if (req.file) {
    try {
      const imagePath = await processImage(req.file, problem._id, "problem");
      problem.image = imagePath; // Changed from logo to image
      await problem.save();
    } catch (error) {
      console.error("Error processing image:", error);
      return res.status(500).jsend.fail("Error processing image");
    }
  } else {
    return res.status(400).jsend.fail("Image is required");
  }

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

exports.getBranch = asyncHandler(async (req, res) => {
  const { id } = req.params;

  // Validate the id
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).jsend.fail("Invalid branch ID");
  }

  const branch = await Branch.findById(id);

  if (!branch) {
    return res.status(404).jsend.fail("Branch not found");
  }

  res.status(200).jsend.success({
    branch,
  });
});
