const express = require("express");
const router = express.Router();
const { updateProfile, getProfile } = require("../controllers/profileController");
const auth = require("../middlewares/authMiddleware");

router.post("/update", auth, updateProfile);
router.get("/:id", getProfile);

module.exports = router;
