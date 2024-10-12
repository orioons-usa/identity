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
    image: { type: String },
    name: { type: String },
    email: { type: String },
    emails: [{ type: String }],
    phones: [{ type: String }],
    company: { type: String },
    id:{ type: String },
    bio: String,
    socials: [{ type: String }],
    experience: [{ company: String, role: String, duration: String }],
    education: [{ institution: String, degree: String, year: String }],
    customFields: [{ fieldName: String, value: String }],
  },
  integ: [{ appName: String, appID: String}]
});

module.exports = mongoose.model("User", UserSchema);
