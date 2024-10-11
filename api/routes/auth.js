const express = require("express");
const router = express.Router();
const { registerUser, loginUser, subscribeUser, checkPayment, paymentSuccess } = require("../controllers/authController");
const auth = require("../middlewares/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/subscribe", auth, subscribeUser);
router.post("/payment/success/:email", paymentSuccess);

module.exports = router;
