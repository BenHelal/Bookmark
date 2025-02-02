const request = require("supertest");
const app = require("../server");
const Bookmark = require("../models/Bookmark");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

describe("Bookmark Routes", () => {
  let token;

  beforeEach(async () => {
    await User.deleteMany({});
    await Bookmark.deleteMany({});

    // Create a user and generate a token
    const user = new User({ email: "test@example.com", password: "password123" });
    await user.save();

    token = jwt.sign({ user: { id: user._id } }, process.env.JWT_SECRET);
  });

  test("POST /bookmarks - should add a new bookmark", async () => {
    const res = await request(app)
      .post("/bookmarks")
      .set("x-auth-token", token)
      .send({
        title: "Google",
        url: "https://google.com",
        description: "Search engine",
        tags: ["search", "tech"],
        category: "Work",
        priority: "High",
      });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("title", "Google");
  });

  test("GET /bookmarks - should fetch all bookmarks for the user", async () => {
    await request(app)
      .post("/bookmarks")
      .set("x-auth-token", token)
      .send({
        title: "Google",
        url: "https://google.com",
      });

    const res = await request(app)
      .get("/bookmarks")
      .set("x-auth-token", token);

    expect(res.statusCode).toBe(200);
    expect(res.body.length).toBe(1);
  });
});