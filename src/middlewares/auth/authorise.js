
module.exports = (...roles) => {

  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).jsend.fail({ message: "User not authenticated" });
    }

    if (req.user.role === "admin" ) {
      const permissions = req.user.permissions;

      // Check if any of the roles are included in the permissions array
      const hasPermission = roles.some(role => permissions.includes(role));
      
      if (!hasPermission) {
        return res
          .status(403)
          .jsend.fail({ message: "The user is not authorized" });
      }
    } else if (!roles.includes(req.user.role)) {
      return res
        .status(403)
        .jsend.fail({ message: "The user is not authorized" });
    }

    next();
  };
};
