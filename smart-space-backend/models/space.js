const mongoose = require("mongoose");

const spaceSchema = new mongoose.Schema({
    title: String,
    location: String,
    price: Number,
    image: String,
});

module.exports = mongoose.model(
    "Space",
    spaceSchema
);