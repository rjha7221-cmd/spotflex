import React, { useEffect, useState } from "react";
import axios from "axios";

function Home() {
    const [spaces, setSpaces] = useState([]);
    const [selectedSpace, setSelectedSpace] = useState(null);

    const [date, setDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");

    useEffect(() => {
        fetchSpaces();
    }, []);

    const fetchSpaces = async() => {
        try {
            const res = await axios.get("http://localhost:5000/api/spaces");
            setSpaces(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    const openBooking = (space) => setSelectedSpace(space);
    const closeBooking = () => setSelectedSpace(null);

    const handleBooking = async() => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));

            if (!user) return alert("Please login first");
            if (!date || !startTime || !endTime) return alert("Fill all details");
            console.log(user._id);
            await axios.post("http://localhost:5000/api/bookings/create", {
                userId: user._id,
                userName: user.name,
                spaceId: selectedSpace._id,
                spaceTitle: selectedSpace.title,
                location: selectedSpace.location,
                price: selectedSpace.price,
                date,
                startTime,
                endTime,
            });

            alert("Booking Successful 🚀");
            closeBooking();

        } catch (error) {
            console.log(error);
            alert("Booking Failed");
        }
    };

    return ( <
        div style = { styles.container } >
        <
        h1 style = { styles.heading } > Explore Spaces < /h1> <
        p style = { styles.subHeading } > Book your perfect workspace instantly < /p>

        <
        div style = { styles.grid } > {
            spaces.map((space) => ( <
                div key = { space._id }
                style = { styles.card } >
                <
                img src = { space.image }
                style = { styles.image }
                />

                <
                div style = { styles.cardBody } >
                <
                h2 style = { styles.title } > { space.title } < /h2> <
                p style = { styles.text } > 📍{ space.location } < /p> <
                h3 style = { styles.price } > ₹{ space.price } < /h3>

                <
                button style = { styles.button }
                onClick = {
                    () => openBooking(space)
                } >
                Book Now <
                /button> < /
                div > <
                /div>
            ))
        } <
        /div>

        {
            selectedSpace && ( <
                div style = { styles.overlay } >
                <
                div style = { styles.modal } >
                <
                h2 style = {
                    { color: "white" }
                } > { selectedSpace.title } < /h2>

                <
                input type = "date"
                value = { date }
                onChange = {
                    (e) => setDate(e.target.value)
                }
                style = { styles.input }
                />

                <
                input type = "time"
                value = { startTime }
                onChange = {
                    (e) => setStartTime(e.target.value)
                }
                style = { styles.input }
                />

                <
                input type = "time"
                value = { endTime }
                onChange = {
                    (e) => setEndTime(e.target.value)
                }
                style = { styles.input }
                />

                <
                button style = { styles.bookBtn }
                onClick = { handleBooking } >
                Confirm Booking <
                /button>

                <
                button style = { styles.cancelBtn }
                onClick = { closeBooking } >
                Cancel <
                /button> < /
                div > <
                /div>
            )
        } <
        /div>
    );
}

const styles = {
    container: {
        padding: "30px",
        minHeight: "100vh",
        background: "#0f172a",
        color: "white",
        fontFamily: "Arial"
    },

    heading: {
        fontSize: "36px",
        fontWeight: "bold"
    },

    subHeading: {
        color: "#94a3b8",
        marginBottom: "20px"
    },

    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))",
        gap: "20px"
    },

    card: {
        background: "rgba(255,255,255,0.08)",
        borderRadius: "16px",
        overflow: "hidden",
        backdropFilter: "blur(10px)"
    },

    image: {
        width: "100%",
        height: "180px",
        objectFit: "cover"
    },

    cardBody: {
        padding: "15px"
    },

    title: {
        color: "white",
        fontSize: "18px"
    },

    text: {
        color: "#cbd5e1"
    },

    price: {
        color: "#38bdf8"
    },

    button: {
        width: "100%",
        padding: "10px",
        background: "#2563eb",
        color: "white",
        border: "none",
        borderRadius: "8px",
        marginTop: "10px",
        cursor: "pointer"
    },

    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },

    modal: {
        background: "#111827",
        padding: "20px",
        borderRadius: "12px",
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        width: "300px"
    },

    input: {
        padding: "10px",
        borderRadius: "6px",
        border: "none"
    },

    bookBtn: {
        background: "green",
        color: "white",
        border: "none",
        padding: "10px",
        borderRadius: "6px"
    },

    cancelBtn: {
        background: "red",
        color: "white",
        border: "none",
        padding: "10px",
        borderRadius: "6px"
    }
};

export default Home;