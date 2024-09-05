const jwt = require("jsonwebtoken");
const User = require("../models/user");
const asyncHandler = require("express-async-handler");

const authenticateToken = asyncHandler(async (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.jsend.fail({ message: "The user is not authorized" });
  }

  try {
    // Verify JWT and decode token
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    console.log(decoded);

    // Find user by ID in the decoded token
    const user = await User.findOne({ _id: decoded._id });

    if (!user) {
      return res.jsend.fail({ message: "The token is not valid" });
    }

    // Check if the token exists in the user's tokens array
    const foundToken = user.tokens.find((t) => t.token === token);

    if (!foundToken) {
      return res.jsend.fail({ message: "Token not found" });
    }

    if (foundToken.blocked) {
      return res.status(403).jsend.fail({ message: "The token is blocked" });
    }

    // Attach user info to the request
    req.user = user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).jsend.fail({ message: "Token expired" });
    }
    return res
      .status(403)
      .jsend.fail({ message: "The user is not authorized" });
  }
});

module.exports = authenticateToken;
