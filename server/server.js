require("dotenv").config();
const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const path = require("path");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/posts", require("./routes/postRoutes"));
app.use("/api/comments", require("./routes/commentRoutes"));

// Serve static client files - handle both local and Vercel deployments
const isDev = process.env.NODE_ENV !== "production";
const clientPath = isDev 
  ? path.join(__dirname, "../client/dist")
  : path.join(__dirname, "../client/dist");
  
if (require("fs").existsSync(clientPath)) {
  app.use(express.static(clientPath));
  // SPA fallback for all non-API routes
  app.get("/*splat", (req, res) => {
    res.sendFile(path.join(clientPath, "index.html"));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
