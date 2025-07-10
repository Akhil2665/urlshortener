const express = require("express");
const shorteningUrl = require("./routes/urlRoutes.js");
const cors = require("cors");
const app = express();
const rateLimit = require("express-rate-limit");

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
    origin: "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: true }));

app.use("", shorteningUrl);

module.exports = app;
