// validationMiddleware.js
const { body, param, query, validationResult } = require("express-validator");

// Validation for searching bookmarks
const validateSearchQuery = [
  query("query").notEmpty().withMessage("Search query is required"),
];


// Validation for creating/updating a bookmark
const validateBookmark = [
  body("title").notEmpty().withMessage("Title is required"),
  body("url").isURL().withMessage("Invalid URL"),
  body("description").optional().isString().withMessage("Description must be a string"),
  body("tags").optional().isArray().withMessage("Tags must be an array"),
  body("category").optional().isString().withMessage("Category must be a string"),
  body("priority").optional().isInt({ min: 1, max: 5 }).withMessage("Priority must be an integer between 1 and 5"),
];

// Validation for importing bookmarks
const validateImportBookmarks = [
  body("bookmarks").isArray().withMessage("Bookmarks must be an array"),
  body("bookmarks.*.title").notEmpty().withMessage("Title is required for each bookmark"),
  body("bookmarks.*.url").isURL().withMessage("Invalid URL for each bookmark"),
];

// Validation for exporting bookmarks
const validateExportFormat = [
  query("format").optional().isIn(["json", "csv"]).withMessage("Format must be either 'json' or 'csv'"),
];

// Validation for accessing a shared bookmark
const validateSharedBookmarkId = [
  param("id").isMongoId().withMessage("Invalid bookmark ID"),
];

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

module.exports = {
  validateBookmark,
  validateImportBookmarks,
  validateExportFormat,
  validateSharedBookmarkId,
  validateSearchQuery,
  handleValidationErrors,
};