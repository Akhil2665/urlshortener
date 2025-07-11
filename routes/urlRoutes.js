const express = require("express");

const {
  getOriginalUrl,
  redirectToOriginal,
  urlShorten,
  getAllUrls,
  deleteUrlData,
} = require("../controllers/urlController");

const router = express.Router();

router.post("/shorten", urlShorten);

router.get("/:shortId", redirectToOriginal);

router.get("/api/original/:shortId", getOriginalUrl);

router.get("/api/urls", getAllUrls);

router.delete("/api/urls/:shortId", deleteUrlData); 

module.exports = router;
