const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const dbConnection = () => {
  console.log("DB_URI", process.env.DB_URI);
  mongoose
    .connect(process.env.DB_URI)
    .then(() => {
      console.log("Connected to the database");
    })
    .catch((e) => {
      console.error(e.message);
    });
};

module.exports = dbConnection;
