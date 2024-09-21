const jwt = require("jsonwebtoken");
const User = require("../../models/user");
const asyncHandler = require("express-async-handler");
const { validationResult } = require("express-validator");
const userRoles = require("../../utils/userRoles");
const OrganizationAdmin = require("../../models/organizationAdmin");
const Organization = require("../../models/Organization");

const authenticateToken = asyncHandler(async (req, res, next) => {
  console.log("Authenticating token");
  console.log(req.body);

  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.jsend.fail({ message: "The user is not authenticated" });
  }

  try {
    console.log("Token:", token);
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    console.log("Decoded Token:", decoded);

    let user;
    const userType = decoded.role;

    if (userType === userRoles.user || userType === userRoles.admin) {
      user = await User.findOne({ _id: decoded._id });
    } else if (userType === userRoles.organization) {
      console.log("Fetching Organization");
      user = await Organization.findOne({ _id: decoded._id });
      user.organizationId = user._id;
    } else {
      return res
        .status(403)
        .jsend.fail({ message: "The user is not authorized" });
    }

    if (!user) {
      return res.jsend.fail({ message: "The token is not valid" });
    }

    const foundToken = user.tokens.find((t) => t.token === token);

    if (!foundToken) {
      return res.jsend.fail({ message: "Token not found" });
    }

    if (foundToken.blocked) {
      return res.status(403).jsend.fail({ message: "The token is blocked" });
    }

    if (user.isActive === false) {
      return res.status(400).jsend.fail({ message: "User is not active" });
    }
    if (userType === userRoles.admin) {
      console.log("Admin User");
      const organizationAdmin = await OrganizationAdmin.findOne({
        userId: decoded._id,
      });
      if (!organizationAdmin) {
        return res
          .status(404)
          .jsend.fail({ message: "The user is not Admin at any Organization" });
      }
      user.organizationId = organizationAdmin.organizationId;
      user.permissions = organizationAdmin.role;
      console.log("Organization Admin:", organizationAdmin);
    }
    req.user = user; // Attach user info to the request
    next();
  } catch (err) {
    console.error("JWT Error:", err);
    if (err.name === "TokenExpiredError") {
      return res.status(401).jsend.fail({ message: "Token expired" });
    }
    return res
      .status(403)
      .jsend.fail({ message: "The user is not authorized" });
  }
});

module.exports = authenticateToken;
