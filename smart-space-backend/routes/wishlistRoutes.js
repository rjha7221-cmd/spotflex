const express = require("express");

const router = express.Router();

const Wishlist = require("../models/Wishlist");


// ADD TO WISHLIST

router.post("/add", async(req, res) => {

    try {

        const {
            userId,
            spaceId,
            title,
            location,
            price,
            image,
        } = req.body;

        const exists =
            await Wishlist.findOne({
                userId,
                spaceId,
            });

        if (exists) {

            return res.json({
                success: false,
                message: "Already in wishlist",
            });
        }

        const newWishlist =
            new Wishlist({
                userId,
                spaceId,
                title,
                location,
                price,
                image,
            });

        await newWishlist.save();

        res.json({
            success: true,
            message: "Added to wishlist",
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
        });
    }
});


// GET USER WISHLIST

router.get("/:userId", async(req, res) => {

    try {

        const wishlist =
            await Wishlist.find({
                userId: req.params.userId,
            });

        res.json(wishlist);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
        });
    }
});


// REMOVE FROM WISHLIST

router.delete(
    "/:userId/:spaceId",
    async(req, res) => {

        try {

            await Wishlist.findOneAndDelete({
                userId: req.params.userId,

                spaceId: req.params.spaceId,
            });

            res.json({
                success: true,
            });

        } catch (error) {

            console.log(error);

            res.status(500).json({
                success: false,
            });
        }
    }
);

module.exports = router;