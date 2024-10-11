const mongoose = require("mongoose");

const CompanySchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: String,
  contact: { email: String, phone: String },
  profile: {
    bio: String,
    services: [String],
    projects: [{ name: String, description: String }],
  },
});

module.exports = mongoose.model("Company", CompanySchema);
