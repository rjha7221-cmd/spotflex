const express = require("express");
const rateLimit = require("express-rate-limit");
const mongoose = require("mongoose");

const router = express.Router();

const Booking = require("../models/Booking");
const Space = require("../models/Space");
const QRCode = require("qrcode");
const bookingRateLimiter = rateLimit({
    windowMs: 60 * 1000,
    limit: 60,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        message: "Too many requests. Please try again later."
    }
});

router.use(bookingRateLimiter);

const sanitizeString = (value) => {

    if (typeof value !== "string") {
        return null;
    }

    const sanitized = value.trim();

    if (!sanitized) {
        return null;
    }

    return sanitized;
};

const toMinutes = (time) => {

    if (!time || !time.includes(":")) {
        return NaN;
    }

    const [hours, minutes] = time.split(":").map(Number);

    return hours * 60 + minutes;
};

const getBookingStatus = (booking) => {

    if (booking.status === "cancelled") {
        return "cancelled";
    }

    const endDateTime =
        new Date(`${booking.date}T${booking.endTime}`);

    if (Number.isNaN(endDateTime.getTime())) {
        return "upcoming";
    }

    return endDateTime < new Date() ?
        "completed" :
        "upcoming";
};

const validateDateAndTime = (
    date,
    startTime,
    endTime
) => {

    if (!date || !startTime || !endTime) {

        return "Date, start time and end time are required";
    }

    const startMinutes = toMinutes(startTime);
    const endMinutes = toMinutes(endTime);

    if (
        Number.isNaN(startMinutes) ||
        Number.isNaN(endMinutes)
    ) {

        return "Invalid time format";
    }

    if (endMinutes <= startMinutes) {

        return "End time must be greater than start time";
    }

    const startDateTime =
        new Date(`${date}T${startTime}`);

    if (Number.isNaN(startDateTime.getTime())) {

        return "Invalid date/time value";
    }

    if (startDateTime < new Date()) {

        return "Cannot create/update booking for past time slot";
    }

    return null;
};

const hasSlotConflict = async(
    spaceId,
    date,
    startTime,
    endTime,
    excludeId
) => {

    const query = {
        spaceId,
        date,
        status: {
            $ne: "cancelled"
        }
    };

    if (excludeId) {

        query._id = {
            $ne: excludeId
        };
    }

    const existingBookings =
        await Booking.find(query);

    const requestedStart =
        toMinutes(startTime);

    const requestedEnd =
        toMinutes(endTime);

    return existingBookings.some((booking) => {

        const existingStart =
            toMinutes(booking.startTime);

        const existingEnd =
            toMinutes(booking.endTime);

        return (
            requestedStart < existingEnd &&
            requestedEnd > existingStart
        );
    });
};

const getBookingIdFromScan = (scanValue) => {

    if (typeof scanValue !== "string") {
        return null;
    }

    const trimmedValue = scanValue.trim();

    if (!trimmedValue) {
        return null;
    }

    if (mongoose.Types.ObjectId.isValid(trimmedValue)) {
        return trimmedValue;
    }

    try {
        const parsedValue =
            JSON.parse(trimmedValue);

        const parsedBookingId =
            parsedValue.bookingId ||
            parsedValue._id;

        if (
            typeof parsedBookingId === "string" &&
            mongoose.Types.ObjectId.isValid(parsedBookingId)
        ) {
            return parsedBookingId;
        }
    } catch (error) {
        // Scanner payloads can be plain text, JSON, or text around a booking id.
    }

    const objectIdMatch =
        trimmedValue.match(/[a-f\d]{24}/i);

    return objectIdMatch ?
        objectIdMatch[0] :
        null;
};





// ================= CREATE BOOKING =================

