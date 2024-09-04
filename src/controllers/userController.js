const User = require("../models/user");
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
const { authenticateUser, loginUser } = require("../services/userService");

exports.registerUserController = asyncHandler(async (req, res) => {
  const { name, username, email, phoneNumber, password, passwordConfirmation } =
    req.body;

  // const dataNotValid = await registerValidation({
  //   registerType: "user",
  //   name,
  //   username,
  //   email,
  //   phoneNumber,
  //   password,
  //   passwordConfirmation,
  // });
  // if (dataNotValid) {
  //   return res.status(400).json(dataNotValid);
  // }
  console.log("Data is valid");
  const hashedPassword = await bcrypt.hash(password, hash);

  // Create the new user
  const user = await User.create({
    name,
    // Convert the username to lowercase
    username: username.toLowerCase(),
    // Convert the email to lowercase
    email: email.toLowerCase(),
    phoneNumber,
    passwordHash: hashedPassword,
  });
  user.save();
  res.status(201).json({ message: "User created successfully", data: user });
});

// exports.loginUserController = async (req, res) => {
//   const { emailOrUsername, password } = req.body;

//   try {
//     // convert email or username to lowercase
//     const lowerCaseEmailOrUsername = emailOrUsername.toLowerCase();
//     // Check if the email is valid if not this means the user is trying to login with a username
//     const isEmail = await emailValidation({ lowerCaseEmailOrUsername });
//     // check if the password is valid
//     const isPasswordValid = await passwordValidation({ password });

//     if (isPasswordValid || isEmail) {
//       return res.status(400).json(isPasswordValid || isEmail);
//     }

//     // Find the user by email or username
//     const user = isEmail
//       ? await User.findOne({ email: lowerCaseEmailOrUsername }) // If the email is valid, find the user by email
//       : await User.findOne({ username: lowerCaseEmailOrUsername }); // If the email is not valid, find the user by username

//     // If the user does not exist or the password is incorrect, return an error
//     if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     const isActive = await isActiveAccount(user);
//     if (!isActive) {
//       return res.status(403).json({ message: "Account is not active" });
//     }

//     const accessToken = await generateAccessToken(user);
//     const refreshToken = await generateRefreshToken(user);

//     res.json({ accessToken, refreshToken });
//     console.log("Logged in successfully");
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

exports.loginUserController = asyncHandler(async (req, res) => {
  const { emailOrUsername, password } = req.body;

  const user = await authenticateUser(emailOrUsername, password);

  const tokens = await loginUser(user);

  res.json(tokens);
});

exports.sendHello = async (req, res) => {
  try {
    const user = await authenticateToken(req, res);
    console.log(user);
    return res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.sendhey = (req, res) => {
  // authenticateToken(req, res);
  console.log("hey");
};
