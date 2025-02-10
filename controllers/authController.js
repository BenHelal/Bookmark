const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const fs = require("fs");
const path = require("path");
const multer = require("multer");

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname)); // Append timestamp to avoid duplicate filenames
  },
});

const upload = multer({ storage });

// Register a new user with additional fields and photo upload
exports.signup = async (req, res) => {
  const { name, lastName, email, password, phoneNumber } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    // Validate required fields
    if (!name || !lastName || !email || !password || !phoneNumber) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Handle photo upload
    let profilePhoto;
    if (req.file) {
      profilePhoto = req.file.filename; // Save the uploaded file's filename
    } else {
      profilePhoto = null; // No photo uploaded
    }

    // Create a new user instance
    user = new User({
      name,
      lastName,
      email,
      password: hashedPassword,
      phoneNumber,
      profilePhoto,
      isEmailVerified: false, // Set email verification status to false initially
    });

    // Save the user to the database
    await user.save();

    // Generate a confirmation token for email verification
    const confirmationToken = jwt.sign(
      { userId: user._id },
      process.env.EMAIL_CONFIRMATION_SECRET,
      { expiresIn: "24h" }
    );

    // Construct the email verification link
    const confirmationUrl = `${process.env.BASE_URL}/users/confirm-email?token=${confirmationToken}`;

    // Send the confirmation email (you can use a library like nodemailer or an email service)
    sendConfirmationEmail(user.email, confirmationUrl);

    // Return a success response
    res.status(201).json({
      message:
        "User registered successfully! Please check your email to confirm your account.",
    });
  } catch (err) {
    // Handle errors
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Middleware for uploading a single photo
exports.uploadProfilePhoto = upload.single("profilePhoto");

// Confirm email endpoint
exports.confirmEmail = async (req, res) => {
  const { token } = req.query;

  try {
    // Verify the token
    const decoded = jwt.verify(token, process.env.EMAIL_CONFIRMATION_SECRET);

    // Find the user by ID
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    // Update the user's email verification status
    user.isEmailVerified = true;
    await user.save();

    res.json({ message: "Email confirmed successfully!" });
  } catch (err) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
};

// Login user
exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1h" }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};