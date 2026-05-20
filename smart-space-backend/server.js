require("dotenv").config();

const express = require("express");

const mongoose = require("mongoose");

const cors = require("cors");

const authRoutes =
    require("./routes/authRoutes");

const spaceRoutes =
    require("./routes/spaceRoutes");

const bookingRoutes =
    require("./routes/bookingRoutes");

const app = express();

app.use(cors());

app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected");
    })
    .catch((err) => {
        console.log(err);
    });

app.use("/api/auth", authRoutes);

app.use("/api/spaces", spaceRoutes);

app.use("/api/bookings", bookingRoutes);

app.get("/", (req, res) => {
    res.send("Backend Running 🚀");
});

app.listen(5000, () => {
    console.log(
        "Server running on port 5000"
    );
});