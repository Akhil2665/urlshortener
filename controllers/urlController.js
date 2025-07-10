const Url = require("../models/urlSchema.js");

const urlShorten = async (req, res) => {
  const { originalUrl } = req.body;
  console.log("hi");

  if (!originalUrl) {
    return res.status(400).json({ error: "Original URL is required" });
  }

  try {
    const shortId = Math.random().toString(36).substring(2, 8);
    const existing = await Url.findOne({ originalUrl });
    if (existing)
      return res.json({
        shortUrl: `${process.env.BASE_URL}/${existing.shortId}`,
      });

    const newUrl = new Url({
      shortId,
      originalUrl,
    });

    await newUrl.save();
    res.status(201).json(newUrl);
  } catch (error) {
    console.error("Error creating URL:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const redirectToOriginal = async (req, res) => {
  const { shortId } = req.params;

  try {
    const url = await Url.findOne({ shortId });
    if (!url) {
      return res.status(404).json({ error: "URL not found" });
    }

    if (url.expiryDate && new Date() > url.expiryDate) {
      return res.status(410).json({ error: "URL has expired" });
    }

    url.clicks += 1;
    await url.save();

    res.redirect(url.originalUrl);
  } catch (error) {
    console.error("Error redirecting to URL:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getOriginalUrl = async (req, res) => {
  const { shortId } = req.params;

  try {
    const url = await Url.findOne({ shortId }).select(
      "originalUrl expiryDate clicks createdAt"
    );
    if (!url) {
      return res.status(404).json({ error: "URL not found" });
    }

    if (url.expiryDate && new Date() > url.expiryDate) {
      return res.status(410).json({ error: "URL has expired" });
    }

    res.status(200).json(url);
  } catch (error) {
    console.error("Error fetching original URL:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const getAllUrls = async (req, res) => {
  try {
    const urls = await Url.find().select(
      "shortId originalUrl expiryDate clicks createdAt"
    );
    res.status(200).json(urls);
  } catch (error) {
    console.error("Error fetching URLs:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const deleteUrlData = async (req, res) => {
  const { shortId } = req.params;

  try {
    const url = await Url.findOneAndDelete({ shortId });
    if (!url) {
      return res.status(404).json({ error: "URL not found" });
    }
    res.status(200).json({ message: "URL deleted successfully" });
  } catch (error) {
    console.error("Error deleting URL:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  urlShorten,
  redirectToOriginal,
  getOriginalUrl,
  getAllUrls,
  deleteUrlData,
};
