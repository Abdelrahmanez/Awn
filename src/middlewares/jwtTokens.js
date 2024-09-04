const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const isActiveAccount = require("./isActiveAccount");

const generateAccessToken = async (user) => {
  const isActive = isActiveAccount(user);
  console.log("isActive", isActive);
  if (!isActive) {
    throw new Error("Account is not active");
  }

  console.log("generating Access Token");

  const newAccessToken = await jwt.sign(
    { _id: user._id },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "7d",
    }
  );
  user.tokens = user.tokens.concat({ token: newAccessToken, blocked: false });
  await user.save();
  return newAccessToken;
};

const generateRefreshToken = (user) => {
  return jwt.sign({ _id: user._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: "7d",
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
};
