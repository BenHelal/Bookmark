const request = require("supertest");
const app = require("../server"); // ✅ Ensure app is correctly imported
const User = require("../models/User");

describe("Auth Routes", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  }, 10000); // Increased timeout

  test("POST /api/auth/signup - should register a new user", async () => {
    const res = await request(app)
      .post("/api/auth/signup")
      .send({ email: "test@example.com", password: "password123" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  test("POST /api/auth/login - should authenticate a user", async () => {
    await request(app)
      .post("/api/auth/signup")
      .send({ email: "test@example.com", password: "password123" });

    const res = await request(app)
      .post("/api/auth/login")
      .send({ email: "test@example.com", password: "password123" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  afterAll(async () => {
    await User.deleteMany({});
  });
});
