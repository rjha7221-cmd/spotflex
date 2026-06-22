const nodemailer = require('nodemailer');
const User = require('../models/User');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

let otpStore = {};
const JWT_SECRET = process.env.JWT_SECRET || "SECRET_KEY";
const OTP_EXPIRY_MS = 5 * 60 * 1000;
const LOGIN_PURPOSE = "login";
const PASSWORD_RESET_PURPOSE = "password-reset";

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'rjha7221@gmail.com',
        pass: 'dnzw kkmu yjqf xlxg'
    }
});

const getOtpKey = (purpose, email) => `${purpose}:${email}`;

const findAccount = async(identifier, role) => {
    const email = String(identifier || "").trim().toLowerCase();
    const user = await User.findOne({ email });

    if (!user) {
        return { error: { status: 404, message: "Email is not registered" } };
    }

    if (role && user.role && user.role !== role) {
        return {
            error: {
                status: 403,
                message: `Please continue from the ${user.role} account page`
            }
        };
    }

    return { email, user };
};

const createOTP = (purpose, email, role) => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    otpStore[getOtpKey(purpose, email)] = {
        otp,
        role,
        expiresAt: Date.now() + OTP_EXPIRY_MS
    };

    return otp;
};

const readOTP = (purpose, email) => otpStore[getOtpKey(purpose, email)];
const clearOTP = (purpose, email) => delete otpStore[getOtpKey(purpose, email)];

exports.sendOTP = async(req, res) => {
    try {
        const { identifier, role } = req.body;
        const { email, user, error } = await findAccount(identifier, role);

        if (error) {
            return res.status(error.status).json({ success: false, message: error.message });
        }

        const otp = createOTP(LOGIN_PURPOSE, email, user.role || role || "user");

        await transporter.sendMail({
            from: 'SpotFlex <noreply@spotflex.com>',
            to: email,
            subject: 'SpotFlex Login OTP',
            text: `Your OTP is ${otp}. It expires in 5 minutes.`
        });

        res.status(200).json({ success: true, message: "OTP sent successfully" });
    } catch (err) {
        console.error("Mail Error:", err);
        res.status(500).json({ success: false, message: "Failed to send OTP" });
    }
};

exports.verifyOTP = async(req, res) => {
    try {
        const { identifier, otp, role } = req.body;
        const email = String(identifier || "").trim().toLowerCase();
        const savedOtp = readOTP(LOGIN_PURPOSE, email);

        if (!savedOtp || savedOtp.otp !== otp) {
            return res.status(400).json({ success: false, message: "Invalid OTP" });
        }

        if (Date.now() > savedOtp.expiresAt) {
            clearOTP(LOGIN_PURPOSE, email);
            return res.status(400).json({ success: false, message: "OTP expired" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            clearOTP(LOGIN_PURPOSE, email);
            return res.status(404).json({ success: false, message: "Email is not registered" });
        }

        if (role && user.role && user.role !== role) {
            return res.status(403).json({
                success: false,
                message: `Please login from the ${user.role} login page`
            });
        }

        clearOTP(LOGIN_PURPOSE, email);

        const token = jwt.sign({ id: user._id },
            JWT_SECRET, { expiresIn: "7d" }
        );

        res.status(200).json({
            success: true,
            message: "Login Successful",
            token,
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role || savedOtp.role || role || "user"
            }
        });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};

exports.sendPasswordResetOTP = async(req, res) => {
    try {
        const { identifier, role } = req.body;
        const { email, user, error } = await findAccount(identifier, role);

        if (error) {
            return res.status(error.status).json({ success: false, message: error.message });
        }

        const otp = createOTP(PASSWORD_RESET_PURPOSE, email, user.role || role || "user");

        await transporter.sendMail({
            from: 'SpotFlex <noreply@spotflex.com>',
            to: email,
            subject: 'SpotFlex Password Reset OTP',
            text: `Your password reset OTP is ${otp}. It expires in 5 minutes.`
        });

        res.status(200).json({ success: true, message: "Password reset OTP sent successfully" });
    } catch (err) {
        console.error("Password Reset Mail Error:", err);
        res.status(500).json({ success: false, message: "Failed to send password reset OTP" });
    }
};

exports.resetPassword = async(req, res) => {
    try {
        const { identifier, otp, newPassword, role } = req.body;
        const email = String(identifier || "").trim().toLowerCase();
        const savedOtp = readOTP(PASSWORD_RESET_PURPOSE, email);

        if (!newPassword || String(newPassword).length < 6) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 6 characters"
            });
        }

        if (!savedOtp || savedOtp.otp !== otp) {
            return res.status(400).json({ success: false, message: "Invalid reset OTP" });
        }

        if (Date.now() > savedOtp.expiresAt) {
            clearOTP(PASSWORD_RESET_PURPOSE, email);
            return res.status(400).json({ success: false, message: "Reset OTP expired" });
        }

        const user = await User.findOne({ email });

        if (!user) {
            clearOTP(PASSWORD_RESET_PURPOSE, email);
            return res.status(404).json({ success: false, message: "Email is not registered" });
        }

        if (role && user.role && user.role !== role) {
            return res.status(403).json({
                success: false,
                message: `Please continue from the ${user.role} account page`
            });
        }

        user.password = await bcrypt.hash(newPassword, 10);
        await user.save();
        clearOTP(PASSWORD_RESET_PURPOSE, email);

        res.status(200).json({ success: true, message: "Password updated successfully" });
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};
