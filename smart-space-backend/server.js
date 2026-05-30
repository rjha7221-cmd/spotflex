require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const http = require("http");
const { Server } = require("socket.io");

const Message = require("./models/Message");

const authRoutes = require("./routes/authRoutes");
const spaceRoutes = require("./routes/spaceRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const aiRoutes = require("./routes/aiRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const app = express();

// ================= MIDDLEWARE =================
app.use(cors());
app.use(express.json());

// ================= ROUTES =================
app.use("/api/auth", authRoutes);
app.use("/api/spaces", spaceRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/ai", aiRoutes);
app.use("/api/wishlist", wishlistRoutes);

// ================= HTTP SERVER =================
const server = http.createServer(app);

// ================= SOCKET.IO =================
const io = new Server(server, {
    cors: {
        origin: "*",
    },
});

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // JOIN ROOM
    socket.on("join_room", (roomId) => {
        socket.join(roomId);
    });

    // SEND MESSAGE
    socket.on("send_message", async(data) => {
        try {
            const newMessage = new Message({
                roomId: data.roomId,
                userName: data.userName,
                text: data.message,
            });

            await newMessage.save();

            socket
                .to(data.roomId)
                .emit("receive_message", data);
        } catch (error) {
            console.log(error);
        }
    });

    socket.on("disconnect", () => {
        console.log(
            "User disconnected:",
            socket.id
        );
    });
});

// ================= DATABASE =================
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("MongoDB Connected 🚀");
    })
    .catch((err) => {
        console.log(err);
    });

// ================= GET CHAT MESSAGES =================
app.get(
    "/api/messages/:roomId",
    async(req, res) => {
        try {
            const messages =
                await Message.find({
                    roomId: req.params.roomId,
                }).sort({
                    createdAt: 1,
                });

            res.json(messages);
        } catch (error) {
            console.log(error);

            res.status(500).json({
                error: "Failed to fetch messages",
            });
        }
    }
);

// ================= HOME ROUTE =================
app.get("/", (req, res) => {
    res.send("Backend Running 🚀");
});

// ================= SERVER =================
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
    console.log(
        `Server running on port ${PORT}`
    );
});