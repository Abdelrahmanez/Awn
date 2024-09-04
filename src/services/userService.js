// services/userService.js
const bcrypt = require("bcryptjs");
const User = require("../models/user");
const { generateAccessToken, generateRefreshToken } = require("../middlewares/jwtTokens");

async function authenticateUser(emailOrUsername, password) {
  const lowerCaseEmailOrUsername = emailOrUsername.toLowerCase();
  const user = await User.findOne({
    $or: [{ email: lowerCaseEmailOrUsername }, { username: lowerCaseEmailOrUsername }]
  });

  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    throw new Error("Invalid credentials");
  }

  return user;
}

async function loginUser(user) {
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken(user);
  return { accessToken, refreshToken };
}

module.exports = { authenticateUser, loginUser };
