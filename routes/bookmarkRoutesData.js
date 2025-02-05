const express = require("express");
const {
  searchBookmarks,
  importBookmarks,
  exportBookmarks,
  shareBookmark,
  getSharedBookmark,
} = require("../controllers/bookmarkController");
const authMiddleware = require("../middleware/authMiddleware");
const {
  validateSearchQuery,
  validateImportBookmarks,
  validateExportFormat,
  validateSharedBookmarkId,
  handleValidationErrors,
} = require("../middleware/validationMiddleware");

const router = express.Router();


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