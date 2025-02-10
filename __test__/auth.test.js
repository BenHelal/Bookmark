const request = require("supertest");
const app = require("../server"); // ✅ Ensure app is correctly imported
const User = require("../models/User");

describe("Auth Routes", () => {
  beforeEach(async () => {
    await User.deleteMany({});
  }, 10000); // Increased timeout

  test("POST /api/auth/signup - should register a new user", async () => {
    const userData = {
      name: "John",
      lastName: "Doe",
      email: "test@example.com",
      password: "SecurePassword123",
      phoneNumber: "+1234567890",
    };
  
    // Mock the sendConfirmationEmail function if it's used in the signup route
    jest.mock("../path/to/your/email-service", () => ({
      sendConfirmationEmail: jest.fn().mockImplementation(() => Promise.resolve()),
    }));
  
    const res = await request(app)
      .post("/api/auth/signup")
      .send(userData);
  
    // Expect the response status code to be 201 (Created)
    expect(res.statusCode).toBe(201);
  
    // Expect the response body to have the correct message
    expect(res.body).toHaveProperty("message");
    expect(res.body.message).toBe(
      "User registered successfully! Please check your email to confirm your account."
    );
  
    // Optionally, verify that the email was sent
    expect(sendConfirmationEmail).toHaveBeenCalledWith(
      "test@example.com",
      expect.stringContaining("confirm-email?token=")
    );
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
