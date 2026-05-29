import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import AIChatBot from "../components/AIChatBot";

const toMinutes = (time) => {
    if (!time || !time.includes(":")) return NaN;
    const [hours, minutes] = time.split(":").map(Number);
    return hours * 60 + minutes;
};

function Home() {
    const [spaces, setSpaces] = useState([]);
    const [recommendedSpaces, setRecommendedSpaces] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [selectedSpace, setSelectedSpace] = useState(null);
    const [date, setDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");
    const [query, setQuery] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    // 🎤 VOICE SEARCH LOGIC
    const startVoiceSearch = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) return alert("Your browser does not support voice search");

        const recognition = new SpeechRecognition();
        recognition.lang = "en-US";
        recognition.onresult = (event) => {
            setQuery(event.results[0][0].transcript);
        };
        recognition.start();
    };

    useEffect(() => {
        fetchSpaces();
        const savedWishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
        setWishlist(savedWishlist);
    }, []);

    const fetchSpaces = async() => {
        try {
            const res = await axios.get("http://localhost:5000/api/spaces");
            const allSpaces = Array.isArray(res.data) ? res.data : [];
            setSpaces(allSpaces);

            const smartSorted = [...allSpaces].sort((a, b) => {
                const scoreA = (Number(a.averageRating) || 0) * 10 - (Number(a.price) || 0) / 100;
                const scoreB = (Number(b.averageRating) || 0) * 10 - (Number(b.price) || 0) / 100;
                return scoreB - scoreA;
            });
            setRecommendedSpaces(smartSorted.slice(0, 3));
        } catch (error) {
            console.log(error);
        }
    };

    const toggleWishlist = (space) => {
        let updatedWishlist = wishlist.find((item) => item._id === space._id) ?
            wishlist.filter((item) => item._id !== space._id) : [...wishlist, space];
        setWishlist(updatedWishlist);
        localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));
    };

    const isWishlisted = (id) => wishlist.some((item) => item._id === id);

    const filteredSpaces = useMemo(() => {
        return spaces.filter((space) => {
            const search = query.toLowerCase();
            const matchSearch = !search || (space.title || "").toLowerCase().includes(search) || (space.location || "").toLowerCase().includes(search);
            const matchPrice = !maxPrice || (Number(space.price) || 0) <= Number(maxPrice);
            return matchSearch && matchPrice;
        });
    }, [spaces, query, maxPrice]);

    const openBooking = (space) => setSelectedSpace(space);
    const closeBooking = () => {
        setSelectedSpace(null);
        setDate("");
        setStartTime("");
        setEndTime("");
    };

    const handleBooking = async() => {
        const user = JSON.parse(localStorage.getItem("user"));
        if (!user) return alert("Please Login");
        if (!date || !startTime || !endTime) return alert("Fill all details");
        const startMinutes = toMinutes(startTime);
        const endMinutes = toMinutes(endTime);
        if (endMinutes <= startMinutes) return alert("End Time must be greater");
        try {
            await axios.post("http://localhost:5000/api/bookings/create", {
                userId: user.id,
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
            const errorMessage = (error.response && error.response.data && error.response.data.message) || "Booking Failed";
            alert(errorMessage);
        }
    };

    return ( <
        div style = { styles.container } >
        <
        header style = { styles.header } >
        <
        h1 style = { styles.heading } > Find Perfect Spaces < /h1> <
        p style = { styles.tagline } > AI Smart Recommendations🤖 < /p> < /
        header >

        <
        section style = { styles.filterBar } >
        <
        div style = {
            { position: "relative", width: "100%" }
        } >
        <
        input value = { query }
        onChange = {
            (e) => setQuery(e.target.value)
        }
        placeholder = "Search Space"
        style = { styles.input }
        /> <
        button onClick = { startVoiceSearch }
        style = { styles.micButton } > 🎤 < /button> < /
        div > <
        input type = "number"
        value = { maxPrice }
        onChange = {
            (e) => setMaxPrice(e.target.value)
        }
        placeholder = "Max Price"
        style = { styles.input }
        /> < /
        section >

        <
        h2 style = { styles.recommendHeading } > 🤖Recommended Spaces < /h2> <
        div style = { styles.grid } > {
            recommendedSpaces.map((space) => ( <
                div key = { space._id }
                style = { styles.card } >
                <
                div style = { styles.imageWrapper } >
                <
                img src = { space.image }
                alt = "space"
                style = { styles.image }
                /> <
                button style = {
                    {...styles.wishlistBtn, color: isWishlisted(space._id) ? "#ef4444" : "white" }
                }
                onClick = {
                    () => toggleWishlist(space)
                } > ♥ < /button> < /
                div > <
                div style = { styles.cardBody } >
                <
                h2 style = { styles.title } > { space.title } < /h2> <
                p style = { styles.text } > 📍{ space.location } < /p> <
                div style = {
                    { color: "#eab308", marginBottom: "8px" }
                } > ⭐{ space.averageRating || 0 } < /div> <
                h3 style = { styles.price } > ₹{ space.price } < /h3> <
                button style = { styles.button }
                onClick = {
                    () => openBooking(space)
                } > Book Recommended < /button> < /
                div > <
                /div>
            ))
        } <
        /div>

        <
        h2 style = { styles.recommendHeading } > 📦All Spaces < /h2> <
        div style = { styles.grid } > {
            filteredSpaces.map((space) => ( <
                div key = { space._id }
                style = { styles.card } >
                <
                div style = { styles.imageWrapper } >
                <
                img src = { space.image || "https://via.placeholder.com/400x200" }
                alt = "space"
                style = { styles.image }
                /> <
                button style = {
                    {...styles.wishlistBtn, color: isWishlisted(space._id) ? "#ef4444" : "white" }
                }
                onClick = {
                    () => toggleWishlist(space)
                } > ♥ < /button> < /
                div > <
                div style = { styles.cardBody } >
                <
                h2 style = { styles.title } > { space.title } < /h2> <
                p style = { styles.text } > 📍{ space.location } < /p> <
                div style = {
                    { color: "#eab308", marginBottom: "8px" }
                } > ⭐{ space.averageRating || 0 } < /div> <
                h3 style = { styles.price } > ₹{ space.price } < /h3> <
                button style = { styles.button }
                onClick = {
                    () => openBooking(space)
                } > Book Now < /button> < /
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
                img src = { selectedSpace.image }
                alt = "space"
                style = { styles.modalImage }
                /> <
                h2 style = { styles.modalTitle } > { selectedSpace.title } < /h2> <
                p style = { styles.text } > 📍{ selectedSpace.location } < /p> <
                h3 style = { styles.price } > ₹{ selectedSpace.price } < /h3> <
                input type = "date"
                value = { date }
                min = { new Date().toISOString().split("T")[0] }
                onChange = {
                    (e) => setDate(e.target.value)
                }
                style = { styles.modalInput }
                /> <
                input type = "time"
                value = { startTime }
                onChange = {
                    (e) => setStartTime(e.target.value)
                }
                style = { styles.modalInput }
                /> <
                input type = "time"
                value = { endTime }
                onChange = {
                    (e) => setEndTime(e.target.value)
                }
                style = { styles.modalInput }
                /> <
                button style = { styles.button }
                onClick = { handleBooking } > Confirm Booking < /button> <
                button style = { styles.closeBtn }
                onClick = { closeBooking } > Close < /button> < /
                div > <
                /div>
            )
        } <
        AIChatBot / >
        <
        /div>
    );
}

const styles = {
    container: { padding: "30px", background: "#020617", minHeight: "100vh" },
    header: { marginBottom: "20px" },
    heading: { color: "white", fontSize: "48px", marginBottom: "10px" },
    tagline: { color: "#94a3b8", fontSize: "18px" },
    filterBar: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "15px", marginBottom: "25px" },
    input: { padding: "15px 45px 15px 15px", borderRadius: "12px", border: "none", fontSize: "16px", width: "100%", boxSizing: "border-box" },
    micButton: { position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", background: "transparent", border: "none", cursor: "pointer", fontSize: "20px", zIndex: 10 },
    recommendHeading: { color: "white", marginBottom: "20px", marginTop: "10px" },
    grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: "20px", marginBottom: "40px" },
    card: { background: "#0f172a", borderRadius: "20px", overflow: "hidden", border: "1px solid #1e293b", position: "relative" },
    imageWrapper: { position: "relative" },
    wishlistBtn: { position: "absolute", top: "12px", right: "12px", width: "42px", height: "42px", borderRadius: "50%", border: "none", background: "rgba(0,0,0,0.6)", fontSize: "22px", cursor: "pointer" },
    image: { width: "100%", height: "220px", objectFit: "cover" },
    cardBody: { padding: "18px" },
    title: { color: "white", marginBottom: "10px" },
    text: { color: "#cbd5e1", marginBottom: "10px" },
    price: { color: "#38bdf8", marginBottom: "15px" },
    button: { width: "100%", padding: "12px", border: "none", borderRadius: "12px", background: "linear-gradient(90deg,#2563eb,#38bdf8)", color: "white", fontWeight: "bold", cursor: "pointer" },
    overlay: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.8)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 999 },
    modal: { background: "#0f172a", padding: "25px", borderRadius: "20px", width: "400px", display: "flex", flexDirection: "column", gap: "12px" },
    modalImage: { width: "100%", height: "200px", borderRadius: "12px", objectFit: "cover" },
    modalTitle: { color: "white" },
    modalInput: { padding: "12px", borderRadius: "10px", border: "none" },
    closeBtn: { width: "100%", padding: "12px", border: "none", borderRadius: "12px", background: "#ef4444", color: "white", fontWeight: "bold", cursor: "pointer" },
};

export default Home;