const jwt = require("jsonwebtoken");
const User = require("../models/User");

// SSO Login
exports.ssoLogin = async (req, res) => {
  const { appId, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) return res.status(404).json({ msg: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    // Create SSO Token
    const ssoPayload = {
      id: user.id,
      email: user.email,
      profile: user.profile,
    };

    const ssoToken = jwt.sign(ssoPayload, process.env.SSO_SECRET, { expiresIn: "1h" });

    res.json({ ssoToken });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
