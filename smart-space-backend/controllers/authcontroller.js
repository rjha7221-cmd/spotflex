const nodemailer = require('nodemailer');
const User = require('../models/User');

let otpStore = {};

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'rjha7221@gmail.com',
        pass: 'dnzw kkmu yjqf xlxg'
    }
});

exports.sendOTP = async(req, res) => {
    try {
        const { identifier } = req.body;
        const otp = Math.floor(100000 + Math.random() * 900000).toString();

        otpStore[identifier] = otp;

        await transporter.sendMail({
            from: 'SpotFlex <noreply@spotflex.com>',
            to: identifier,
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
        const { identifier, otp } = req.body;

        if (otpStore[identifier] && otpStore[identifier] === otp) {
            delete otpStore[identifier];
            const user = await User.findOne({ email: identifier });

            res.status(200).json({
                success: true,
                message: "Login Successful",
                user: {
                    _id: user ? user._id : null,
                    name: (user && user.name) ? user.name : "User",
                    email: identifier
                }
            });
        } else {
            res.status(400).json({ success: false, message: "Invalid OTP" });
        }
    } catch (err) {
        res.status(500).json({ success: false, message: "Server error" });
    }
};