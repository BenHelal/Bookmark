const express = require("express");
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const bookmarkRoutes = require("./routes/bookmarkRoutes");
const dotenv = require("dotenv");
const cors = require("cors");

dotenv.config();
connectDB();

const app = express();
app.use(express.json());
app.use(cors());

app.use("/auth", authRoutes);
app.use("/bookmarks", bookmarkRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});