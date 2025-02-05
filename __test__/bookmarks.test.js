const request = require("supertest");
const app = require("../server"); 
const mongoose = require("mongoose"); // Required for database connection
const Bookmark = require("../models/Bookmark");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { json } = require("express");

describe("Bookmark Routes", () => {
  let token;
  let userId;

 

  beforeAll(async () => {
    // Check if MongoDB is connected
    if (mongoose.connection.readyState === 0) {
      console.log("Connecting to MongoDB...");
      await mongoose.connect(process.env.MONGO_URI, { 
        useNewUrlParser: true, 
        useUnifiedTopology: true 
      });
    } else {
      console.log("Already connected to MongoDB.");
    }
  
    // Clean up collections
    console.log("Cleaning up collections...");
    await User.deleteMany({});
    await Bookmark.deleteMany({});
  
    // Create a test user and generate a JWT token
    console.log("Creating test user...");
    const user = new User({ email: "test@example.com", password: "password123" });
    await user.save();
    userId = user._id;
  
    token = jwt.sign({ user: { id: userId } }, process.env.JWT_SECRET, { expiresIn: "1h" });
  }, 20000); // Increased timeout to 20 seconds
  


  test("POST /bookmarks - should add a new bookmark", async () => {
    const res = await request(app)
      .post("/bookmarks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Google",
        url: "https://google.com",
        description: "Search engine",
        tags: ["search", "tech"],
        category: "Work",
        priority: 3, // Priority should be an integer
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("title", "Google");
    expect(res.body).toHaveProperty("url", "https://google.com");
  });

  test("GET /bookmarks - should fetch all bookmarks for the user", async () => {
    // Create a bookmark first
    await request(app)
      .post("/bookmarks")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "GitHub",
        url: "https://github.com",
      });

    // Fetch bookmarks
    const res = await request(app)
      .get("/bookmarks")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
  });

  test("POST /bookmarks - should return 401 for unauthorized access", async () => {
    const res = await request(app)
      .post("/bookmarks")
      .send({
        title: "Unauthorized Bookmark",
        url: "https://unauthorized.com",
      });

    expect(res.statusCode).toBe(401);
    expect(res.body).toHaveProperty("message", "No token, authorization denied");
  });

  test("GET /bookmark/search - should return bookmarks matching the query", async () => {
    // Add the "https://google.com" bookmark to the database
    await request(app)
      .post("/bookmark")
      .set("Authorization", `Bearer ${token}`)
      .send({
        title: "Google",
        url: "https://google.com",
        tags: ["search"],
        category: "Test",
      });
  
    // Now perform the search with the correct query
    const res = await request(app)
      .get("/bookmark/search?query=search")
      .set("Authorization", `Bearer ${token}`);
  
    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBeGreaterThan(0);
    expect(res.body[0]).toHaveProperty("title", "Google"); // Check for the correct title
  });
  

  test("GET /bookmark/search - should return 404 if no bookmarks match the query", async () => {
    const res = await request(app)
      .get("/bookmark/search?query=nonexistent")
      .set("Authorization", `Bearer ${token}`);

    expect(res.statusCode).toBe(404);
    expect(res.body).toHaveProperty("message", "No bookmarks found matching your search.");
  });

  test("GET /bookmark/search - should return 400 if the query does not exist", async () => {
    const res = await request(app)
      .get("/bookmark/search") // No query parameter
      .set("Authorization", `Bearer ${token}`);
  
    expect(res.statusCode).toBe(400);
    expect(res.body).toHaveProperty("errors");
    expect(Array.isArray(res.body.errors)).toBe(true);
    expect(res.body.errors[0]).toHaveProperty("msg", "Search query is required");
  });

  afterAll(async () => {
    await mongoose.connection.close(); // Close the database connection
  });
});
