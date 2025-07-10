require("./db");
const app = require("./app.js");
const dotenv = require("dotenv");

dotenv.config({ path: "./config/.env" });

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

app.get("/", (req, res) => {
  res.json({
    message: "Url shortner Backend is running!",
    status: "success",
    timestamp: new Date().toISOString(),
  });
});

// app.post("/shorten", urlShorten);

// app.get("/:shortId", redirectToOriginal);

// app.get("/api/original/:shortId", getOriginalUrl);

// app.get("/api/urls", getAllUrls);

// // Route to delete a URL by shortId
// app.delete("/api/urls/:shortId", deleteUrlData);
