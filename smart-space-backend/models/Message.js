const mongoose = require("mongoose");

const messageSchema =
    new mongoose.Schema({
        roomId: {
            type: String,
            required: true,
            index: true
        },
        userName: {
            type: String,
            required: true,
            trim: true
        },
        text: {
            type: String,
            required: true,
            trim: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        },
    });

module.exports =
    mongoose.models.Message ||
    mongoose.model(
        "Message",
        messageSchema
    );
