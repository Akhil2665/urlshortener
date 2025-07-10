const mongoose = require("mongoose");

const urlSchema = new mongoose.Schema(
  {
    shortId: { type: String, required: true, unique: true },
    originalUrl: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    expiryDate: {
      type: Date,
      required: true,
      default: () => new Date(Date.now() + 240 * 60 * 60 * 1000),
    }, // Default to 24 hours from now
    clicks: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Url", urlSchema);
