const Bookmark = require("../models/Bookmark");

// Add a new bookmark
exports.addBookmark = async (req, res) => {
  const { title, url, description, tags, category, priority } = req.body;
  try {
    const bookmark = new Bookmark({
      title,
      url,
      description,
      tags,
      category,
      priority,
      user: req.user.id,
    });
    await bookmark.save();
    res.json(bookmark);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Get all bookmarks for the user
exports.getBookmarks = async (req, res) => {
  try {
    const bookmarks = await Bookmark.find({ user: req.user.id });
    res.json(bookmarks);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};