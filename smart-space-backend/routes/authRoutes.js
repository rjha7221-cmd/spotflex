const express = require("express");
const router = express.Router();
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authController = require("../controllers/authController");

const JWT_SECRET = process.env.JWT_SECRET || "SECRET_KEY";

// OTP Routes
router.post("/send-otp", authController.sendOTP);
router.post("/verify-otp", authController.verifyOTP);

// Register Route
router.post("/register", async(req, res) => {
    try {
        const { name, email, password } = req.body;
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ success: false, message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();

        res.status(201).json({ success: true, message: "Registration successful" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
});

// Login Route
router.post("/login", async(req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ success: false, message: "Invalid email" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ success: false, message: "Invalid password" });

        const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "7d" });

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: { _id: user._id, name: user.name, email: user.email }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error" });
    }
});

module.exports = router;