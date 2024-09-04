const jwt = require("jsonwebtoken");
const User = require("../models/user");

const tokenBlocked = async (req, res) => {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Unauthorized: No token provided" });
  } // Unauthorized

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findOne({ _id: decoded._id });

    if (!user) {
      return res.status(403).json({ message: "Forbidden: No user found" }); // 403 Forbidden
    }

    const tokenBlocked = user.tokens.find(
      (t) => t.token === token && t.blocked
    );
    if (tokenBlocked) {
      return res.status(403).json({ message: "Forbidden: Token blocked" });
    }

    return (req.user = user);
  } catch (err) {
    res.sendStatus(403); // Forbidden
  }
};

module.exports = tokenBlocked;
