const Joi = require("joi");

// Define the validation schema using Joi
const registerValidationSchema = Joi.object({
  name: Joi.string().min(3).required(),
  username: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  phoneNumber: Joi.string().pattern(/^(01)[0-2,5]{1}[0-9]{8}$/).required(),
  password: Joi.string().min(8).required(),
  passwordConfirmation: Joi.any().valid(Joi.ref("password")).required().messages({
    "any.only": "Passwords do not match",
  }),
});

// Middleware to validate registration data
const validateRegister = (req, res, next) => {
  const { error } = registerValidationSchema.validate(req.body);
  if (error) {
    return res.status(400).json({ message: error.details[0].message });
  }
  next();
};

module.exports = validateRegister;
