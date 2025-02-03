const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Validate that MONGO_URI is set
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in the environment variables.");
    }

    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // If you have a logger, use it instead of console.log
    // logger.info('Connected to MongoDB');
  } catch (err) {
    console.error('MongoDB connection error:', err);

    // If you have a logger, use it instead of console.error
    // logger.error('MongoDB connection error:', err);

    process.exit(1); // Exit process with failure
  }
};

// Export the function to connect to MongoDB
module.exports = connectDB;