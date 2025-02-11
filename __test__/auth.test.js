const mongoose = require("mongoose");
const request = require("supertest");
const app = require("../server"); // Adjust the path to your Express app
const User = require("../models/User"); // Adjust the path to your User model
const bcrypt = require("bcrypt");

// Mock the email service directly in the test
const sendConfirmationEmail = jest.fn().mockImplementation(() => Promise.resolve());

describe("Auth Routes", () => {
  beforeAll(async () => {
    // Connect to the database (use an in-memory database for testing if possible)
    await mongoose.connect(process.env.MONGO_URI_TEST, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    // Disconnect from the database
    await mongoose.connection.close();
  });

  afterEach(async () => {
    // Clean up the database after each test
    await User.deleteMany({});
  });

  describe("POST /api/auth/signup", () => {
    test("should register a new user", async () => {
      const userData = {
        name: "John",
        lastName: "Doe",
        email: "test@example.com",
        password: "SecurePassword123",
        phoneNumber: "+1234567890",
      };

      const res = await request(app)
        .post("/api/auth/signup")
        .send(userData);

      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toBe(
        "User registered successfully! Please check your email to confirm your account."
      );

      // Verify the user was saved in the database
      const user = await User.findOne({ email: userData.email });
      expect(user).not.toBeNull();
      expect(user.name).toBe(userData.name);
      expect(user.lastName).toBe(userData.lastName);
      expect(user.phoneNumber).toBe(userData.phoneNumber);
      expect(user.isEmailVerified).toBe(false);

      // Verify the password was hashed
      const isMatch = await bcrypt.compare(userData.password, user.password);
      expect(isMatch).toBe(true);
    });

    test("should return 400 if required fields are missing", async () => {
      const res = await request(app)
        .post("/api/auth/signup")
        .send({
          email: "test@example.com",
          password: "SecurePassword123",
        });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toContain("All fields are required");
    });

    test("should return 400 if email already exists", async () => {
      const existingUser = {
        name: "John",
        lastName: "Doe",
        email: "test@example.com",
        password: "SecurePassword123",
        phoneNumber: "+1234567890",
      };

      await User.create(existingUser);

      const res = await request(app)
        .post("/api/auth/signup")
        .send(existingUser);

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toBe("User already exists");
    });
  });

  describe("POST /api/auth/login", () => {
    beforeEach(async () => {
      // Create a test user with a hashed password
      const hashedPassword = await bcrypt.hash("SecurePassword123", 10);
      await User.create({
        name: "John",
        lastName: "Doe",
        email: "test@example.com",
        password: hashedPassword,
        phoneNumber: "+1234567890",
        isEmailVerified: true, // Ensure email is verified
      });
    });

    test("should authenticate a user", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "test@example.com", password: "SecurePassword123" });

      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty("token");
    });

    test("should return 400 for invalid credentials", async () => {
      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "test@example.com", password: "WrongPassword" });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toBe("Invalid credentials");
    });

    test("should return 400 if email is not verified", async () => {
      // Create a user whose email is not verified
      const hashedPassword = await bcrypt.hash("SecurePassword123", 10);
      await User.create({
        name: "Jane",
        lastName: "Doe",
        email: "jane@example.com",
        password: hashedPassword,
        phoneNumber: "+1987654321",
        isEmailVerified: false,
      });

      const res = await request(app)
        .post("/api/auth/login")
        .send({ email: "jane@example.com", password: "SecurePassword123" });

      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty("message");
      expect(res.body.message).toBe("Please verify your email before logging in");
    });
  });
});