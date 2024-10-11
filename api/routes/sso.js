const express = require("express");
const router = express.Router();
const { ssoLogin } = require("../controllers/ssoController");

router.post("/login", ssoLogin);

module.exports = router;
