const express = require("express");
const {
  addBookmark,
  getBookmarks,
  getBookmarkById,
  updateBookmark,
  deleteBookmark,
  searchBookmarks,
  importBookmarks,
  exportBookmarks,
  shareBookmark,
  getSharedBookmark
} = require("../controllers/bookmarkController");
const authMiddleware = require("../middleware/authMiddleware");

const router = express.Router();

// Create a new bookmark
router.post("/", authMiddleware, addBookmark);

// Get all bookmarks for the authenticated user
router.get("/", authMiddleware, getBookmarks);

// Get a specific bookmark by ID
router.get("/:id", authMiddleware, getBookmarkById);

// Update a bookmark by ID
router.put("/:id", authMiddleware, updateBookmark);

// Delete a bookmark by ID
router.delete("/:id", authMiddleware, deleteBookmark);

// Search bookmarks by query (title, tags, category)
router.get("/search", authMiddleware, searchBookmarks);

// Import bookmarks from a file
router.post("/import", authMiddleware, importBookmarks);

// Export bookmarks as JSON or CSV
router.get("/export", authMiddleware, exportBookmarks);

// Generate a public shareable link for a bookmark
router.post("/share/:id", authMiddleware, shareBookmark);

// Access a shared bookmark
router.get("/shared/:id", getSharedBookmark);

module.exports = router;
