const mongoose = require('mongoose');
const routes = require('./routes');

const authRoutes = require("./routes/authRoutes");
const bookmarkRoutes = require("./routes/bookmarkRoutes");
const bookmarkRoutesData = require("./routes/bookmarkRoutesData");

const app = express();

// Middleware
app.use(express.json());


app.use("/auth", authRoutes);
app.use("/bookmarks", bookmarkRoutes);
app.use("/bookmark", bookmarkRoutesData);


// Connect to MongoDB
connectDB();