const mongoose = require("mongoose");

const spaceSchema = new mongoose.Schema({
    title: { type: String, required: true },
    location: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String },

    // 🗺️ Interactive Map ke liye coordinates fields
    lat: { type: Number, default: 26.2183 }, // Default Central location coordinate (e.g., Gwalior)
    lng: { type: Number, default: 78.1828 },

    // ⭐ Review system ko secure rakhne ke liye types define kar dete hain
    reviews: { type: Array, default: [] },
    averageRating: { type: Number, default: 0 }
});

module.exports = mongoose.model("Space", spaceSchema);