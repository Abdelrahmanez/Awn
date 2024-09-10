const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
const jsend = require("jsend");
dotenv.config({
  path: "./config.env",
});
const superAdminRoutes = require("./routes/superAdmin");
// calls the database connection
const dbConnection = require("./config/database");
// starts the database connection
dbConnection();

// express app
const app = express();

// routes
const userRoutes = require("./routes/userRoutes");
const organizationRoutes = require("./routes/organizationRoutes");

// middleware

// Add JSend middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(jsend.middleware);

// Mounting the routes
app.use("/api/v1/user", userRoutes);
app.use("/api/v1/organization", organizationRoutes);
// app.use("/api/v1/superAdmin", superAdminRoutes);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log("mode : ", process.env.NODE_ENV);
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
