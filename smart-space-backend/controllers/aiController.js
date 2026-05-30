const Groq = require("groq-sdk"); // Ensure you have installed: npm install groq-sdk

// Groq API initialize karo
const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
});

exports.handleChat = async(req, res) => {
    try {
        const { message } = req.body;

        if (!message) {
            return res.status(400).json({ success: false, message: "Message is required" });
        }

        // Groq AI se response lo
        const chatCompletion = await groq.chat.completions.create({
            messages: [{
                role: "user",
                content: message,
            }, ],
            model: "llama3-8b-8192", // Aap koi bhi available model use kar sakte ho
        });

        const reply = chatCompletion.choices[0] ? .message ? .content || "No response from AI";

        res.status(200).json({ success: true, reply });

    } catch (error) {
        console.error("AI Chat Error:", error);
        res.status(500).json({ success: false, message: "Failed to connect to AI" });
    }
};