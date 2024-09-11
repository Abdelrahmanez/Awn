module.exports = (...roles) => {
  console.log("Authorizing user");

  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).jsend.fail({ message: "User not authenticated" });
    }

    if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .jsend.fail({ message: "The user is not authorized" });
    }

    next();
  };
};
