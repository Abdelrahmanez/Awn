// in this file we will handle all the user related routes and their controllers
// what do controllers do? they handle the request and response of the user routes and interact with the database if needed to  get the data
//  is it only for the business logic? yes, it is only for the business logic
// so i don't validate the data here? no, you don't validate the data here, you validate the data in the middlewares
// what if i want to hash the password before saving it to the database? you can do that here , is it supposed to be done here? no, it is supposed to be done in the middlewares
// in which file should i hash the password ? isn't it bussiness logic? yes, it is business logic, but it is also a middleware, so you can hash the password in the middlewares
// so in a steps of a request, the request comes in, it goes through the middlewares, then it goes to the controllers, then the controllers interact with the database if needed, then the response is sent back to the user
// for example in the signup route what middlewares can be used? the middlewares that can be used are the validation middlewares, the checkUserExists middleware, the hashPassword middleware
// is this is every middleware that can be used? no, there are many other middlewares that can be used, but these are the most common ones
// so what are the other middlewares that can be used? the other middlewares that can be used are the authentication middleware,
//  the authorization middleware, the isActiveAccount middleware, the checkUserExists middleware, the hashPassword middleware,
//   the generateToken middleware, the verifyToken middleware, the refreshToken middleware, the checkUserExists middleware,
//    the checkOrganizationExists middleware, the checkUserIsAdmin middleware, the checkOrganizationIsAdmin middleware,
//     the checkOrganizationIsOwner middleware, the checkUserIsOwner middleware, the checkUserIsMember middleware,
//      the checkOrganizationIsMember middleware, the checkUserIsSuperAdmin middleware, the checkOrganizationIsSuperAdmin middleware,
//       the checkUserIsModerator middleware, the checkOrganizationIsModerator middleware, the checkUserIsRegularUser middleware,
//        the checkOrganizationIsRegularUser middleware, the checkUserIsGuest middleware, the checkOrganizationIsGuest middleware,
//         the checkUserIsBlocked middleware, the checkOrganizationIsBlocked middleware, the checkUserIsNotBlocked middleware,
//          the checkOrganizationIsNotBlocked middleware, the checkUserIsNotDeleted middleware,
//           the checkOrganizationIsNotDeleted middleware, the checkUserIsDeleted middleware,
//            the checkOrganizationIsDeleted middleware, the checkUserIsNotSuspended middleware,
//             the checkOrganizationIsNotSuspended middleware, the checkUserIsSuspended middleware,
//              the checkOrganizationIsSuspended middleware, the checkUserIsNotInactive middleware,
//               the checkOrganizationIsNotInactive middleware, the checkUserIsInactive middleware,
//                the checkOrganizationIsInactive middleware, the checkUserIsNotDisabled middleware,
//                the checkOrganizationIsNotDisabled middleware, the checkUserIsDisabled middleware,
//                 the checkOrganizationIsDisabled middleware, the checkUserIsNotBanned middleware,
//                  the checkOrganizationIsNotBanned middleware, the checkUserIsBanned middleware,
//                   the checkOrganizationIsBanned middleware, the checkUserIsNotVerified middleware,
//                    the checkOrganizationIsNotVerified middleware, the checkUserIsVerified middleware,
//                     the checkOrganizationIsVerified middleware, the checkUserIsNotUnverified middleware,
//                      the checkOrganizationIsNotUnverified middleware, the checkUserIsUnverified middleware,
//                       the checkOrganizationIsUnverified middleware, the checkUserIsNotUnconfirmed middleware,
//                        the checkOrganizationIsNotUnconfirmed middleware, the checkUserIsUnconfirmed middleware,
//                         the checkOrganizationIsUnconfirmed middleware, the checkUserIsNotConfirmed middleware,
//                          the checkOrganizationIsNotConfirmed middleware, the checkUserIsConfirmed middleware,
//                           the checkOrganizationIsConfirmed middleware, the checkUserIsNotUnapproved middleware,
//                            the checkOrganizationIsNot

// and what should be in the controllers? the controllers should have the business logic, the controllers should interact with the database if needed, the controllers should send the response back to the user
// for example in the signup route, what should be in the controller? the controller should have the logic to create a new user, the controller should interact with the database to create a new user, the controller should send the response back to the user
// give me an example of a controller function that registers a user? the registerUserController function is an example of a controller function

// if i'm making a middleware to validate the user registration data, where should i put it? you should put it in the middlewares folder
// and what should be it's name? it's name should be registerValidation
const User = require("../models/user");
const bcrypt = require("bcryptjs");
const hash = 10;
const {
  generateAccessToken,
  generateRefreshToken,
} = require("../middlewares/jwtTokens");
const authenticateToken = require("../middlewares/authentication");
const isActiveAccount = require("../middlewares/isActiveAccount");
const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const Volunteerings = require("../models/volunteerings");

exports.registerUserController = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.jsend.fail(errors.array());
  }
  const {
    fullName,
    username,
    email,
    phoneNumber,
    password,
    passwordConfirmation,
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
  });
  user.save();
  return res.jsend.success({ user });
});

exports.loginUserController = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.jsend.fail(errors.array());
  }
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
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.jsend.fail(errors.array());
  }
  const { problemId } = req.params;
  const { joinedDays, branchId } = req.body;
  const userId = req.user._id;

  // Create the new user
  const volunteer = await Volunteerings.create({
    problemId,
    userId,
    branchId,
    joinedDays,
  });
  volunteer.save();
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

exports.sendhey = (req, res) => {
  // authenticateToken(req, res);
  console.log("hey");
};
