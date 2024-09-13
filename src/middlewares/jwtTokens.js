const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const isActiveAccount = require("./isActiveAccount");
const userRoles = require("../utils/userRoles");

const generateOrganizationAccessToken = async (organization) => {
  const newAccessToken = await jwt.sign(
    { _id: organization._id, role: "organization" },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_LIFE,
    }
  );
  organization.tokens = organization.tokens.concat({
    token: newAccessToken,
    blocked: false,
  });
  await organization.save();
  return newAccessToken;
};

const generateOrganizationRefreshToken = (organization) => {
  return jwt.sign(
    { _id: organization._id, role: "organization" },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_LIFE,
    }
  );
};

const generateAccessToken = async (user) => {
  const isActive = isActiveAccount(user);
  if (!isActive) {
    throw new Error("Account is not active");
  }

  const newAccessToken = await jwt.sign(
    { _id: user._id, role: user.role },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCESS_TOKEN_LIFE,
    }
  );
  user.tokens = user.tokens.concat({ token: newAccessToken, blocked: false });
  await user.save();
  return newAccessToken;
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { _id: user._id, role: user.role },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_LIFE,
    }
  );
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  generateOrganizationAccessToken,
  generateOrganizationRefreshToken,
};
