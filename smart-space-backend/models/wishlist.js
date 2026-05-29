const mongoose = require("mongoose");

const wishlistSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },

    spaceId: {
        type: String,
        required: true,
    },

    title: String,

    location: String,

    price: Number,

    image: String,
});

module.exports = mongoose.model(
    "Wishlist",
    wishlistSchema
);