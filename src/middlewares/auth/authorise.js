module.exports = (...allowedRoles) => {
  return async (req, res, next) => {
    if (!req.user) {
      return res.status(401).jsend.fail({ message: "User not authenticated" });
    }

    // Check if the user's role is in the allowedRoles
    if (req.user.role === "admin") {
      // Admins can have specific permissions, check them if needed
      const permissions = req.user.permissions || [];
      const hasPermission = allowedRoles.some(role => permissions.includes(role));

      if (!hasPermission) {
        return res.status(403).jsend.fail({ message: "The user does not have the required permissions" });
      }
    } else if (!allowedRoles.includes(req.user.role)) {
      console.log(req.user.role);
      console.log(allowedRoles);
      return res.status(403).jsend.fail({ message: "The user does not have the required role" });
    }

    next();
  };
};
