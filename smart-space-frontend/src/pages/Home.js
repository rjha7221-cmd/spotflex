import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";

const toMinutes = (time) => {
    if (!time || !time.includes(":")) return NaN;
    const [hours, minutes] = time.split(":").map(Number);
    if (Number.isNaN(hours) || Number.isNaN(minutes)) return NaN;
    return hours * 60 + minutes;
};

function Home() {
    const [spaces, setSpaces] = useState([]);
    const [selectedSpace, setSelectedSpace] = useState(null);

    const [date, setDate] = useState("");
    const [startTime, setStartTime] = useState("");
    const [endTime, setEndTime] = useState("");

    const [query, setQuery] = useState("");
    const [maxPrice, setMaxPrice] = useState("");

    const [paymentStep, setPaymentStep] = useState("form");
    const [generatedInvoiceId, setGeneratedInvoiceId] = useState("");
    const [finalCalculatedAmount, setFinalCalculatedAmount] = useState(0);

    // Review System States ⭐
    const [userRating, setUserRating] = useState(5);
    const [userComment, setUserComment] = useState("");

    useEffect(() => {
        fetchSpaces();
    }, []);

    const fetchSpaces = async() => {
        try {
            const res = await axios.get("http://localhost:5000/api/spaces");
            setSpaces(Array.isArray(res.data) ? res.data : []);
        } catch (error) {
            console.log("Error fetching spaces:", error);
        }
    };

    const filteredSpaces = useMemo(() => {
        return spaces.filter((space) => {
            const title = (space.title || "").toLowerCase();
            const location = (space.location || "").toLowerCase();
            const searchText = query.trim().toLowerCase();
            const numericPrice = Number(space.price) || 0;

            const matchesSearch = !searchText || title.includes(searchText) || location.includes(searchText);
            const matchesPrice = !maxPrice || numericPrice <= Number(maxPrice);

            return matchesSearch && matchesPrice;
        });
    }, [spaces, query, maxPrice]);

    const openBooking = (space) => {
        setSelectedSpace(space);
        setPaymentStep("form");
        setUserRating(5);
        setUserComment("");
    };

    const closeBooking = () => {
        setSelectedSpace(null);
        setDate("");
        setStartTime("");
        setEndTime("");
        setPaymentStep("form");
    };

    const startPaymentFlow = (e) => {
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem("user"));

        if (!user) return alert("Please login first");
        if (!date || !startTime || !endTime) return alert("Fill all details");

        const startMinutes = toMinutes(startTime);
        const endMinutes = toMinutes(endTime);
        if (Number.isNaN(startMinutes) || Number.isNaN(endMinutes)) {
            return alert("Invalid time format");
        }
        if (endMinutes <= startMinutes) {
            return alert("End time must be after start time");
        }
        const selectedStartDateTime = new Date(`${date}T${startTime}`);
        if (Number.isNaN(selectedStartDateTime.getTime())) {
            return alert("Invalid date/time selected");
        }
        if (selectedStartDateTime < new Date()) {
            return alert("Past slot booking is not allowed");
        }

        const durationHours = Math.ceil((endMinutes - startMinutes) / 60) || 1;
        const computedTotal = (Number(selectedSpace.price) || 0) * durationHours;

        setFinalCalculatedAmount(computedTotal);
        setGeneratedInvoiceId("INV-" + Math.floor(100000 + Math.random() * 900000));

        setPaymentStep("razorpay");
    };

    const handleFinalBookingAndPayment = async() => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));

            await axios.post("http://localhost:5000/api/bookings/create", {
                userId: user.id,
                userName: user.name,
                spaceId: selectedSpace._id,
                spaceTitle: selectedSpace.title,
                location: selectedSpace.location,
                price: finalCalculatedAmount,
                date,
                startTime,
                endTime,
            });

            setPaymentStep("success");
        } catch (error) {
            console.log(error);
            let message = "Booking creation failed";
            if (error && error.response && error.response.data && error.response.data.message) {
                message = error.response.data.message;
            }
            alert(message);
        }
    };

    const handleReviewSubmit = async(e) => {
        e.preventDefault();
        const user = JSON.parse(localStorage.getItem("user"));

        if (!user) return alert("Please login to submit a review");
        if (!userComment.trim()) return alert("Please write a comment");

        try {
            // 1. Backend API Call
            await axios.post(`http://localhost:5000/api/spaces/${selectedSpace._id}/review`, {
                userId: user.id,
                userName: user.name,
                rating: userRating,
                comment: userComment
            });

            alert("Review added successfully! ⭐");

            // 2. Local State Management Fallback (Instant Real-time Calculation)
            const newReviewLocal = {
                userId: user.id,
                userName: user.name,
                rating: Number(userRating),
                comment: userComment.trim()
            };

            const currentReviews = selectedSpace.reviews || [];
            const updatedReviewsList = [...currentReviews, newReviewLocal];

            // Calculate fresh local average score
            const totalRating = updatedReviewsList.reduce((acc, rev) => acc + (Number(rev.rating) || 0), 0);
            const calculatedAvg = (totalRating / updatedReviewsList.length).toFixed(1);

            const fullyUpdatedSpace = {
                ...selectedSpace,
                reviews: updatedReviewsList,
                averageRating: calculatedAvg
            };

            // 3. Sync state instantly to refresh UI cards and modal pop-up
            setSelectedSpace(fullyUpdatedSpace);
            setSpaces((prevSpaces) =>
                prevSpaces.map((s) => (s._id === selectedSpace._id ? fullyUpdatedSpace : s))
            );

            setUserComment(""); // Input reset
            fetchSpaces(); // Database async background sync

        } catch (error) {
            console.log(error);
            alert("Failed to submit review.");
        }
    };

    const renderFormStep = () => {
        if (paymentStep !== "form") return null;

        const reviewsList = selectedSpace.reviews || [];

        let displayRating = "0.0";
        if (selectedSpace.averageRating && Number(selectedSpace.averageRating) > 0) {
            displayRating = Number(selectedSpace.averageRating).toFixed(1);
        } else if (reviewsList.length > 0) {
            const totalRating = reviewsList.reduce((acc, rev) => acc + (Number(rev.rating) || 0), 0);
            displayRating = (totalRating / reviewsList.length).toFixed(1);
        }

        const mapLat = Number(selectedSpace.lat) || 26.2183;
        const mapLng = Number(selectedSpace.lng) || 78.1828;

        const delta = 0.005;
        const bboxLeft = mapLng - delta;
        const bboxBottom = mapLat - delta;
        const bboxRight = mapLng + delta;
        const bboxTop = mapLat + delta;

        const mapEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${bboxLeft}%2C${bboxBottom}%2C${bboxRight}%2C${bboxTop}&layer=mapnik&marker=${mapLat}%2C${mapLng}`;

        return ( <
            div style = { styles.modal } > { /* 👈 LEFT SIDE: DETAILS & TIMINGS FORM */ } <
            div style = { styles.modalLeft } >
            <
            h2 style = { styles.modalTitle } > { selectedSpace.title } < /h2>  <
            p style = { styles.modalText } > 📍{ selectedSpace.location } < /p>  <
            h3 style = { styles.modalPrice } > ₹{ selectedSpace.price } < span style = {
                { fontSize: "13px", color: "#64748b" } } > / hr</span > < /h3 >

            <
            div style = {
                { color: "#eab308", fontSize: "14px", marginBottom: "12px" } } > ★{ displayRating }({ reviewsList.length }
                reviews) <
            /div>

            <
            label style = { styles.label } > Select Date < /label>  <
            input type = "date"
            min = { new Date().toISOString().split("T")[0] }
            value = { date }
            onChange = {
                (e) => setDate(e.target.value) }
            style = { styles.modalInput }
            />

            <
            label style = { styles.label } > Start Time < /label>  <
            input type = "time"
            value = { startTime }
            onChange = {
                (e) => setStartTime(e.target.value) }
            style = { styles.modalInput }
            />

            <
            label style = { styles.label } > End Time < /label>  <
            input type = "time"
            value = { endTime }
            onChange = {
                (e) => setEndTime(e.target.value) }
            style = { styles.modalInput }
            />

            <
            button style = { styles.payBtn }
            onClick = { startPaymentFlow } >
            Proceed To Payment <
            /button>  <
            button style = { styles.closeBtn }
            onClick = { closeBooking } >
            Cancel <
            /button>  <
            /div>

            { /* 👉 RIGHT SIDE: REVIEWS FEED & REAL-TIME MAP */ } <
            div style = { styles.modalRight } >
            <
            h3 style = { styles.reviewSectionTitle } > User Reviews & Ratings < /h3 >

            <
            form onSubmit = { handleReviewSubmit }
            style = { styles.reviewForm } >
            <
            div style = {
                { display: "flex", alignItems: "center", gap: "10px" } } >
            <
            span style = {
                { color: "#cbd5e1", fontSize: "13px" } } > Your Rating: < /span>  <
            select value = { userRating }
            onChange = {
                (e) => setUserRating(Number(e.target.value)) }
            style = { styles.ratingSelect } >
            <
            option value = "5" > ⭐⭐⭐⭐⭐(5) < /option>  <
            option value = "4" > ⭐⭐⭐⭐(4) < /option>  <
            option value = "3" > ⭐⭐⭐(3) < /option>  <
            option value = "2" > ⭐⭐(2) < /option>  <
            option value = "1" > ⭐(1) < /option>  <
            /select>  <
            /div>  <
            textarea placeholder = "Share your experience about this space..."
            value = { userComment }
            onChange = {
                (e) => setUserComment(e.target.value) }
            style = { styles.reviewTextarea }
            rows = "2" /
            >
            <
            button type = "submit"
            style = { styles.submitReviewBtn } > Submit Review < /button>  <
            /form>

            { /* 🗺️ DYNAMIC MAP ELEMENT */ } <
            div style = { styles.mapWrapper } >
            <
            iframe title = "Space Location Map"
            width = "100%"
            height = "100%"
            style = {
                { border: "none", borderRadius: "12px", background: "#1e293b" } }
            src = { mapEmbedUrl }
            scrolling = "no" >
            < /iframe> <
            /div>

            <
            div style = { styles.reviewsContainer } > {
                reviewsList.length === 0 ? ( <
                    p style = {
                        { color: "#64748b", fontSize: "13px", textAlign: "center", marginTop: "10px" } } >
                    No reviews yet.Be the first to share your experience!
                    <
                    /p>
                ) : (
                    reviewsList.map((rev, index) => ( <
                        div key = { index }
                        style = { styles.reviewItem } >
                        <
                        div style = {
                            { display: "flex", justifyContent: "space-between", marginBottom: "4px" } } >
                        <
                        strong style = {
                            { color: "#e2e8f0", fontSize: "13px" } } > { rev.userName } < /strong>  <
                        span style = {
                            { color: "#eab308", fontSize: "12px" } } > { "★".repeat(rev.rating) } < /span>  <
                        /div>  <
                        p style = {
                            { color: "#94a3b8", fontSize: "12px", margin: 0 } } > { rev.comment } < /p>  <
                        /div>
                    ))
                )
            } <
            /div>  <
            /div>  <
            /div>
        );
    };

    const renderRazorpayStep = () => {
        if (paymentStep !== "razorpay") return null;
        return ( <
            div style = { styles.razorpayBox } >
            <
            div style = { styles.razorpayHeader } >
            <
            div >
            <
            h4 style = { styles.rpBrand } > SpotFlex Payments < /h4>  <
            p style = { styles.rpSub } > Amount to Pay: < b > ₹{ finalCalculatedAmount } < /b></p >
            <
            /div>  <
            div style = { styles.rpLogo } > R < /div>  <
            /div>

            <
            div style = { styles.rpBody } >
            <
            p style = { styles.rpPaymentMethodTitle } > Cards, UPI & More(Simulation) < /p>  <
            div style = { styles.rpMethodDummy } >
            <
            input type = "radio"
            checked readOnly style = {
                { marginRight: "10px" } }
            />  <
            span > Test Mode Token Gateway(Immediate Authorization) < /span>  <
            /div>  <
            p style = { styles.rpWarning } > ⚠️Simulated testing safe environment sandbox sandbox verified. < /p>  <
            /div>

            <
            div style = { styles.rpFooter } >
            <
            button onClick = { handleFinalBookingAndPayment }
            style = { styles.rpPayNowBtn } >
            Pay Now(₹{ finalCalculatedAmount }) <
            /button>  <
            button onClick = {
                () => setPaymentStep("form") }
            style = { styles.rpCancelBtn } >
            Abort Payment <
            /button>  <
            /div>  <
            /div>
        );
    };

    const renderSuccessStep = () => {
        if (paymentStep !== "success") return null;
        return ( <
            div style = { styles.invoiceCard } >
            <
            div style = { styles.successBadge } >
            <
            span style = { styles.checkIcon } > ✓ < /span>  <
            /div>  <
            h2 style = { styles.successHeading } > Booking Successful! < /h2>  <
            p style = { styles.successSub } > Your slot has been reserved into the centralized cluster platform core index. < /p>

            <
            hr style = { styles.divider }
            />

            <
            div style = { styles.invoiceDetails } >
            <
            h4 style = { styles.invoiceTitle } > OFFICIAL BILLING INVOICE < /h4>  <
            div style = { styles.invoiceRow } >
            <
            span > Invoice Token: < /span>  <
            strong > { generatedInvoiceId } < /strong>  <
            /div>  <
            div style = { styles.invoiceRow } >
            <
            span > Target Spot: < /span>  <
            span > { selectedSpace.title } < /span>  <
            /div>  <
            div style = { styles.invoiceRow } >
            <
            span > Reservation Date: < /span>  <
            span > { date } < /span>  <
            /div>  <
            div style = { styles.invoiceRow } >
            <
            span > Allocated Time Window: < /span>  <
            span > { startTime } - { endTime } < /span>  <
            /div>  <
            div style = { styles.invoiceRow } >
            <
            span > Payment Gateway Status: < /span>  <
            span style = { styles.paidTag } > PAID < /span>  <
            /div>

            <
            hr style = { styles.divider }
            />

            <
            div style = { styles.invoiceTotalRow } >
            <
            span > Total Settled Fees: < /span>  <
            span style = { styles.finalAmount } > ₹{ finalCalculatedAmount } < /span>  <
            /div>  <
            /div>

            <
            button onClick = { closeBooking }
            style = { styles.homeBackBtn } >
            Close & Return To Home <
            /button>  <
            /div>
        );
    };

    return ( <
        div style = { styles.container } >
        <
        header style = { styles.header } >
        <
        h1 style = { styles.heading } > Find your perfect short - term space < /h1>  <
        p style = { styles.tagline } > Browse available places and reserve in just a few clicks. < /p>  <
        /header>

        <
        section style = { styles.filterBar } >
        <
        input value = { query }
        onChange = {
            (e) => setQuery(e.target.value) }
        placeholder = "Search by title or location"
        style = { styles.input }
        />  <
        input type = "number"
        min = "0"
        value = { maxPrice }
        onChange = {
            (e) => setMaxPrice(e.target.value) }
        placeholder = "Max price"
        style = { styles.input }
        />  <
        button style = { styles.clearBtn }
        onClick = {
            () => { setQuery("");
                setMaxPrice(""); } } >
        Clear <
        /button>  <
        /section>

        <
        p style = { styles.countText } > { filteredSpaces.length }
        space(s) found < /p>

        <
        div style = { styles.grid } > {
            filteredSpaces.map((space) => ( <
                div key = { space._id }
                style = { styles.card } >
                <
                img src = { space.image || "https://via.placeholder.com/500x280" }
                alt = "space"
                style = { styles.image }
                />  <
                div style = { styles.cardBody } >
                <
                h2 style = { styles.title } > { space.title || "Space" } < /h2>  <
                p style = { styles.text } > 📍{ space.location || "Location" } < /p>

                { /* ⭐ Dynamic Cards Star Score Fallback */ } <
                div style = {
                    { color: "#eab308", fontSize: "13px", marginBottom: "8px" } } > ★{
                    space.averageRating && Number(space.averageRating) > 0 ?
                    Number(space.averageRating).toFixed(1) :
                        (space.reviews && space.reviews.length > 0 ?
                        (space.reviews.reduce((acc, r) => acc + (Number(r.rating) || 0), 0) / space.reviews.length).toFixed(1) :
                        "0.0")
                }({ space.reviews ? space.reviews.length : 0 }) <
                /div>

                <
                h3 style = { styles.price } > ₹{ space.price || 0 } < /h3>  <
                button style = { styles.button }
                onClick = {
                    () => openBooking(space) } >
                Book Now <
                /button>  <
                /div>  <
                /div>
            ))
        } <
        /div>

        {
            !filteredSpaces.length && ( <
                div style = { styles.emptyState } >
                <
                h3 style = { styles.emptyTitle } > No spaces match your search < /h3>  <
                p style = { styles.emptyText } > Try a different keyword or increase the max price. < /p>  <
                /div>
            )
        }

        {
            selectedSpace && ( <
                div style = { styles.overlay } > { renderFormStep() } { renderRazorpayStep() } { renderSuccessStep() } <
                /div>
            )
        } <
        /div>
    );
}

const styles = {
    container: {
        padding: "30px 24px 44px",
        minHeight: "100vh",
        maxWidth: "1200px",
        margin: "0 auto",
    },
    header: { marginBottom: "18px" },
    heading: { color: "#f8fafc", fontSize: "clamp(28px,4vw,42px)", marginBottom: "8px" },
    tagline: { color: "#94a3b8" },
    filterBar: {
        marginTop: "16px",
        marginBottom: "14px",
        display: "grid",
        gridTemplateColumns: "2fr 1fr auto",
        gap: "10px",
    },
    input: {
        padding: "12px",
        borderRadius: "10px",
        border: "1px solid rgba(148,163,184,0.35)",
        background: "rgba(15,23,42,0.65)",
        color: "#f8fafc",
    },
    clearBtn: {
        border: "1px solid rgba(148,163,184,0.35)",
        background: "transparent",
        color: "#e2e8f0",
        borderRadius: "10px",
        padding: "0 14px",
        fontWeight: 700,
    },
    countText: { color: "#cbd5e1", marginBottom: "12px", fontSize: "14px" },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(250px,1fr))",
        gap: "16px",
        marginTop: "8px",
    },
    card: {
        background: "rgba(15,23,42,0.62)",
        border: "1px solid rgba(148,163,184,0.2)",
        borderRadius: "16px",
        overflow: "hidden",
        boxShadow: "0 14px 30px rgba(2,6,23,0.28)",
    },
    image: { width: "100%", height: "180px", objectFit: "cover" },
    cardBody: { padding: "14px" },
    title: { color: "#f8fafc", marginBottom: "6px" },
    text: { color: "#94a3b8", marginBottom: "8px" },
    price: { color: "#7dd3fc", marginBottom: "10px" },
    button: {
        width: "100%",
        background: "linear-gradient(90deg,#2563eb,#38bdf8)",
        color: "white",
        border: "none",
        padding: "10px 14px",
        borderRadius: "10px",
        fontWeight: 700,
        cursor: "pointer",
    },
    emptyState: {
        marginTop: "20px",
        textAlign: "center",
        border: "1px dashed rgba(148,163,184,0.35)",
        borderRadius: "14px",
        padding: "22px",
        background: "rgba(15,23,42,0.4)",
    },
    emptyTitle: { color: "#e2e8f0", marginBottom: "6px" },
    emptyText: { color: "#94a3b8" },
    overlay: {
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: "rgba(2,6,23,0.76)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: "20px",
        zIndex: 2000,
    },
    modal: {
        background: "#0f172a",
        border: "1px solid rgba(148,163,184,0.28)",
        padding: "24px",
        borderRadius: "16px",
        width: "min(850px, 100%)",
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "24px",
        maxHeight: "90vh",
        overflowY: "auto"
    },
    modalLeft: { display: "flex", flexDirection: "column", gap: "6px" },
    modalRight: { borderLeft: "1px solid rgba(148,163,184,0.15)", paddingLeft: "20px", display: "flex", flexDirection: "column" },
    modalTitle: { color: "#f8fafc", margin: 0 },
    modalText: { color: "#94a3b8", margin: "4px 0" },
    modalPrice: { color: "#7dd3fc", margin: "4px 0" },
    label: { color: "#cbd5e1", fontSize: "12px", marginTop: "4px" },
    modalInput: {
        padding: "9px",
        borderRadius: "8px",
        border: "1px solid rgba(148,163,184,0.35)",
        background: "#0b122e",
        color: "#f8fafc",
        marginBottom: "4px"
    },
    payBtn: {
        background: "#2563eb",
        color: "white",
        border: "none",
        padding: "11px",
        borderRadius: "8px",
        fontWeight: 700,
        marginTop: "14px",
        cursor: "pointer",
    },
    closeBtn: {
        background: "transparent",
        color: "#ef4444",
        border: "1px solid #ef4444",
        padding: "11px",
        borderRadius: "8px",
        fontWeight: 700,
        marginTop: "4px",
        cursor: "pointer",
    },
    mapWrapper: {
        width: "100%",
        height: "180px",
        minHeight: "180px",
        borderRadius: "12px",
        overflow: "hidden",
        marginTop: "10px",
        marginBottom: "14px",
        border: "1px solid rgba(148, 163, 184, 0.3)",
        zIndex: 10,
        display: "block",
        position: "relative"
    },
    reviewSectionTitle: { color: "#f8fafc", marginTop: 0, marginBottom: "12px", fontSize: "16px" },
    reviewForm: { display: "flex", flexDirection: "column", gap: "8px", marginBottom: "4px" },
    ratingSelect: { background: "#0b122e", color: "#f8fafc", border: "1px solid rgba(148,163,184,0.3)", padding: "5px", borderRadius: "6px" },
    reviewTextarea: {
        background: "#0b122e",
        color: "#f8fafc",
        border: "1px solid rgba(148,163,184,0.3)",
        padding: "8px",
        borderRadius: "6px",
        fontSize: "13px",
        resize: "none"
    },
    submitReviewBtn: {
        background: "#2563eb",
        color: "white",
        border: "none",
        padding: "8px",
        borderRadius: "6px",
        fontWeight: "bold",
        fontSize: "12px",
        cursor: "pointer",
        alignSelf: "flex-end"
    },
    reviewsContainer: { display: "flex", flexDirection: "column", gap: "8px", overflowY: "auto", maxHeight: "150px", paddingRight: "4px" },
    reviewItem: { background: "rgba(30,41,59,0.5)", border: "1px solid rgba(148,163,184,0.1)", padding: "10px", borderRadius: "8px" },
    razorpayBox: { background: "#ffffff", width: "100%", maxWidth: "360px", borderRadius: "8px", overflow: "hidden", boxShadow: "0 20px 40px rgba(0,0,0,0.4)", color: "#333" },
    razorpayHeader: { background: "#19224d", color: "#fff", padding: "20px", display: "flex", justifyContent: "space-between", alignItems: "center" },
    rpBrand: { margin: 0, fontSize: "16px", fontWeight: "600", color: "#ffffff" },
    rpSub: { margin: "4px 0 0 0", fontSize: "13px", color: "#cbd5e1" },
    rpLogo: { background: "#3399cc", color: "#ffffff", width: "35px", height: "35px", borderRadius: "4px", display: "grid", placeItems: "center", fontWeight: "bold", fontSize: "18px" },
    rpBody: { padding: "20px", background: "#f8fafc" },
    rpPaymentMethodTitle: { fontSize: "12px", fontWeight: "700", color: "#64748b", textTransform: "uppercase", marginBottom: "12px" },
    rpMethodDummy: { display: "flex", alignItems: "center", padding: "14px", background: "#fff", border: "1px solid #e2e8f0", borderRadius: "6px", fontSize: "14px", fontWeight: "600", color: "#1e293b" },
    rpWarning: { fontSize: "11px", color: "#b45309", marginTop: "15px", background: "#fef3c7", padding: "8px", borderRadius: "4px", lineHeight: "1.4" },
    rpFooter: { padding: "15px", background: "#fff", display: "flex", flexDirection: "column", gap: "8px", borderTop: "1px solid #edf2f7" },
    rpPayNowBtn: { background: "#3399cc", color: "#fff", border: "none", padding: "12px", borderRadius: "4px", fontWeight: "700", cursor: "pointer", fontSize: "14px" },
    rpCancelBtn: { background: "none", border: "none", color: "#a0aec0", cursor: "pointer", fontSize: "12px", padding: "5px" },
    invoiceCard: { background: "#ffffff", color: "#1e293b", borderRadius: "20px", padding: "30px", width: "100%", maxWidth: "400px", boxShadow: "0 10px 25px rgba(0,0,0,0.3)", textAlign: "center" },
    successBadge: { width: "60px", height: "60px", background: "#dcfce7", borderRadius: "50%", display: "grid", placeItems: "center", margin: "0 auto 15px auto" },
    checkIcon: { color: "#15803d", fontSize: "28px", fontWeight: "bold" },
    successHeading: { fontSize: "24px", color: "#16a34a", margin: "0 0 5px 0", fontWeight: "700" },
    successSub: { color: "#64748b", fontSize: "13px", margin: "0 0 20px 0", lineHeight: "1.4" },
    divider: { border: "none", borderTop: "1px dashed #cbd5e1", margin: "15px 0" },
    invoiceDetails: { textAlign: "left" },
    invoiceTitle: { fontSize: "12px", color: "#94a3b8", letterSpacing: "1px", margin: "0 0 12px 0", fontWeight: "bold" },
    invoiceRow: { display: "flex", justifyContent: "space-between", fontSize: "14px", margin: "8px 0", color: "#334155" },
    paidTag: { background: "#22c55e", color: "#fff", padding: "2px 8px", borderRadius: "4px", fontSize: "11px", fontWeight: "bold" },
    invoiceTotalRow: { display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "10px" },
    finalAmount: { fontSize: "22px", fontWeight: "800", color: "#0f172a" },
    homeBackBtn: { marginTop: "25px", width: "100%", background: "#0f172a", color: "#fff", border: "none", padding: "12px", borderRadius: "10px", fontWeight: "bold", cursor: "pointer" }
};

export default Home;