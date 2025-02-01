const express = require("express");
const { addBookmark, getBookmarks } = require("../controllers/bookmarkController");
const authMiddleware = require("../middleware/authMiddleware");
const router = express.Router();

router.post("/", authMiddleware, addBookmark);
router.get("/", authMiddleware, getBookmarks);

module.exports = router;