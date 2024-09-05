const jwt = require("jsonwebtoken");
const User = require("../models/user");

const tokenBlocked = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    // If no token is provided, return a JSend fail response
    return res.jsend.fail({ message: "Unauthorized: No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findOne({ _id: decoded._id });

    if (!user) {
      // If no user is found, return a JSend fail response
      return res.jsend.fail({ message: "Forbidden: No user found" });
    }

    const isTokenBlocked = user.tokens.find(
      (t) => t.token === token && t.blocked
    );

    if (isTokenBlocked) {
      // If the token is blocked, return a JSend fail response
      return res.jsend.fail({ message: "Forbidden: Token blocked" });
    }

    // If everything is fine, attach the user to the request object and continue
    req.user = user;
    next();
  } catch (err) {
    // If there's an error with the token verification, return a JSend error response
    return res.jsend.error({ message: "Forbidden: Invalid token", error: err });
  }
};

module.exports = tokenBlocked;
