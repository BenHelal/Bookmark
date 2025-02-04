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

// GET /bookmarks/:id - Get a specific bookmark
exports.getBookmarkById = async (req, res) => {
  try {
    const bookmark = await Bookmark.findOne({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!bookmark) {
      return res.status(404).json({ message: "Bookmark not found" });
    }
    res.json(bookmark);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// PUT /bookmarks/:id - Update a bookmark
exports.updateBookmark = async (req, res) => {
   const {
    title, 
    url, 
    description, 
    tags, 
    category, 
    priority
   } = req.body;

   try {
    let bookmark = await Bookmark.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!bookmark) {
      return res.status(404).json({
        message: "Bookmark not found"
      });
    }

    bookmark.title = title || bookmark.title; 
    bookmark.url = url || bookmark.url; 
    bookmark.description = description || bookmark.description;  
    bookmark.tags = tags || bookmark.tags; 
    bookmark.category = category || bookmark.category; 
    bookmark.priority = priority || bookmark.priority; 

    await bookmark.save();
    res.json(bookmark);

   } catch (err) {
    res.status(500).json({
      message: "Server error"
    });
   }
};  


// DELETE /bookmarks/:id - delete a bookmark 
exports.deleteBookmark = async (req, res) =>{
  try{
    const bookmark = await Bookmark.findOneAndDelete({
      _id: req.params.id, 
    });

    if (!bookmark) {
      return res.status(404).json({
        message: "Bookmark not found"
      });
    }

    res.json({
      message: "Bookmark delete successfully"
    });

  }catch(err){
    res.status(500).json({
      message:"Server error"
    });
  }
}


// GET /bookmarks/search?query=xyz 
// Search bookmarks by title, tags, category
exports.searchBookmarks = async (req, res) => {
  const{ query } = req.query;
  try {
    const bookmarks = await Bookmark.find({
      user: req.user.id,
      $or: [
        { title: { $regex: query, $options: "i"}},
        { tags: { $regex: query, $options: "i"}},
        { category: { $regex: query, $options: "i"}},
      ],
    });

    res.json(bookmarks);
  } catch (err) {
      res.status(500).json({message: "Server error"});
  }
};


