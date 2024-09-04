const User = require("../models/user");

const checkUserExists = async (req, res, next) => {
  const { email, username, phoneNumber } = req.body;

  try {
    // Check for existing user by email, username, or phone number
    const user = await User.findOne({
      $or: [{ email }, { username }, { phoneNumber }],
    });

    if (user) {
      // Respond with an appropriate message if user already exists
      if (user.email === email) {
        return res.status(400).json({ message: "Email already exists" });
      }
      if (user.username === username) {
        return res.status(400).json({ message: "Username already exists" });
      }
      if (user.phoneNumber === phoneNumber) {
        return res.status(400).json({ message: "Phone number already exists" });
      }
    }

    // If user does not exist, continue to the next middleware/controller
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = checkUserExists;
