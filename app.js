const express = require("express");
const shorteningUrl = require("./routes/urlRoutes.js");
const dotenv = require("dotenv");
const cors = require("cors");

const { RateLimiterRedis } = require("rate-limiter-flexible");
const Redis = require("ioredis");
const redisClient = new Redis();

const app = express();
dotenv.config({ path: "../config/.env" });

const rateLimiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: "middleware",
  points: 100, // Number of requests
  duration: 60, // Per 60 seconds
  blockDuration: 300, // Block for 5 minutes after limit is reached
});
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(async (req, res, next) => {
  try {
    await rateLimiter.consume(req.ip); // Consume 1 point per request
    next();
  } catch (err) {
    res.status(429).send("Too many requests.");
  }
});

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
