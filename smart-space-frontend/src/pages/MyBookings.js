import React, { useEffect, useState } from "react";
import axios from "axios";
import ChatBox from "../components/ChatBox";

const toMinutes = (time) => {
    if (!time || !time.includes(":")) {
        return NaN;
    }

    const [hours, minutes] = time.split(":").map(Number);

    return hours * 60 + minutes;
};

function MyBookings() {

    const [bookings, setBookings] = useState([]);
    const [editingBooking, setEditingBooking] = useState(null);

    const [rescheduleDate, setRescheduleDate] = useState("");
    const [rescheduleStartTime, setRescheduleStartTime] = useState("");
    const [rescheduleEndTime, setRescheduleEndTime] = useState("");

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async() => {

        try {

            const user = JSON.parse(
                localStorage.getItem("user")
            );

            if (!user) return;

            const res = await axios.get(
                `http://localhost:5000/api/bookings/user/${user.id}`
            );

            setBookings(
                Array.isArray(res.data) ?
                res.data : []
            );

        } catch (error) {
            console.log(error);
        }
    };

    const getStatus = (booking) => {

        if (booking.status === "cancelled") {
            return "cancelled";
        }

        const endDateTime = new Date(
            `${booking.date}T${booking.endTime}`
        );

        return endDateTime < new Date() ?
            "completed" :
            "upcoming";
    };

    const getStatusStyle = (status) => {

        if (status === "completed") {
            return styles.completedBadge;
        }

        if (status === "cancelled") {
            return styles.cancelledBadge;
        }

        return styles.upcomingBadge;
    };

    const openReschedule = (booking) => {

        setEditingBooking(booking);

        setRescheduleDate(booking.date);
        setRescheduleStartTime(booking.startTime);
        setRescheduleEndTime(booking.endTime);
    };

    const closeReschedule = () => {

        setEditingBooking(null);

        setRescheduleDate("");
        setRescheduleStartTime("");
        setRescheduleEndTime("");
    };

    const handleCancelBooking = async(bookingId) => {

        try {

            await axios.delete(
                `http://localhost:5000/api/bookings/${bookingId}`
            );

            alert("Booking Deleted");

            setBookings((prev) =>
                prev.filter(
                    (booking) =>
                    booking._id !== bookingId
                )
            );

        } catch (error) {

            console.log(error);
        }
    };

    const handleReschedule = async() => {

        if (!editingBooking) return;

        if (!rescheduleDate ||
            !rescheduleStartTime ||
            !rescheduleEndTime
        ) {
            return alert("Fill all fields");
        }

        const startMinutes = toMinutes(
            rescheduleStartTime
        );

        const endMinutes = toMinutes(
            rescheduleEndTime
        );

        if (endMinutes <= startMinutes) {
            return alert(
                "End time must be after start time"
            );
        }

        try {

            await axios.put(
                `http://localhost:5000/api/bookings/${editingBooking._id}/reschedule`, {
                    date: rescheduleDate,
                    startTime: rescheduleStartTime,
                    endTime: rescheduleEndTime,
                }
            );

            alert("Booking Rescheduled");

            closeReschedule();

            fetchBookings();

        } catch (error) {
            console.log(error);
        }
    };

    return ( <
        div style = { styles.container } >

        <
        h1 style = { styles.heading } >
        My Bookings <
        /h1>

        <
        div style = { styles.grid } >

        {
            bookings.length > 0 ? (

                bookings.map((booking) => {

                    const status = getStatus(booking);

                    const canManage =
                        status === "upcoming";

                    const userData = JSON.parse(
                        localStorage.getItem("user")
                    );

                    return (

                        <
                        div key = { booking._id }
                        style = { styles.card } >

                        { /* IMAGE */ } <
                        img src = {
                            booking.image ?
                            booking.image : "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=1200&auto=format&fit=crop"
                        }
                        alt = "space"
                        style = { styles.image }
                        />

                        <
                        div style = { styles.cardTop } >

                        <
                        h2 style = { styles.cardTitle } > { booking.spaceTitle } <
                        /h2>

                        <
                        span style = {
                            {
                                ...styles.badge,
                                    ...getStatusStyle(status),
                            }
                        } > { status.toUpperCase() } <
                        /span>

                        <
                        /div>

                        <
                        p > 📍{ booking.location } <
                        /p>

                        <
                        p > 📅{ booking.date } <
                        /p>

                        <
                        p > ⏰{ booking.startTime } - { booking.endTime } <
                        /p>

                        <
                        h3 > ₹{ booking.price } <
                        /h3>

                        {
                            canManage && (

                                <
                                div style = { styles.actionWrap } >

                                <
                                button style = { styles.rescheduleBtn }
                                onClick = {
                                    () =>
                                    openReschedule(booking)
                                } >
                                Reschedule <
                                /button>

                                <
                                button style = { styles.cancelBtn }
                                onClick = {
                                    () =>
                                    handleCancelBooking(
                                        booking._id
                                    )
                                } >
                                Cancel <
                                /button>

                                <
                                /div>
                            )
                        }

                        { /* CHAT BOX */ } <
                        div style = { styles.chatWrap } >

                        <
                        ChatBox roomId = { booking._id }
                        userName = {
                            userData && userData.name ?
                            userData.name : "User"
                        }
                        />

                        <
                        /div>

                        <
                        /div>
                    );
                })

            ) : (

                <
                h2 style = { styles.emptyText } >
                No Bookings Found <
                /h2>
            )
        }

        <
        /div>

        {
            editingBooking && (

                <
                div style = { styles.modal } >

                <
                div style = { styles.modalContent } >

                <
                h2 >
                Reschedule Booking <
                /h2>

                <
                input type = "date"
                value = { rescheduleDate }
                onChange = {
                    (e) =>
                    setRescheduleDate(
                        e.target.value
                    )
                }
                style = { styles.input }
                />

                <
                input type = "time"
                value = { rescheduleStartTime }
                onChange = {
                    (e) =>
                    setRescheduleStartTime(
                        e.target.value
                    )
                }
                style = { styles.input }
                />

                <
                input type = "time"
                value = { rescheduleEndTime }
                onChange = {
                    (e) =>
                    setRescheduleEndTime(
                        e.target.value
                    )
                }
                style = { styles.input }
                />

                <
                button style = { styles.saveBtn }
                onClick = { handleReschedule } >
                Save <
                /button>

                <
                button style = { styles.closeBtn }
                onClick = { closeReschedule } >
                Close <
                /button>

                <
                /div>

                <
                /div>
            )
        }

        <
        /div>
    );
}

