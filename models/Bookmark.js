// models/Bookmark.js
const mongoose = require("mongoose");

const bookmarkSchema = new mongoose.Schema({
  title: { type: String, required: true },
  url: { type: String, required: true },
  description: { type: String, default: "" },
  tags: { type: [String], default: [] },
  category: { type: String, default: "Uncategorized" },
  priority: { type: Number, default: 1, min: 1, max: 5 },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  createdAt: { type: Date, default: Date.now },
});

class BookmarkClass {
  // Add custom methods or static methods here if needed
  static async findByUser(userId) {
    return this.find({ user: userId });
  }

  static async search(query, userId) {
    return this.find({
      user: userId,
      $or: [
        { title: { $regex: query, $options: "i" } },
        { tags: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
      ],
    });
  }
}

bookmarkSchema.loadClass(BookmarkClass);

module.exports = mongoose.model("Bookmark", bookmarkSchema);