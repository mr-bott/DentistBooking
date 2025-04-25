const express = require("express");

const dotenv = require("dotenv");

const nodemailer = require("nodemailer");
const crypto = require("crypto");
const transporter = require("../config/mailer"); 
require("dotenv").config();

const router = express.Router();

let otpStore = {}; // In-memory store for OTPs

// Route to send OTP
router.post("/send_otp", async (req, res) => {
  const { gmail } = req.body;
  // Generate a 4-digit OTP
  const otp = crypto.randomInt(1000, 9999);
  // Store OTP with an expiration time (5 minutes)
  otpStore[gmail] = { otp, expiresAt: Date.now() + 5 * 60 * 1000 };
  // Email message options
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: gmail,
    subject: "Your OTP for Email Verification at AGRO FX ",
    text: `Your OTP is ${otp}. It will expire in 5 minutes.`,
  };

  try {
    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: "OTP sent to email" });
  } catch (err) {
    console.error("Error sending OTP:", err.message);
    res.status(500).json({ error: "Failed to send OTP" });
  }
});

// Route to verify OTP
router.post("/verify_otp", (req, res) => {
  const { gmail, otp } = req.body;

  const storedOtpInfo = otpStore[gmail];

  if (!storedOtpInfo) {
    return res.status(400).json({ error: "OTP not found or expired" });
  }

  if (
    storedOtpInfo.otp === parseInt(otp) &&
    Date.now() < storedOtpInfo.expiresAt
  ) {
    delete otpStore[gmail]; // OTP is valid, remove from store
    res.status(200).json({ message: "OTP verified successfully" });
  } else {
    res.status(400).json({ error: "Invalid or expired OTP" });
  }
});
router.post("/send-confirmation-email", async (req, res) => {
  const { userId, orderDetails } = req.body;

  try {
    // Fetch user's name and email from MongoDB
    const user = await User.findById(userId).select("name email");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { name, email } = user;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const productsList = orderDetails.products
      .map(
        (item) => `<li>${item.name} - ${item.quantity} x ₹${item.price}</li>`
      )
      .join("");

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Order Confirmation",
      html: `
        <h3>Hello ${name},</h3>
        <p>Thank you for your order! Here's what you purchased:</p>
        <ul>${productsList}</ul>
        <p><strong>Total Amount:</strong> ₹${orderDetails.totalAmount}</p>
        <p>We’ll notify you once it’s shipped.</p>
        <p>Best regards,<br/>Ecommerce Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: "Email sent successfully" });
  } catch (error) {
    console.error("Email send error:", error);
    res.status(500).json({ message: "Failed to send email" });
  }
});

module.exports = router;
