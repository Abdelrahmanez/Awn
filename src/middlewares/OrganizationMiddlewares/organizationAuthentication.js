const JWT = require("jsonwebtoken");
const asyncHandler = require("express-async-handler");
const Organization = require("../../models/Organization");
const { validationResult } = require("express-validator");

const authenticateOrganizationToken = asyncHandler(async (req, res, next) => {
  console.log("Authenticating organization token");
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).jsend.fail({ errors: errors.array() });
  }
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.jsend.fail({ message: "The organization is not authenticated" });
  }

  try {
    // Verify JWT and decode token
    const decoded = JWT.verify(token, process.env.ACCESS_TOKEN_SECRET);

    console.log(decoded);

    // Find organization by ID in the decoded token
    const organization = await Organization.findOne({ _id: decoded._id });

    if (!organization) {
      return res.jsend.fail({ message: "The token is not valid" });
    }

    // Check if the token exists in the organization's tokens array
    const foundToken = organization.tokens.find((t) => t.token === token);

    if (!foundToken) {
      return res.jsend.fail({ message: "Token not found" });
    }

    if (foundToken.blocked) {
      return res.status(403).jsend.fail({ message: "The token is blocked" });
    }

    // Attach organization info to the request
    console.log("Organization authenticated");
    req.organization = organization;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).jsend.fail({ message: "Token expired" });
    }
    return res
      .status(403)
      .jsend.fail({ message: "The organization is not authorized" });
  }
});

module.exports = authenticateOrganizationToken;
