const User = require("../models/user");
const bcrypt = require("bcryptjs");
const hash = 10;
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../middlewares/auth/jwtTokens");
const authenticateToken = require("../middlewares/auth/authentication");
const isActiveAccount = require("../middlewares/auth/isActiveAccount");
const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const Volunteerings = require("../models/volunteerings");
const mongoose = require("mongoose");
const { organization } = require("../utils/userRoles");
const Problem = require("../models/problem");
const organizationService = require("../services/organizationService");
const { renameImageFile } = require("../utils/imageHelper");
const processImage = require("../utils/compressImage");
const {
  isProblemClosed,
  isVolunteeringProblem,
} = require("../utils/problemUtils");

exports.registerUserController = asyncHandler(async (req, res) => {
  console.log(req.body);
  console.log(req.file);
  const {
    fullName,
    username,
    email,
    phoneNumber,
    password,
    address,
    birthDate,
    skills,
    gender,
  } = req.body;
  const hashedPassword = await bcrypt.hash(password, hash);

  // Create the new user
  const user = await User.create({
    fullName,
    // Convert the username to lowercase
    username: username.toLowerCase(),
    // Convert the email to lowercase
    email: email.toLowerCase(),
    phoneNumber,
    passwordHash: hashedPassword,
    address,
    birthDate,
    skills,
    gender,
  });

  // Rename the profile image file to match the user's id
  if (req.file) {
    try {
      const profileImagePath = await processImage(
        req.file,
        user._id,
        "profile"
      );
      user.profileImage = profileImagePath;
      await user.save();
    } catch (error) {
      console.error("Error processing image:", error);
      return res.status(500).jsend.fail("Error processing image");
    }
  } else {
    return res.status(400).jsend.fail("Logo is required");
  }

  res.status(201).jsend.success({
    user,
  });
});

exports.loginUserController = asyncHandler(async (req, res) => {
  console.log("loginUserController");
  const { emailOrUsername, password } = req.body;

  const lowercaseEmailOrUsername = emailOrUsername.toLowerCase();

  const user = await User.findOne({
    $or: [
      { email: lowercaseEmailOrUsername },
      { username: lowercaseEmailOrUsername },
    ],
  });

  if (user) {
    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (passwordMatch) {
      const accessToken = await generateAccessToken(user);
      const refreshToken = await generateRefreshToken(user);
      return res.jsend.success({ accessToken, refreshToken });
    }
  }

  return res.jsend.fail("Invalid email or password");
});

exports.volunteerController = asyncHandler(async (req, res) => {
  const { problem } = req; // Problem is injected by middleware
  const { joinedDays, branchId, activityId } = req.body;
  const userId = req.user._id;

  // Create the new volunteer record
  const volunteer = await Volunteerings.create({
    problemId: problem._id,
    userId,
    branchId,
    joinedDays,
    activityId,
  });

  return res.jsend.success({ volunteer });
});

exports.sendHello = async (req, res) => {
  try {
    return res.status(200).jsend.success({ message: "Hello World" });
  } catch (error) {
    res.status(500).jsend.error({ message: error.message });
  }
};

exports.getProfile = async (req, res) => {
  try {
    return res.status(200).jsend.success({ user: req.user });
  } catch (error) {
    res.status(500).jsend.error({ message: error.message });
  }
};

exports.updateUserController = asyncHandler(async (req, res) => {
  const {
    fullName,
    email,
    phoneNumber,
    password,
    passwordConfirmation,
    address,
    birthDate,
    skills,
    isScorePrivate,
    gender,
  } = req.body;

  // Check if password and password confirmation match
  if (password && password !== passwordConfirmation) {
    return res.status(400).jsend.fail({ message: "Passwords do not match" });
  }

  // Fetch the user from the database
  const user = await User.findById(req.user._id);
  if (!user) {
    return res.status(404).jsend.fail({ message: "User not found" });
  }

  // Update user details
  if (fullName) user.fullName = fullName;
  if (email) user.email = email.toLowerCase();
  if (phoneNumber) user.phoneNumber = phoneNumber;

  if (address) {
    user.address = {
      ...user.address, // Preserve existing address fields
      ...address, // Update with provided address fields
    };
  }

  if (birthDate) user.birthDate = birthDate;
  if (skills) user.skills = skills;
  if (isScorePrivate !== undefined) user.isScorePrivate = isScorePrivate;
  if (gender) user.gender = gender;

  // Update password if provided
  if (password) {
    const hashedPassword = await bcrypt.hash(password, 10); // Use 10 as the salt rounds
    user.passwordHash = hashedPassword;
  }

  // Save the updated user
  await user.save();

  // Return success response
  return res.jsend.success({ user });
});

