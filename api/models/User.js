const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  company: { type: String },
  id:{ type: String },
  subscriptionStatus: { type: String, default: "inactive" },
  recentPaymentLink: { type: String},
  recentSessionID: { type: String},
  profile: {
    name: { type: String },
    email: { type: String },
    company: { type: String },
    id:{ type: String },
    bio: String,
    skills: [String],
    experience: [{ company: String, role: String, duration: String }],
    education: [{ institution: String, degree: String, year: String }],
    projects: [{ name: String, description: String }],
    awards: [{ title: String, year: String }],
    customFields: [{ fieldName: String, value: String }],
  },
});

module.exports = mongoose.model("User", UserSchema);
