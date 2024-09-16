const User = require("../../models/user");
const asyncHandler = require("express-async-handler");

const checkUserExists = asyncHandler(async (req, res, next) => {
  const { email, username, phoneNumber } = req.body;

  const user = await User.findOne({
    $or: [{ email }, { username }, { phoneNumber }],
  });

  if (user) {
    const existingField =
      user.email === email
        ? "email"
        : user.username === username
        ? "username"
        : "phoneNumber";

    // Respond with a JSend fail message
    return res.jsend.fail({
      message: `User with this ${existingField} already exists`,
    });
  }

  next(); // Proceed to the next middleware or route handler
});

module.exports = checkUserExists;
