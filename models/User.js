const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

// Use the correct variable name (UserSchema instead of userSchema)
UserSchema.index({ email: 1 }, { unique: true });

module.exports = mongoose.model("User", UserSchema);
