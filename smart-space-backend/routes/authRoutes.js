const express = require("express");
const router = express.Router();

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authController = require("../controllers/authcontroller");
const JWT_SECRET = process.env.JWT_SECRET || "SECRET_KEY";
const ALLOWED_ROLES = ["user", "owner"];

/* =========================
   NEW OTP ROUTES
========================= */
router.post("/send-otp", authController.sendOTP);
router.post("/verify-otp", authController.verifyOTP);
router.post("/forgot-password/send-otp", authController.sendPasswordResetOTP);
router.post("/forgot-password/reset", authController.resetPassword);

/* =========================
   REGISTER
========================= */
router.post("/register", async(req, res) => {
    try {
        const { name, email, password, role = "user" } = req.body;
        const normalizedEmail = String(email || "").trim().toLowerCase();
        const safeRole = ALLOWED_ROLES.includes(role) ? role : "user";

        const existingUser = await User.findOne({ email: normalizedEmail });

        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: "User already exists",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({
            name,
            email: normalizedEmail,
            password: hashedPassword,
            role: safeRole,
        });

        await user.save();

        res.status(201).json({
            success: true,
            message: "Registration successful",
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
});


/* =========================
   LOGIN
========================= */
router.post("/login", async(req, res) => {
    try {
        const { email, password, role } = req.body;
        const normalizedEmail = String(email || "").trim().toLowerCase();

        const user = await User.findOne({ email: normalizedEmail });

        if (!user) {
            return res.status(400).json({
                success: false,
                message: "Invalid email",
            });
        }

        if (role && user.role && user.role !== role) {
            return res.status(403).json({
                success: false,
                message: `Please login from the ${user.role} login page`,
            });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                success: false,
                message: "Invalid password",
            });
        }

        const token = jwt.sign({ id: user._id },
            JWT_SECRET, { expiresIn: "7d" }
        );

        res.status(200).json({
            success: true,
            message: "Login successful",
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role || role || "user",
            },
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Server error",
        });
    }
});

module.exports = router;