const styles = {

    container: {
        minHeight: "100vh",
        padding: "40px",
        background: "#0f172a",
    },

    heading: {
        color: "white",
        marginBottom: "30px",
        fontSize: "40px",
    },

    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(340px,1fr))",
        gap: "25px",
    },

    card: {
        background: "rgba(255,255,255,0.08)",
        borderRadius: "20px",
        padding: "20px",
        color: "white",
        backdropFilter: "blur(10px)",
        boxShadow: "0 5px 20px rgba(0,0,0,0.3)",
    },

    image: {
        width: "100%",
        height: "220px",
        objectFit: "cover",
        borderRadius: "15px",
        marginBottom: "15px",
    },

    cardTop: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "10px",
        gap: "10px",
    },

    cardTitle: {
        margin: 0,
        fontSize: "22px",
    },

    badge: {
        borderRadius: "999px",
        padding: "5px 12px",
        fontSize: "12px",
        fontWeight: "700",
    },

    upcomingBadge: {
        background: "#16a34a",
    },

    completedBadge: {
        background: "#2563eb",
    },

    cancelledBadge: {
        background: "#dc2626",
    },

    actionWrap: {
        display: "flex",
        gap: "10px",
        marginTop: "15px",
    },

    rescheduleBtn: {
        flex: 1,
        padding: "10px",
        border: "none",
        borderRadius: "10px",
        background: "#2563eb",
        color: "white",
        cursor: "pointer",
        fontWeight: "bold",
    },

    cancelBtn: {
        flex: 1,
        padding: "10px",
        border: "none",
        borderRadius: "10px",
        background: "#dc2626",
        color: "white",
        cursor: "pointer",
        fontWeight: "bold",
    },

    chatWrap: {
        marginTop: "20px",
    },

    emptyText: {
        color: "white",
    },

    modal: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 999,
    },

    modalContent: {
        background: "white",
        padding: "25px",
        borderRadius: "20px",
        width: "350px",
        display: "flex",
        flexDirection: "column",
        gap: "12px",
    },

    input: {
        padding: "12px",
        borderRadius: "10px",
        border: "1px solid #ddd",
    },

    saveBtn: {
        padding: "12px",
        border: "none",
        borderRadius: "10px",
        background: "#16a34a",
        color: "white",
        cursor: "pointer",
        fontWeight: "bold",
    },

    closeBtn: {
        padding: "12px",
        border: "none",
        borderRadius: "10px",
        background: "#ef4444",
        color: "white",
        cursor: "pointer",
        fontWeight: "bold",
    },
};

export default MyBookings;