exports.getVolunteeringHistory = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Aggregation pipeline
  const volunteerings = await Volunteerings.aggregate([
    // Match documents with the given userId
    { $match: { userId: userId } }, // Ensure userId is properly matched

    // Lookup to join with the Problem collection
    {
      $lookup: {
        from: "problems", // The collection name for the Problem model
        localField: "problemId", // Field in Volunteerings schema
        foreignField: "_id", // Field in Problem schema
        as: "problemDetails", // Field name to store the joined document
      },
    },

    // Unwind the problemDetails array to get a single document
    { $unwind: { path: "$problemDetails", preserveNullAndEmptyArrays: true } },

    // Optionally, project fields to include only necessary ones
    {
      $project: {
        _id: 1,
        userId: 1,
        problemId: 1,
        branchId: 1,
        joinedDays: 1,
        createdAt: 1,
        updatedAt: 1,
        updatedBy: 1,
        // Include problem details from the lookup
        problemDetails: {
          _id: "$problemDetails._id",
          organizationId: "$problemDetails.organizationId",
          title: "$problemDetails.title",
          description: "$problemDetails.description",
          problemType: "$problemDetails.problemType",
          problemCategory: "$problemDetails.problemCategory",
          donationDetails: "$problemDetails.donationDetails",
          volunteeringDetails: "$problemDetails.volunteeringDetails",
          status: "$problemDetails.status",
          endDate: "$problemDetails.endDate",
          terminated: "$problemDetails.terminated",
        },
      },
    },
  ]);

  return res.jsend.success({ volunteerings });
});

// get a specific organization by id which is not deleted and active
exports.getOrganizationById = asyncHandler(async (req, res) => {
  const { organizationId } = req.params;
  const organization =
    await organizationService.getActiveAndNotDeletedOrganization({
      organizationId,
    });
  if (!organization) {
    return res.status(404).jsend.fail({ message: "Organization not found" });
  }

  return res.jsend.success(organization);
});

// get all organizations which are not deleted and active
exports.getAllOrganizations = asyncHandler(async (req, res) => {
  const organizations = await organizationService.getAllOrganizations();
  if (!organizations || organizations.length === 0) {
    return res.status(404).jsend.fail({ message: "No organizations found" });
  }
  return res.status(200).jsend.success({ organizations });
});

exports.getRandomProblems = asyncHandler(async (req, res) => {
  const problemType = req.query.problemType ? req.query.problemType : "both";

  // Initialize the query object
  const query = {};

  // If problemType is provided, split and trim it, then apply it to the query
  if (problemType) {
    const problemTypeArray = problemType.split(",").map((type) => type.trim());
    query.problemType = { $in: problemTypeArray };
  }

  // Perform the aggregation and include the organization details
  const problems = await Problem.aggregate([
    { $match: query }, // Match the problems by type
    { $sample: { size: 15 } }, // Randomly select 15 problems
    {
      $lookup: {
        from: "organizations", // The collection to join
        localField: "organizationId", // Field in the problems
        foreignField: "_id", // Field in the organizations
        as: "organizationInfo", // Output array field
      },
    },
    { $unwind: "$organizationInfo" }, // Unwind the organizationInfo array
  ]);

  // Map over the problems to format the organization data and attach it
  const formattedProblems = problems.map((problem) => ({
    ...problem, // Copy all problem fields
    organization: {
      name: problem.organizationInfo.name,
      ID: problem.organizationInfo._id,
    },
  }));

  // Return the response using JSend
  return res.status(200).jsend.success({ problems: formattedProblems });
});

// get all problems for a specific organization which are not deleted and not terminated
exports.getOrganizationProblems = asyncHandler(async (req, res) => {
  const { organizationId } = req.params;
  const { status } = req.body.status ? req.body.status : { status: "open" };

  const problems = await organizationService.getOrganizationProblems({
    organizationId,
    status,
  });
  if (!problems) {
    return res.status(404).jsend.fail({ message: "No problems found" });
  }

  return res.jsend.success({ problems });
});

// get all problems for all organizations which are not deleted and not terminated
exports.getProblems = asyncHandler(async (req, res) => {
  const { category, city, state, skills, date, problemType, status } =
    req.query;

  console.log(req.query);

  const problems = await organizationService.getAllProblems({
    status,
    category,
    city,
    state,
    skills,
    date,
    problemType,
  });
  if (!problems || problems.length === 0) {
    return res.status(404).jsend.fail({ message: "No problems found" });
  }

  const formattedProblems = problems.map((problem) => ({
    ...problem.toObject(), // Convert Mongoose document to plain object
    organization: {
      name: problem.organizationId.name,
      ID: problem.organizationId._id,
    },
  }));
  return res.status(200).jsend.success({ problems: formattedProblems });
});

exports.getProblemById = asyncHandler(async (req, res) => {
  const { problemId } = req.params;

  const problem = await organizationService.getProblemById({ problemId });
  if (!problem) {
    return res.status(404).jsend.fail({ message: "Problem not found" });
  }

  return res.jsend.success(problem);
});

exports.getOrganizationBranches = asyncHandler(async (req, res) => {
  const { organizationId } = req.params;

  const branches = await organizationService.getOrganizationBranches({
    organizationId,
  });
  if (!branches || branches == []) {
    return res.status(404).jsend.fail({ message: "No branches found" });
  }

  return res.jsend.success({ branches });
});

exports.sendhey = (req, res) => {
  // authenticateToken(req, res);
  console.log("hey");
};
