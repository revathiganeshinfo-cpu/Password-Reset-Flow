const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const connectDB = require("./config/db");

dotenv.config();

const app = express();
 
app.use(cors({
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
}));

 app.use(express.json());
app.use(express.urlencoded({ extended: true }));

 
connectDB();

 
app.get("/", (req, res) => {
  res.json({ message: "✅ Password Reset API is running!" });
});

 app.use("/api/auth", require("./routes/auth"));

 app.use((req, res) => {
  res.status(404).json({ message: "Route not found." });
});

 app.use((err, req, res, next) => {
  console.error("Unhandled Error:", err.stack);
  res.status(500).json({ message: "Something went wrong on the server." });
});
 
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});