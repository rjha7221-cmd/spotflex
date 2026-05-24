import React, {
    useEffect,
    useState,
    useContext
} from "react";

import axios from "axios";

import {
    useNavigate
} from "react-router-dom";

import { ThemeContext } from "../context/ThemeContext";

function OwnerDashboard() {

    const navigate = useNavigate();
    const { theme } = useContext(ThemeContext);

    const [spaces, setSpaces] = useState([]);
    const [editingSpace, setEditingSpace] = useState(null);
    const [title, setTitle] = useState("");
    const [location, setLocation] = useState("");
    const [price, setPrice] = useState("");
    const [image, setImage] = useState("");
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        fetchSpaces();
        fetchBookings();
    }, []);

    const fetchSpaces = async() => {
        try {
            const res = await axios.get("http://localhost:5000/api/spaces");
            setSpaces(res.data);
        } catch (error) {
            console.log(error);
        }
    };

    const totalEarning = bookings.reduce((sum, booking) => {
        if (booking.status !== "cancelled") {
            if (booking.spacePrice) {
                return sum + Number(booking.spacePrice);
            }
            return sum + (Number(booking.price) || 0);
        }
        return sum;
    }, 0);

    const getMonthlyData = () => {
        const monthsOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const monthlyEarnings = monthsOrder.reduce((acc, month) => {
            acc[month] = 0;
            return acc;
        }, {});

        bookings.forEach((booking) => {
            if (booking.status !== "cancelled") {
                const rawDate = booking.createdAt || booking.date || booking.bookingDate || booking.startDate;

                if (rawDate) {
                    const bookingDate = new Date(rawDate);
                    if (!isNaN(bookingDate.getTime())) {
                        const monthName = monthsOrder[bookingDate.getMonth()];
                        const amount = booking.spacePrice ? Number(booking.spacePrice) : (Number(booking.price) || 0);
                        monthlyEarnings[monthName] += amount;
                    }
                }
            }
        });

        return monthsOrder.map(month => ({
            month: month,
            earning: monthlyEarnings[month]
        }));
    };

    const graphData = getMonthlyData();
    const maxEarning = Math.max(...graphData.map(d => d.earning), 1000);

    const fetchBookings = async() => {
        try {
            const res = await axios.get("http://localhost:5000/api/bookings");
            console.log("Owner Dashboard Bookings Data:", res.data);
            setBookings(res.data);
        } catch (error) {
            console.log("Bookings fetch karne me error:", error);
        }
    };

    const deleteSpace = async(id) => {
        try {
            await axios.delete(`http://localhost:5000/api/spaces/${id}`);
            alert("Space Deleted 🚀");
            fetchSpaces();
        } catch (error) {
            console.log(error);
            alert("Delete Failed");
        }
    };

    const openEdit = (space) => {
        setEditingSpace(space);
        setTitle(space.title);
        setLocation(space.location);
        setPrice(space.price);
        setImage(space.image);
    };

    const updateSpace = async() => {
        try {
            await axios.put(`http://localhost:5000/api/spaces/${editingSpace._id}`, { title, location, price, image });
            alert("Space Updated 🚀");
            setEditingSpace(null);
            fetchSpaces();
        } catch (error) {
            console.log(error);
            alert("Update Failed");
        }
    };

    // Style overrides dynamically using theme context
    const containerStyle = {...styles.container, background: theme.background };
    const titleStyle = {...styles.title, color: theme.text };
    const graphContainerStyle = {
        ...styles.graphContainer,
        background: theme.containerBg,
        border: `1px solid ${theme.border}`,
        boxShadow: theme.shadow
    };
    const graphTitleStyle = {...styles.graphTitle, color: theme.text };
    const graphLabelStyle = {...styles.graphLabel, color: theme.subText };
    const cardStyle = {...styles.card, background: theme.cardBg, boxShadow: theme.shadow, border: `1px solid ${theme.border}` };
    const cardBodyStyle = {...styles.cardBody, color: theme.text };

    return ( <
        div style = { containerStyle } >

        <
        h1 style = { titleStyle } >
        Owner Dashboard <
        /h1>

        <
        div style = { styles.topCards } >
        <
        div style = { styles.analyticsCard } >
        <
        h2 > Total Spaces < /h2>  <
        h1 > { spaces.length } < /h1>  <
        /div>

        <
        div style = { styles.analyticsCard } >
        <
        h2 > Total Bookings < /h2>  <
        h1 > { bookings.length } < /h1>  <
        /div>

        <
        div style = { styles.earningCard } >
        <
        h2 > Total Earning < /h2>  <
        h1 > ₹{ totalEarning } < /h1>  <
        /div> <
        /div>

        { /* Monthly Earning Graph Section */ } <
        div style = { graphContainerStyle } >
        <
        h2 style = { graphTitleStyle } > Monthly Earning Analysis < /h2>  <
        div style = {
            {...styles.graphWrapper, borderBottom: `2px solid ${theme.border}` } } > {
            graphData.map((data, index) => {
                const barHeight = `${(data.earning / maxEarning) * 160}px`;
                // Background condition logic simplified here to fix parsing issue
                const barBackground = data.earning > 0 ?
                    "linear-gradient(to top, #2563eb, #38bdf8)" :
                    (theme.isDarkMode ? "rgba(255,255,255,0.1)" : "#cbd5e1");

                return ( <
                    div key = { index }
                    style = { styles.graphColumn } >
                    <
                    div style = { styles.tooltip } > ₹{ data.earning } < /div>  <
                    div style = {
                        {
                            ...styles.graphBar,
                                height: data.earning > 0 ? barHeight : "4px",
                                background: barBackground
                        }
                    }
                    />  <
                    span style = { graphLabelStyle } > { data.month } < /span>  <
                    /div>
                );
            })
        } <
        /div>  <
        /div>

        <
        button style = { styles.addButton }
        onClick = {
            () => navigate("/add-space") } >
        +Add New Space <
        /button>

        <
        div style = { styles.grid } > {
            spaces.map((space) => ( <
                div key = { space._id }
                style = { cardStyle } >
                <
                img src = { space.image ? space.image : "https://via.placeholder.com/300" }
                alt = "space"
                style = { styles.image }
                />

                <
                div style = { cardBodyStyle } >
                <
                h2 style = {
                    { color: theme.text, margin: "0 0 10px 0" } } > { space.title } < /h2>  <
                p style = {
                    { color: theme.subText } } > 📍{ space.location } < /p>  <
                h3 style = {
                    { color: theme.text } } > ₹{ space.price } < /h3>

                <
                button style = { styles.editButton }
                onClick = {
                    () => openEdit(space) } > Edit < /button> <
                button style = { styles.deleteButton }
                onClick = {
                    () => deleteSpace(space._id) } > Delete < /button>  <
                /div>  <
                /div>
            ))
        } <
        /div>

        {
            editingSpace && ( <
                div style = { styles.modal } >
                <
                div style = { styles.modalContent } >
                <
                h2 > Edit Space < /h2> <
                input value = { title }
                onChange = {
                    (e) => setTitle(e.target.value) }
                placeholder = "Title"
                style = { styles.input }
                /> <
                input value = { location }
                onChange = {
                    (e) => setLocation(e.target.value) }
                placeholder = "Location"
                style = { styles.input }
                /> <
                input value = { price }
                onChange = {
                    (e) => setPrice(e.target.value) }
                placeholder = "Price"
                style = { styles.input }
                /> <
                input value = { image }
                onChange = {
                    (e) => setImage(e.target.value) }
                placeholder = "Image URL"
                style = { styles.input }
                /> <
                button style = { styles.saveButton }
                onClick = { updateSpace } > Save Changes < /button> <
                button style = { styles.cancelButton }
                onClick = {
                    () => setEditingSpace(null) } > Cancel < /button>  <
                /div>  <
                /div>
            )
        } <
        /div>
    );
}

