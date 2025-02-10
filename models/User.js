const mongoose = require("mongoose");

// Define the User schema
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true, // Ensures the name field is mandatory
      trim: true,     // Removes any leading/trailing whitespace
      minlength: 2,   // Enforces a minimum length for the name
      maxlength: 50    // Limits the maximum length of the name
    },
    lastName: {
      type: String,
      required: true, // Ensures the last name field is mandatory
      trim: true,     // Removes any leading/trailing whitespace
      minlength: 2,   // Enforces a minimum length for the last name
      maxlength: 50    // Limits the maximum length of the last name
    },
    email: {
      type: String,
      required: true, // Ensures the email field is mandatory
      unique: true,   // Ensures the email field is unique across all users
      trim: true,     // Removes any leading/trailing whitespace from the email
      lowercase: true // Converts the email to lowercase to avoid case-sensitive duplicates
    },
    password: {
      type: String,
      required: true, // Ensures the password field is mandatory
      minlength: 6    // Enforces a minimum password length (adjust as needed)
    },
    phoneNumber: {
      type: String,
      required: true, // Ensures the phone number field is mandatory
      unique: true,   // Ensures the phone number is unique across all users
      trim: true,     // Removes any leading/trailing whitespace
      validate: {
        validator: function (value) {
          return /^\+?\d{10,15}$/.test(value); // Validates phone numbers in international format
        },
        message: "Invalid phone number format"
      }
    },
    profilePhoto: {
      type: String,   // Stores the filename or URL of the uploaded photo
      default: null   // Default value is null if no photo is uploaded
    },
    isEmailVerified: {
      type: Boolean,
      default: false  // Indicates whether the user has verified their email
    },
    createdAt: {
      type: Date,
      default: Date.now // Automatically sets the creation timestamp
    }
  },
  {
    timestamps: true // Adds `createdAt` and `updatedAt` fields automatically
  }
);

// Ensure the email and phoneNumber fields are indexed and unique
UserSchema.index({ email: 1 }, { unique: true });
UserSchema.index({ phoneNumber: 1 }, { unique: true });

// Export the User model
module.exports = mongoose.model("User", UserSchema);