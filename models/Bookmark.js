const mongoose = require("mongoose");

const BookmarkSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  description: { type: String },
  tags: [{ type: String }],
  category: { type: String },
  priority: { type: String, enum: ["High", "Medium", "Low"] },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Bookmark", BookmarkSchema);