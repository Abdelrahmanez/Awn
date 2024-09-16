const express = require("express");
const router = express.Router();
const authentication = require("../middlewares/auth/authentication");
const authorise = require("../middlewares/auth/authorise");
const validation = require("../middlewares/validations/validationResult");
const monthlyPlanValidation = require("../middlewares/validations/monthlyPlanValidation");
const asyncHandler = require("express-async-handler");

router.get("/", asyncHandler((req, res)=>{
    res.send("hello")
}));
