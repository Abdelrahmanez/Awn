const authorise = (req, res, allowedto, next) => {
  const { role } = req.user;
  if (role !== allowedto) {
    return res.status(403).json({
      status: "error",
      error: "You are not allowed to access this resource",
    });
  }
  next();
};

module.exports = authorise;
