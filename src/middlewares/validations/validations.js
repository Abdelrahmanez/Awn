const User = require("../../models/user");
const bcrypt = require("bcryptjs");
const Organization = require("../../models/organization");

const passwordValidation = ({ password, passwordConfirmation }) => {
  if (password.length < 8) {
    return { message: "Password is too short , the minimun length is 8" };
  }

  if (password !== passwordConfirmation && passwordConfirmation !== undefined) {
    return { message: "Passwords do not match" };
  }

  return;
};

const emailValidation = ({ emailOrUsername }) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(emailOrUsername) ? true : false;
};

// const checkLoginData = ({emailOrUsername , password}) => {
//   passwordValidation
// }

const phoneNumberValidation = ({ phoneNumber }) => {
  const phoneRegex = /^(01)[0-2,5]{1}[0-9]{8}$/;

  if (!phoneRegex.test(phoneNumber)) {
    return { message: "Invalid phone number" };
  }
};

const usernameValidation = ({ username }) => {
  if (username.length < 3) {
    return { message: "Username is too short" };
  }
  const usernameRegex = /^(?=(.*[a-zA-Z]){3,})[a-zA-Z0-9_]+[_]?$/;

  const isValid = usernameRegex.test(username);
  if (!isValid) {
    return { message: "the username can only contain letters and underscores" };
  }
};

const nameValidation = ({ name }) => {
  if (name.length < 3) {
    return { message: "Name is too short" };
  }
  const nameRegex = /^[a-zA-Z ]+$/;
  const isValid = nameRegex.test(name);
  if (!isValid) {
    return { message: "the name can only contain letters and underscores" };
  }
};

const registerValidation = async ({
  registerType,
  username,
  phoneNumber,
  email,
  name,
  password,
  passwordConfirmation,
}) => {
  const userType = registerType === "user" ? User : Organization;
  const user = await userType.findOne({
    $or: [{ username }, { phoneNumber }, { email }],
  });

  if (user) {
    if (user.username === username) {
      return { message: "Username already exists" };
    }
    if (user.phoneNumber === phoneNumber) {
      return { message: "Phone number already exists" };
    }
    if (user.email === email) {
      return { message: "Email already exists" };
    }
  }

  if (username != undefined) {
    const usernameValid = usernameValidation({ username });
    if (usernameValid) {
      return usernameValid;
    }
  }

  if (phoneNumber != undefined) {
    const phoneNumberValid = phoneNumberValidation({ phoneNumber });
    if (phoneNumberValid) {
      return phoneNumberValid;
    }
  }

  if (email != undefined) {
    const emailValid = emailValidation({ emailOrUsername: email });
    if (!emailValid) {
      return { message: emailValid };
    }
  }

  if (name != undefined) {
    const nameValid = nameValidation({ name });
    if (nameValid) {
      return nameValid;
    }
  }

  const passwordValid = passwordValidation({ password, passwordConfirmation });
  if (passwordValid) {
    return passwordValid;
  }
};

const decodeToken = (token) => {
  try {
    return jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
  } catch (error) {
    return { error: error.message };
  }
};

const authenticate = async (req, res) => {
  try {
    const user = await User.findOne({ email }).select("passwordHash");

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const isValid = await bcrypt.compare(password, user.passwordHash);

    if (!isValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    console.log("user authenticated");
    console.log(user);

    return user;
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const userExists = async ({ email, username, phoneNumber }) => {
  // Check if the email exists
  const userEmail = await User.findOne({ email });
  if (userEmail) return "Email already exists";

  // Check if the username exists

  const user = await User.findOne({
    username,
  });
  if (user) return "Username already exists";

  // Check if the phone number exists
  const userPhoneNumber = await User.findOne({ phoneNumber });
  if (userPhoneNumber) return "Phone number already exists";

  return false;
};

const isActiveOrganization = async (req, res, next) => {
  const organization = await Organization.findOne({ _id: req.user._id });

  if (!organization) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  if (!organization.isActive) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  next();
};

module.exports = {
  passwordValidation,
  emailValidation,
  phoneNumberValidation,
  nameValidation,
  usernameValidation,
  authenticate,
  userExists,
  registerValidation,
};
