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
  getSharedBookmark,
} = require("../controllers/bookmarkController");
const authMiddleware = require("../middleware/authMiddleware");
const {
  validateBookmark,
  validateSearchQuery,
  validateImportBookmarks,
  validateExportFormat,
  validateSharedBookmarkId,
  handleValidationErrors,
} = require("../middleware/validationMiddleware");

const router = express.Router();

// Create a new bookmark
router.post("/", authMiddleware, validateBookmark, handleValidationErrors, addBookmark);

// Get all bookmarks for the authenticated user
router.get("/", authMiddleware, getBookmarks);

// Get a specific bookmark by ID
router.get("/:id", authMiddleware, validateSharedBookmarkId, handleValidationErrors, getBookmarkById);

// Update a bookmark by ID
router.put("/:id", authMiddleware, validateBookmark, handleValidationErrors, updateBookmark);

// Delete a bookmark by ID
router.delete("/:id", authMiddleware, validateSharedBookmarkId, handleValidationErrors, deleteBookmark);

// Search bookmarks by query (title, tags, category)
router.get("/search", authMiddleware, validateSearchQuery, handleValidationErrors, searchBookmarks);

// Import bookmarks from a file
router.post("/import", authMiddleware, validateImportBookmarks, handleValidationErrors, importBookmarks);

// Export bookmarks as JSON or CSV
router.get("/export", authMiddleware, validateExportFormat, handleValidationErrors, exportBookmarks);

// Generate a public shareable link for a bookmark
router.post("/share/:id", authMiddleware, validateSharedBookmarkId, handleValidationErrors, shareBookmark);

// Access a shared bookmark
router.get("/shared/:id", validateSharedBookmarkId, handleValidationErrors, getSharedBookmark);

module.exports = router;