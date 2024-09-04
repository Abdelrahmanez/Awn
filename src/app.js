const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
dotenv.config({
  path: "./config.env",
});
// calls the database connection
const dbConnection = require("./config/database");
// starts the database connection
dbConnection();

// express app
const app = express();

// routes
const userRoutes = require("./routes/userRoutes");

// middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mounting the routes
app.use("/", userRoutes);

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log("mode : ", process.env.NODE_ENV);
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
