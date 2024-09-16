// routes/users.js
const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const {
  registerOrganizationController,
} = require("../controllers/organization.controllers");
const checkUserExists = require("../middlewares/validations/checkUserExists");
const userValidation = require("../middlewares/validations/userValidation");
const loginValidation = require("../middlewares/validations/loginValidation");
const auth = require("../middlewares/auth/authentication");
const authentication = require("../middlewares/auth/authentication");
const authorise = require("../middlewares/auth/authorise");
const userRoles = require("../utils/userRoles");
const volnuteerValidation = require("../middlewares/validations/volnuteerValidation");
const validation = require("../middlewares/validations/validationResult");
const isMongoObjectId = require("../middlewares/validations/isMongoObjectId");

const upload = require("../middlewares/profileMulterConfig");
const {
  addProblemValidation,
  updateProblemValidation,
  problemQueriesValidation,
} = require("../middlewares/validations/ProblemValidation");

// GET / - prints hello world
router.get("/", auth, userController.sendHello);

// GET /hey - prints hey
router.post("/", userController.sendhey);

// POST /signup - Create a new user
router.post(
  "/signup",
  upload.single("profileImage"),
  userValidation.registerValidation(),
  validation,
  checkUserExists,
  userController.registerUserController
);

// login a user
router.post(
  "/login",
  loginValidation(),
  validation,
  userController.loginUserController
);

router
  // get the profile of a user
  .get(
    "/profile",
    authentication,
    authorise(userRoles.user),
    userController.getProfile
  )
  // update the profile of a user
  .patch(
    "/profile",
    authentication,
    authorise(userRoles.user),
    userValidation.patchUserValidation(),
    userController.updateUserController
  );

// get the volunteering history of a user
router.get(
  "/volunteeringHistory",
  authentication,
  authorise(userRoles.user),
  userController.getVolunteeringHistory
);

// volunteer for a problem
router.post(
  "/problem/:problemId/volunteer",
  authentication,
  authorise(userRoles.user),
  volnuteerValidation(),
  validation,
  userController.volunteerController
);

// gets specific organization by id which is not deleted and active
router.get(
  "/organizations/:organizationId",
  isMongoObjectId({ attribute: "organizationId" }),
  validation,
  userController.getOrganizationById
);

// get all the problems for a specific organization which are not deleted and not terminated
router.get(
  "/:organizationId/problems",
  isMongoObjectId({ attribute: "organizationId" }),
  validation,
  userController.getOrganizationProblems
);

// gets all organizations which are not deleted and active
router.get("/organizations", userController.getAllOrganizations);

//get all problems with a query for category, Date, location, organization , required skills
router.get(
  "/problems",
  problemQueriesValidation(),
  validation,
  userController.getProblems
);

// get problem by id which is not deleted and terminated and not completed (open or in progress)
router.get(
  "/problems/:problemId",
  isMongoObjectId({ attribute: "problemId" }),
  validation,
  userController.getProblemById
);

// get all bracnhes for a specific organization
router.get(
  "/organizations/:organizationId/branches",
  isMongoObjectId({ attribute: "organizationId" }),
  validation,
  userController.getOrganizationBranches
);

module.exports = router;