router.post("/create", async(req, res) => {

    try {

        const {
            userId,
            userName,
            spaceId,
            spaceTitle,
            date,
            startTime,
            endTime,
            paymentStatus,
            paymentMethod,
            paymentId
        } = req.body;

        const safeUserId =
            sanitizeString(userId);

        const safeUserName =
            sanitizeString(userName);

        const safeSpaceId =
            sanitizeString(spaceId);

        const safeSpaceTitle =
            sanitizeString(spaceTitle);

        const safeDate =
            sanitizeString(date);

        const safeStartTime =
            sanitizeString(startTime);

        const safeEndTime =
            sanitizeString(endTime);

        const safePaymentMethod =
            sanitizeString(paymentMethod) ||
            "Fake Razorpay";

        const safePaymentId =
            sanitizeString(paymentId) ||
            `fake_${Date.now()}`;

        if (!safeUserId ||
            !safeUserName ||
            !safeSpaceId ||
            !safeSpaceTitle
        ) {

            return res.status(400).json({
                message: "Required booking details are missing"
            });
        }

        const dateTimeError =
            validateDateAndTime(
                safeDate,
                safeStartTime,
                safeEndTime
            );

        if (dateTimeError) {

            return res.status(400).json({
                message: dateTimeError
            });
        }

        const conflict =
            await hasSlotConflict(
                safeSpaceId,
                safeDate,
                safeStartTime,
                safeEndTime
            );

        if (conflict) {

            return res.status(400).json({
                message: "Selected slot is already booked"
            });
        }

        if (!mongoose.Types.ObjectId.isValid(safeSpaceId)) {

            return res.status(400).json({
                message: "Invalid space selected"
            });
        }

        // GET SPACE DATA
        const space =
            await Space.findById(safeSpaceId);

        if (!space) {

            return res.status(404).json({
                message: "Selected space was not found"
            });
        }

        const booking = new Booking({

            userId: safeUserId,

            userName: safeUserName,

            spaceId: safeSpaceId,

            spaceTitle: safeSpaceTitle,

            image: space && space.image ? space.image : "",

            location: space && space.location ? space.location : "",

            price: space && space.price ? space.price : 0,
            date: safeDate,

            startTime: safeStartTime,

            endTime: safeEndTime,

            status: "upcoming",

            paymentStatus: paymentStatus === "PAID" ?
                "PAID" :
                "PENDING",

            paymentMethod: safePaymentMethod,

            paymentId: safePaymentId
        });

        await booking.save();

        const qrData = {
            type: "SPOTFLEX_CHECK_IN",
            bookingId: booking._id,
            userId: booking.userId,
            userName: booking.userName,
            spaceId: booking.spaceId,
            spaceTitle: booking.spaceTitle,
            date: booking.date,
            startTime: booking.startTime,
            endTime: booking.endTime,
            issuedAt: new Date().toISOString()
        };

        const qrPayload =
            JSON.stringify(qrData);

        const qrCode = await QRCode.toDataURL(
            qrPayload
        );

        booking.qrPayload = qrPayload;

        booking.qrCode = qrCode;

        await booking.save();

        res.status(201).json({
            message: "Booking Successful 🚀",
            bookingId: booking._id,
            booking,
            qrPayload,
            qrCode
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
});






// ================= USER BOOKINGS =================

router.get("/user/:userId", async(req, res) => {

    try {

        const safeUserId =
            sanitizeString(req.params.userId);

        if (!safeUserId) {

            return res.status(400).json({
                message: "Invalid user id"
            });
        }

        const bookings =
            await Booking.find({
                userId: safeUserId
            }).sort({
                bookingDate: -1
            });

        const enrichedBookings =
            bookings.map((booking) => {

                const data =
                    booking.toObject();

                return {
                    ...data,
                    computedStatus: getBookingStatus(data)
                };
            });

        res.json(enrichedBookings);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
});



// ================= VERIFY CHECK-IN =================

router.post("/verify-checkin", async(req, res) => {

    try {

        const {
            bookingId,
            qrPayload,
            scanCode,
            verifiedBy
        } = req.body;

        const safeBookingId =
            sanitizeString(bookingId);

        const resolvedBookingId =
            safeBookingId ||
            getBookingIdFromScan(qrPayload) ||
            getBookingIdFromScan(scanCode);

        if (
            !resolvedBookingId ||
            !mongoose.Types.ObjectId.isValid(resolvedBookingId)
        ) {
            return res.status(400).json({
                message: "Invalid QR or booking code"
            });
        }

        const booking =
            await Booking.findById(resolvedBookingId);

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        if (booking.status === "cancelled") {
            return res.status(400).json({
                message: "Cancelled bookings cannot be checked in"
            });
        }

        if (booking.checkInStatus === "verified") {
            return res.json({
                message: "Check-in already verified",
                booking
            });
        }

        booking.checkInStatus = "verified";
        booking.checkedInAt = new Date();
        booking.verifiedBy =
            sanitizeString(verifiedBy) ||
            "Owner";

        await booking.save();

        res.json({
            message: "Check-In Verified",
            booking
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
});






// ================= CANCEL BOOKING =================

router.put("/:id/cancel", async(req, res) => {

    try {

        const booking =
            await Booking.findById(req.params.id);

        if (!booking) {

            return res.status(404).json({
                message: "Booking not found"
            });
        }

        booking.status = "cancelled";

        booking.cancelledAt =
            new Date();

        await booking.save();

        res.json({
            message: "Booking cancelled successfully",
            booking
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
});






// ================= RESCHEDULE BOOKING =================

router.put("/:id/reschedule", async(req, res) => {

    try {

        const {
            date,
            startTime,
            endTime
        } = req.body;

        const booking =
            await Booking.findById(req.params.id);

        if (!booking) {

            return res.status(404).json({
                message: "Booking not found"
            });
        }

        const conflict =
            await hasSlotConflict(
                booking.spaceId,
                date,
                startTime,
                endTime,
                booking._id
            );

        if (conflict) {

            return res.status(400).json({
                message: "Selected slot is already booked"
            });
        }

        booking.date = date;
        booking.startTime = startTime;
        booking.endTime = endTime;

        await booking.save();

        res.json({
            message: "Booking rescheduled successfully",
            booking
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
});






// ================= GET ALL BOOKINGS =================

router.get("/", async(req, res) => {

    try {

        const bookings =
            await Booking.find().sort({
                date: -1
            });

        res.json(bookings);

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
});
// ================= DELETE BOOKING =================

router.delete("/:id", async(req, res) => {

    try {

        await Booking.findByIdAndDelete(req.params.id);

        res.json({
            success: true,
            message: "Booking deleted successfully"
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
});

module.exports = router;
