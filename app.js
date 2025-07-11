const express = require("express");
const shorteningUrl = require("./routes/urlRoutes.js");
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();
const rateLimit = require("express-rate-limit");

dotenv.config({ path: "../config/.env" });

const limiter = rateLimit({
  windowMs: 30 * 60 * 1000,
  max: 100,
  message: "Too many requests from this IP, please try again after 15 minutes",
});

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(limiter);

app.use(
  cors({
    origin: process.env.FRONTEND_DEPLOYED_URL || process.env.FRONTEND_LOCAL_URL,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));

app.use("", shorteningUrl);

module.exports = app;
