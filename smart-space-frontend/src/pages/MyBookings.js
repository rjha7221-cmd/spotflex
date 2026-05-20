import React, { useEffect, useState } from "react";
import axios from "axios";

function MyBookings() {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async() => {
        try {
            const user = JSON.parse(
                localStorage.getItem("user")
            );

            if (!user) {
                console.log("No user found");
                return;
            }

            const res = await axios.get(
                "http://localhost:5000/api/bookings"
            );

            setBookings(res.data);

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
        div style = { styles.grid } > {
            bookings.map((booking) => ( <
                div key = { booking._id }
                style = { styles.card } >
                <
                div style = { styles.top } >
                <
                div >
                <
                h2 style = { styles.title } > { booking.spaceTitle } <
                /h2>

                <
                p style = { styles.location } > 📍{ booking.location } <
                /p> < /
                div >

                <
                div style = { styles.price } > ₹{ booking.price } <
                /div> < /
                div >

                <
                div style = { styles.details } >
                <
                div style = { styles.detailBox } >
                <
                span > 📅Date < /span> <
                p > { booking.date } < /p> < /
                div >

                <
                div style = { styles.detailBox } >
                <
                span > ⏰Time < /span> <
                p > { booking.startTime } { " " }
                to { " " } { booking.endTime } <
                /p> < /
                div > <
                /div>

                <
                button style = { styles.button } >
                View Details <
                /button> < /
                div >
            ))
        } <
        /div>

        <
        /div>
    );
}

const styles = {

    container: {
        minHeight: "100vh",
        padding: "40px",
        background: "linear-gradient(135deg,#020617,#0f172a,#111827)",
        color: "white",
        fontFamily: "Arial",
    },

    heading: {
        fontSize: "42px",
        fontWeight: "bold",
        marginBottom: "35px",
        color: "#ffffff",
        letterSpacing: "1px",
    },

    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(350px,1fr))",
        gap: "28px",
    },

    card: {
        position: "relative",

        background: "rgba(255,255,255,0.06)",

        backdropFilter: "blur(14px)",

        border: "1px solid rgba(255,255,255,0.08)",

        borderRadius: "28px",

        padding: "28px",

        overflow: "hidden",

        boxShadow: "0 8px 30px rgba(0,0,0,0.35)",

        transition: "0.3s ease",
    },

    glow: {
        position: "absolute",

        width: "180px",

        height: "180px",

        background: "rgba(59,130,246,0.25)",

        borderRadius: "50%",

        top: "-60px",

        right: "-60px",

        filter: "blur(40px)",
    },

    top: {
        display: "flex",

        justifyContent: "space-between",

        alignItems: "center",

        marginBottom: "25px",

        position: "relative",

        zIndex: 2,
    },

    title: {
        fontSize: "30px",

        fontWeight: "700",

        marginBottom: "8px",

        color: "#fff",
    },

    location: {
        color: "#cbd5e1",

        fontSize: "15px",
    },

    price: {
        background: "linear-gradient(to right,#2563eb,#06b6d4)",

        padding: "12px 20px",

        borderRadius: "16px",

        fontWeight: "bold",

        fontSize: "18px",

        color: "white",

        boxShadow: "0 4px 18px rgba(37,99,235,0.4)",
    },

    details: {
        display: "flex",

        gap: "16px",

        marginTop: "15px",

        position: "relative",

        zIndex: 2,
    },

    detailBox: {
        flex: 1,

        background: "rgba(255,255,255,0.05)",

        border: "1px solid rgba(255,255,255,0.08)",

        padding: "16px",

        borderRadius: "18px",

        color: "white",

        textAlign: "center",
    },

    label: {
        fontSize: "14px",

        color: "#94a3b8",

        marginBottom: "8px",
    },

    value: {
        fontSize: "16px",

        fontWeight: "600",
    },

    button: {
        width: "100%",

        marginTop: "28px",

        padding: "15px",

        border: "none",

        borderRadius: "16px",

        background: "linear-gradient(to right,#2563eb,#06b6d4)",

        color: "white",

        fontSize: "16px",

        fontWeight: "bold",

        cursor: "pointer",

        boxShadow: "0 4px 20px rgba(37,99,235,0.35)",

        transition: "0.3s ease",

        position: "relative",

        zIndex: 2,
    },
};
export default MyBookings;