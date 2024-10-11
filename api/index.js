const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
require("dotenv").config();

// Initialize Express
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect MongoDB
connectDB();

// Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/", require("./routes/profile"));
app.use("/api/sso", require("./routes/sso"));

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
