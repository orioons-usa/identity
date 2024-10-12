const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");
require("dotenv").config();

// Initialize Express
const app = express();

// Middleware

var whitelist = ['https://id.intredia.com', 'https://api.id.intredia.com']
var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  }
}
 
app.use(cors(corsOptions));
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
