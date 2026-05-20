const express = require("express");

const router = express.Router();

const Booking = require("../models/Booking");


// CREATE BOOKING
router.post("/create", async(req, res) => {

    try {

        const booking = new Booking(req.body);

        const savedBooking =
            await booking.save();

        res.status(201).json(savedBooking);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: "Booking Failed",
        });
    }
});


// GET ALL BOOKINGS
router.get("/", async(req, res) => {

    try {

        const bookings =
            await Booking.find();

        res.json(bookings);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: error.message,
        });
    }
});


// GET USER BOOKINGS
router.get("/:userId", async(req, res) => {

    try {

        const bookings = await Booking.find({
            userId: req.params.userId,
        });

        res.json(bookings);

    } catch (error) {

        console.log(error);

        res.status(500).json({
            message: error.message,
        });
    }
});

module.exports = router;