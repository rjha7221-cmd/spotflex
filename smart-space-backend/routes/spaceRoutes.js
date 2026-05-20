const express = require("express");

const router = express.Router();

const Space = require("../models/Space");

// GET ALL SPACES

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

// ADD SPACE

router.post("/add", async(req, res) => {
    try {
        console.log(req.body);

        const {
            title,
            location,
            price,
            image,
        } = req.body;

        const newSpace = new Space({
            title,
            location,
            price,
            image,
        });

        await newSpace.save();

        res.json({
            success: true,
            message: "Space Added Successfully",
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
            message: "Add Space Failed",
        });
    }
});

// DELETE SPACE

router.delete("/:id", async(req, res) => {
    try {
        await Space.findByIdAndDelete(
            req.params.id
        );

        res.json({
            success: true,
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
        });
    }
});

// UPDATE SPACE

router.put("/:id", async(req, res) => {
    try {
        await Space.findByIdAndUpdate(
            req.params.id,
            req.body
        );

        res.json({
            success: true,
        });
    } catch (error) {
        console.log(error);

        res.status(500).json({
            success: false,
        });
    }
});

module.exports = router;