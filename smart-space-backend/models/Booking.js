const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({

    userId: {
        type: String,
        required: true
    },

    userName: {
        type: String,
        required: true
    },

    spaceId: {
        type: String,
        required: true
    },

    spaceTitle: {
        type: String,
        required: true
    },

    location: {
        type: String
    },

    image: {
        type: String
    },

    price: {
        type: Number
    },

    date: {
        type: String
    },

    startTime: {
        type: String
    },

    endTime: {
        type: String
    },

    status: {
        type: String,
        enum: ["upcoming", "cancelled"],
        default: "upcoming"
    },

    paymentStatus: {
        type: String,
        enum: ["PENDING", "PAID", "FAILED"],
        default: "PENDING"
    },

    paymentMethod: {
        type: String,
        default: ""
    },

    paymentId: {
        type: String,
        default: ""
    },

    checkInStatus: {
        type: String,
        enum: ["pending", "verified"],
        default: "pending"
    },

    checkedInAt: {
        type: Date
    },

    verifiedBy: {
        type: String,
        default: ""
    },

    cancelledAt: {
        type: Date
    },

    bookingDate: {
        type: Date,
        default: Date.now
    },

    qrPayload: {
        type: String,
        default: ""
    },

    qrCode: {
        type: String,
        default: ""
    },

});

module.exports =
    mongoose.model(
        "Booking",
        bookingSchema
    );
