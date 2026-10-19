const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    image: { type: String, required: true },
    category: { type: String, default: "Travel Guide" }, // e.g., "Itinerary", "Culture", "Boat Tours"
    readTime: { type: String, default: "5 min read" },
    excerpt: { type: String, required: true },
    content: { type: String, required: true }, // HTML or formatted string for the full article
    author: { type: String, default: "The Kashi Kunj Team" },
    order: { type: Number, default: 0 },
  },
  { timestamps: true },
);

module.exports = mongoose.model("Blog", blogSchema);