const styles = {
    container: { padding: "40px", minHeight: "100vh", transition: "background 0.3s ease" },
    title: { marginBottom: "30px", fontSize: "40px", fontWeight: "bold" },
    topCards: { display: "flex", gap: "20px", flexWrap: "wrap", marginBottom: "30px" },
    analyticsCard: { flex: 1, minWidth: "250px", background: "linear-gradient(to right,#2563eb,#38bdf8)", padding: "30px", borderRadius: "20px", color: "white" },
    earningCard: { flex: 1, minWidth: "250px", background: "linear-gradient(to right, #2563eb, #38bdf8)", padding: "30px", borderRadius: "20px", color: "white" },
    graphContainer: { borderRadius: "20px", padding: "25px", marginBottom: "35px", transition: "all 0.3s ease" },
    graphTitle: { fontSize: "20px", marginBottom: "25px", fontWeight: "600" },
    graphWrapper: { display: "flex", justifyContent: "space-between", alignItems: "flex-end", height: "240px", padding: "10px 10px 0 10px", gap: "10px", overflowX: "auto" },
    graphColumn: { display: "flex", flexDirection: "column", alignItems: "center", flex: 1, minWidth: "45px", position: "relative", cursor: "pointer" },
    graphBar: { width: "60%", borderRadius: "6px 6px 0 0", transition: "all 0.3s ease", boxShadow: "0 4px 15px rgba(37,99,235,0.15)" },
    graphLabel: { fontSize: "13px", marginTop: "12px", fontWeight: "500" },
    tooltip: { color: "#38bdf8", fontSize: "12px", fontWeight: "bold", marginBottom: "6px", whiteSpace: "nowrap" },
    addButton: { background: "linear-gradient(to right,#2563eb,#38bdf8)", color: "white", border: "none", padding: "15px 25px", borderRadius: "12px", fontSize: "16px", fontWeight: "bold", marginBottom: "30px", cursor: "pointer" },
    grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "30px" },
    card: { borderRadius: "20px", overflow: "hidden", backdropFilter: "blur(10px)", transition: "all 0.3s ease" },
    image: { width: "100%", height: "220px", objectFit: "cover" },
    cardBody: { padding: "20px" },
    editButton: { marginTop: "15px", width: "100%", background: "#2563eb", color: "white", border: "none", padding: "12px", borderRadius: "10px", fontWeight: "bold", cursor: "pointer" },
    deleteButton: { marginTop: "15px", width: "100%", background: "red", color: "white", border: "none", padding: "12px", borderRadius: "10px", fontWeight: "bold", cursor: "pointer" },
    modal: { position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.7)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 2000 },
    modalContent: { background: "white", padding: "30px", borderRadius: "20px", width: "400px", display: "flex", flexDirection: "column", gap: "15px" },
    input: { padding: "12px", borderRadius: "10px", border: "1px solid #ddd" },
    saveButton: { background: "#2563eb", color: "white", border: "none", padding: "12px", borderRadius: "10px", fontWeight: "bold", cursor: "pointer" },
    cancelButton: { background: "red", color: "white", border: "none", padding: "12px", borderRadius: "10px", fontWeight: "bold", cursor: "pointer" }
};

export default OwnerDashboard;