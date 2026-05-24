const express = require("express");
const router = express.Router();
const Space = require("../models/Space");

// ==========================================
// GET ALL SPACES
// ==========================================
router.get("/", async(req, res) => {
    try {
        const spaces = await Space.find();
        res.json(spaces);
    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch spaces",
        });
    }
});

// ==========================================
// ADD SPACE
// ==========================================
router.post("/add", async(req, res) => {
    try {
        const { title, location, price, image, lat, lng } = req.body;

        const newSpace = new Space({
            title,
            location,
            price,
            image,
            lat: lat ? Number(lat) : 26.2183, // default values
            lng: lng ? Number(lng) : 78.1828,
            reviews: [],
            averageRating: 0
        });

        await newSpace.save();
        res.json({ success: true, message: "Space Added Successfully" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, message: "Add Space Failed" });
    }
});

// ==========================================
// DELETE SPACE
// ==========================================
router.delete("/:id", async(req, res) => {
    try {
        await Space.findByIdAndDelete(req.params.id);
        res.json({ success: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false });
    }
});

// ==========================================
// UPDATE SPACE
// ==========================================
router.put("/:id", async(req, res) => {
    try {
        await Space.findByIdAndUpdate(req.params.id, req.body);
        res.json({ success: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false });
    }
});

// ==========================================
// NEW FEATURE: ADD A REVIEW TO A SPACE ⭐
// ==========================================
router.post("/:id/review", async(req, res) => {
    try {
        const { userId, userName, rating, comment } = req.body;

        // Validation check
        if (!userId || !userName || !rating || !comment) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const space = await Space.findById(req.params.id);
        if (!space) {
            return res.status(404).json({ message: "Space not found" });
        }

        const newReview = {
            userId: String(userId),
            userName: String(userName),
            rating: Number(rating),
            comment: String(comment),
            createdAt: new Date()
        };

        // Strict array handling (in case legacy documents don't have this array)
        if (!space.reviews || !Array.isArray(space.reviews)) {
            space.reviews = [];
        }

        space.reviews.push(newReview);

        // Average rating formula
        const totalRating = space.reviews.reduce((acc, item) => item.rating + acc, 0);
        space.averageRating = Number((totalRating / space.reviews.length).toFixed(1));

        await space.save();

        // Frontend expectations matching
        res.status(201).json({
            message: "Review added successfully",
            space
        });
    } catch (error) {
        console.error("Backend Review Error Log:", error);
        res.status(500).json({
            message: "Server Error while adding review",
            error: error.message
        });
    }
});

module.exports = router;