const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const stripe = require("../config/stripe");

// User Registration
exports.registerUser = async (req, res) => {
  let { name, email, password, id, profile} = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: "User already exists" });
    }
    
    user = new User({ name, email, password, id, profile });

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    const payload = { user: { id: user.id } };

    // Return JWT token
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// User Login
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }

    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: 360000 }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Stripe Subscription
exports.subscribeUser = async (req, res) => {
    const { name, email } = req.body;
  
    try {
      // Find the user by email
      let user = await User.findOne({ email });
      if (!user) {
        return res.status(404).json({ msg: "User not found" });
      }
  
      // Create a new customer in Stripe with name and email
      const customer = await stripe.customers.create({
        name,
        email,
      });
  
      // Create checkout session for the subscription
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price: "price_1Q8qtKKdQ3MN2A8wyQDPGRHt", // The specific price ID
            quantity: 1,
          },
        ],
        mode: "subscription",
        customer: customer.id, // Link the Stripe customer to the session
        success_url: `https://api.id.intredia.com/payment/success/${email}?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: "https://id.intredia.com/payment/cancel",
      });
  
      // Update the user's recentPaymentLink and recentSessionID
      user.recentPaymentLink = session.url;
      user.recentSessionID = session.id;
      await user.save();
  
      // Return the session ID and session URL for the frontend
      res.json({ sessionId: session.id, sessionUrl: session.url });
    } catch (err) {
      console.error(err);
      res.status(500).send("Stripe error");
    }
  };


  // Check payment status using session ID and update user's subscription status
exports.checkPayment = async (sessionId) => {
    try {
      // Retrieve the checkout session from Stripe
      const session = await stripe.checkout.sessions.retrieve(sessionId);
  
      // Check if the payment status is 'paid'
      if (session.payment_status === "paid") {
        // Find the user with the session ID
        let user = await User.findOne({ recentSessionID: sessionId });
        if (!user) {
          throw new Error("User not found");
        }
  
        // Update user's subscription status to active
        user.subscriptionStatus = "active";
        await user.save();
  
        return true; // Payment successful
      } else {
        let user = await User.findOne({ recentSessionID: sessionId });
        user.subscriptionStatus = "inactive";
        await user.save();
        return false; // Payment not successful
      }
    } catch (err) {
      console.error(err);
      return false; // Payment check failed
    }
  };
  

  exports.paymentSuccess = async (req, res) => {
    const { email } = req.params;
  
    try {
      // Check the payment status using the session ID
      let user = await User.findOne({ email });
      const paymentSuccessful = await exports.checkPayment(user.recentSessionID);
  
      if (paymentSuccessful) {
        // Find the user by email and set subscriptionStatus to active
        
        if (!user) {
          return res.status(404).json({ msg: "User not found" });
        }
  
        // Update the subscription status to active
        user.subscriptionStatus = "active";
        await user.save();
  
        // Respond with a success message
        res.status(200).json({ msg: "Subscription activated!" });
      } else {
        res.status(400).json({ msg: "Payment not completed", link: user.recentPaymentLink });
      }
    } catch (err) {
      console.error(err);
      res.status(500).send("Server error");
    }
  };
  

  