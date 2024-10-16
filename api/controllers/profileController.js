const User = require("../models/User");

// Create or Update User Profile
exports.updateProfile = async (req, res) => {
  const { name, email, image, company, bio, experience, education, socials, id, emails, phones, customFields } = req.body;
  try {
    const user = await User.findOne({id: req.user.id});
    if (!user) return res.status(404).json({ msg: "User not found" });

    user.profile = {name, email, image, company, bio, experience, education, socials, id, emails, phones, customFields };
    

    await user.save();
    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Get User Profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findOne({id: req.params.id});
    if (!user) return res.status(404).json({ msg: "Profile not found" });
      if(user.subscriptionStatus === "inactive"){
        return res.status(503).json({ msg: "Profile not activated" });
      }else{
        res.json(user.profile);
      }
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
exports.getProfileExtire = async (req, res) => {
  try {
    const user = await User.findOne({id: req.user.id});
    if (!user) return res.status(404).json({ msg: "Profile not found" });

    res.json(user);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
