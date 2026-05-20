const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    userId: String,
    userName: String,

    spaceId: String,
    spaceTitle: String,
    location: String,
    price: String,

    date: String,
    startTime: String,
    endTime: String,
});

module.exports = mongoose.model(
    "Booking",
    bookingSchema
);