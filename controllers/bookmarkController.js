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
// Search bookmarks by title, tags, or category
exports.searchBookmarks = async (req, res) => {
  const { query } = req.query;

  try {
    const bookmarks = await Bookmark.find({
      user: req.user.id,
      $or: [
        { title: { $regex: query, $options: "i" } },
        { tags: { $regex: query, $options: "i" } },
        { category: { $regex: query, $options: "i" } },
      ],
    });

    if (bookmarks.length === 0) {
      return res.status(404).json({ message: "No bookmarks found matching your search." });
    }

    res.json(bookmarks);
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// POST /bookmarks/import 
// Import bookmarks from a browser export
exports.importBookmarks = async (req, res) => {
  // Assume bookmarks is an array of bookmark objects
  const {bookmarks} = res.body;

  try {
    const importBookmarks = await Bookmark.insertMany(
      bookmarks.map((bookmark) => ({
        ...bookmark,
        user: req.user.id,
      }))
    );

    res.json(importedBookmars);

  } catch (err) {
    res.status(500).json({message: "Server error"});
  }
};

// GET /bookmarks/export
// Export bookmarks as JSON or CSV
exports.exportBookmarks = async (req, res) => {
  // 'json' or 'csv'
  const { format } = req.query;
  try {
    const bookmark = await Bookmark.find({
      user: req.user.id
    });
    
    if (format === "csv") {
      //convert bookmarks to CSV format
      const csv = bookmarks.map((bookmark)=>
        ` ${bookmark.title},
          ${bookmark.url},
          ${bookmark.description},
          ${bookmark.tags.join(";")},
          ${bookmark.category},
          ${bookmark.priority}`
      ).join("\n"); res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=bookmarks.csv");
      
      return res.send(csv);
    }else if(format === "json"){
      // Default to JSON
      res.setHeader("Content-Type", "application/json");
      res.setHeader("Content-Disposition", "attachment; filename=bookmarks.json");
      return res.send(JSON.stringify(bookmarks, null, 2));
    }else{
      return res.status(404).json({
        message: "Format not available"
      });
    }
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
}


// POST /bookmarks/share/:id - Generate a public shareable link
exports.shareBookmark = async (req, res) => {
  try {
    const bookmark = await Bookmark.findOne({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!bookmark) {
      return res.status(404).json({ message: "Bookmark not found" });
    }

    // Generate a unique shareable link (e.g., using a UUID or hash)
    const shareableLink = `https://yourdomain.com/bookmarks/shared/${bookmark._id}`;
    res.json({ shareableLink });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};


// GET /bookmarks/shared/:id - Access a shared bookmark
exports.getSharedBookmark = async (req, res) => {
  try {
    const bookmark = await Bookmark.findById(req.params.id);
    if (!bookmark) {
      return res.status(404).json({ message: "Bookmark not found" });
    }
    res.json(bookmark);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};