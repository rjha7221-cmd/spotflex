const express = require("express");

const router = express.Router();

const Groq = require("groq-sdk");

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

router.post("/chat", async(req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({
                reply: "Message required",
            });
        }

        const chatCompletion =
            await groq.chat.completions.create({
                messages: [{
                        role: "system",
                        content: "You are SpotFlex AI Assistant helping users with bookings, spaces and pricing.",
                    },

                    {
                        role: "user",
                        content: message,
                    },
                ],

                model: "llama-3.3-70b-versatile",
            });

        res.json({
            reply: chatCompletion.choices[0].message
                .content,
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            reply: "AI Server Error",
        });
    }
});

module.exports = router;