const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config({ path: "./config/.env" });
const MONGO_DB_CLOUD_URI = process.env.MONGO_DB_CLOUD_URI;
const DB_NAME = process.env.DB_NAME;
if (!DB_NAME) {
  throw new Error("Environment variable DB_NAME is not defined.");
} else if (!MONGO_DB_CLOUD_URI) {
  throw new Error("MONGO_DB_CLOUD_URI environment variable is not defined.");
}

mongoose
  .connect(`${MONGO_DB_CLOUD_URI.replace(/\/?$/, "/")}${DB_NAME}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("Error connecting to MongoDB:", err);
  });

module.exports = mongoose;
