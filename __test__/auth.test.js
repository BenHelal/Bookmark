const request = require("supertest");
const app = require("../server");
const User = require("../models/User");

describe("Auth Routes", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  test("POST /auth/signup - should register a new user", async () => {
    const res = await request(app)
      .post("/auth/signup")
      .send({ email: "test@example.com", password: "password123" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });

  test("POST /auth/login - should authenticate a user", async () => {
    await request(app)
      .post("/auth/signup")
      .send({ email: "test@example.com", password: "password123" });

    const res = await request(app)
      .post("/auth/login")
      .send({ email: "test@example.com", password: "password123" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });
});