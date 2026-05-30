const mongoose = require("mongoose");

const WishlistSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    spaceId: { type: String, required: true },
    title: { type: String },
    location: { type: String },
    price: { type: Number },
    image: { type: String }
});

module.exports = mongoose.model("Wishlist", WishlistSchema);