import React, { useEffect, useMemo, useState } from "react";



import axios from "axios";











const toMinutes = (time) => {



    if (!time || !time.includes(":")) return NaN;







    const [hours, minutes] = time.split(":").map(Number);







    return hours * 60 + minutes;



};







function Home() {







    const [spaces, setSpaces] = useState([]);



    const [recommendedSpaces, setRecommendedSpaces] = useState([]);







    const [selectedSpace, setSelectedSpace] = useState(null);







    const [date, setDate] = useState("");



    const [startTime, setStartTime] = useState("");



    const [endTime, setEndTime] = useState("");







    const [query, setQuery] = useState("");



    const [maxPrice, setMaxPrice] = useState("");







    const [reviewRating, setReviewRating] = useState(5);



    const [reviewComment, setReviewComment] = useState("");







    useEffect(() => {



        fetchSpaces();



    }, []);







    const fetchSpaces = async() => {







        try {







            const res = await axios.get(



                "http://localhost:5000/api/spaces"



            );







            const allSpaces = Array.isArray(res.data) ?



                res.data : [];







            setSpaces(allSpaces);







            const smartSorted = [...allSpaces].sort(



                (a, b) => {







                    const ratingA =



                        Number(a.averageRating) || 0;







                    const ratingB =



                        Number(b.averageRating) || 0;







                    const priceA =



                        Number(a.price) || 0;







                    const priceB =



                        Number(b.price) || 0;







                    const scoreA =



                        ratingA * 10 - priceA / 100;







                    const scoreB =



                        ratingB * 10 - priceB / 100;







                    return scoreB - scoreA;



                }



            );







            setRecommendedSpaces(



                smartSorted.slice(0, 3)



            );







        } catch (error) {







            console.log(error);



        }



    };







    // =========================



    // WISHLIST



    // =========================







    const handleAddToWishlist = async(space) => {







        const user = JSON.parse(



            localStorage.getItem("user")



        );







        if (!user) {



            return alert("Please Login First");



        }







        try {







            const res = await axios.post(



                "http://localhost:5000/api/wishlist/add", {



                    userId: user.id || user._id,



                    spaceId: space._id,



                    title: space.title,



                    location: space.location,



                    price: space.price,



                    image: space.image,



                }



            );







            alert(res.data.message);







        } catch (error) {







            console.log(error);







            alert("Failed to add wishlist");



        }



    };







    // =========================



    // FILTER



    // =========================







    const filteredSpaces = useMemo(() => {







        return spaces.filter((space) => {







            const title =



                (space.title || "").toLowerCase();







            const location =



                (space.location || "").toLowerCase();







            const search =



                query.toLowerCase();







            const price =



                Number(space.price) || 0;







            const matchSearch = !search ||



                title.includes(search) ||



                location.includes(search);







            const matchPrice = !maxPrice ||



                price <= Number(maxPrice);







            return matchSearch && matchPrice;



        });







    }, [spaces, query, maxPrice]);







    // =========================



    // BOOKING



    // =========================







    const openBooking = (space) => {







        setSelectedSpace(space);



    };







    const closeBooking = () => {







        setSelectedSpace(null);







        setDate("");



        setStartTime("");



        setEndTime("");







        setReviewRating(5);



        setReviewComment("");



    };







    const handleBooking = async() => {







        const user = JSON.parse(



            localStorage.getItem("user")



        );







        if (!user) {







            return alert("Please Login");



        }







        if (!date || !startTime || !endTime) {







            return alert("Fill all details");



        }







        const startMinutes =



            toMinutes(startTime);







        const endMinutes =



            toMinutes(endTime);







        if (endMinutes <= startMinutes) {







            return alert(



                "End Time must be greater"



            );



        }







        try {







            await axios.post(



                "http://localhost:5000/api/bookings/create", {



                    userId: user.id || user._id,



                    userName: user.name,







                    spaceId: selectedSpace._id,



                    spaceTitle: selectedSpace.title,







                    location: selectedSpace.location,







                    price: selectedSpace.price,







                    date,



                    startTime,



                    endTime,



                }



            );







            alert("Booking Successful 🚀");







            closeBooking();







        } catch (error) {







            console.log(error);







            alert(



                error.response &&



                error.response.data &&



                error.response.data.message ?



                error.response.data.message :



                "Booking Failed"



            );



        }



    };







    // =========================



    // REVIEW



    // =========================







    const handleReview = async() => {







        const user = JSON.parse(



            localStorage.getItem("user")



        );







        if (!user) {



            return alert("Please Login");



        }







        try {







            await axios.post(



                `http://localhost:5000/api/spaces/${selectedSpace._id}/review`, {



                    userId: user.id || user._id,



                    userName: user.name,



                    rating: reviewRating,



                    comment: reviewComment,



                }



            );







            alert("Review Added ⭐");







            fetchSpaces();







            setReviewComment("");



            setReviewRating(5);







        } catch (error) {







            console.log(error);







            alert("Review Failed");



        }



    };







    return (







        <



        div style = { styles.container } >







        { /* HEADER */ }







        <



        header style = { styles.header } >







        <



        h1 style = { styles.heading } >



        Find Perfect Spaces <



        /h1>







        <



        p style = { styles.tagline } >



        AI Smart Recommendations🤖 <



        /p>







        <



        /header>







        { /* SEARCH */ }







        <



        section style = { styles.filterBar } >







        <



        input value = { query }



        onChange = {



            (e) =>



            setQuery(e.target.value)



        }



        placeholder = "Search Space"



        style = { styles.input }



        />







        <



        input type = "number"



        value = { maxPrice }



        onChange = {



            (e) =>



            setMaxPrice(e.target.value)



        }



        placeholder = "Max Price"



        style = { styles.input }



        />







        <



        /section>







        { /* RECOMMENDED */ }







        <



        h2 style = { styles.recommendHeading } > 🤖Recommended Spaces <



        /h2>







        <



        div style = { styles.grid } >







        {



            recommendedSpaces.map((space) => (







                <



                div key = { space._id }



                style = { styles.card } >







                <



                img src = { space.image }



                alt = "space"



                style = { styles.image }



                />







                <



                div style = { styles.cardBody } >







                <



                h2 style = { styles.title } > { space.title } <



                /h2>







                <



                p style = { styles.text } > 📍{ space.location } <



                /p>







                <



                div style = { styles.rating } > ⭐{ space.averageRating || 0 } <



                /div>







                <



                h3 style = { styles.price } > ₹{ space.price } <



                /h3>







                <



                button style = { styles.button }



                onClick = {



                    () =>



                    openBooking(space)



                } >



                Book Recommended <



                /button>







                <



                button style = { styles.wishlistBtn }



                onClick = {



                    () =>



                    handleAddToWishlist(space)



                } > ❤️Add to Wishlist <



                /button>







                <



                /div>







                <



                /div>



            ))



        }







        <



        /div>







        { /* ALL SPACES */ }







        <



        h2 style = { styles.recommendHeading } > 📦All Spaces <



        /h2>







        <



        div style = { styles.grid } >







        {



            filteredSpaces.map((space) => (







                <



                div key = { space._id }



                style = { styles.card } >







                <



                img src = {



                    space.image ||



                    "https://via.placeholder.com/400x200"



                }



                alt = "space"



                style = { styles.image }



                />







                <



                div style = { styles.cardBody } >







                <



                h2 style = { styles.title } > { space.title } <



                /h2>







                <



                p style = { styles.text } > 📍{ space.location } <



                /p>







                <



                div style = { styles.rating } > ⭐{ space.averageRating || 0 } <



                /div>







                <



                h3 style = { styles.price } > ₹{ space.price } <



                /h3>







                <



                button style = { styles.button }



                onClick = {



                    () =>



                    openBooking(space)



                } >



                Book Now <



                /button>







                <



                button style = { styles.wishlistBtn }



                onClick = {



                    () =>



                    handleAddToWishlist(space)



                } > ❤️Add to Wishlist <



                /button>







                <



                /div>







                <



                /div>



            ))



        }







        <



        /div>







        { /* MODAL */ }







        {



            selectedSpace && (







                <



                div style = { styles.overlay } >







                <



                div style = { styles.modal } >







                <



                img src = { selectedSpace.image }



                alt = "space"



                style = { styles.modalImage }



                />







                <



                h2 style = { styles.modalTitle } > { selectedSpace.title } <



                /h2>







                <



                p style = { styles.text } > 📍{ selectedSpace.location } <



                /p>







                <



                h3 style = { styles.price } > ₹{ selectedSpace.price } <



                /h3>







                { /* MAP */ }







                <



                iframe title = "map"



                width = "100%"



                height = "200"



                style = {



                    {



                        borderRadius: "12px",



                        border: "none",



                    }



                }



                src = { `https://maps.google.com/maps?q=${selectedSpace.location}&t=&z=13&ie=UTF8&iwloc=&output=embed` }



                />







                { /* DATE */ }







                <



                input type = "date"



                value = { date }



                min = {



                    new Date()



                    .toISOString()



                    .split("T")[0]



                }



                onChange = {



                    (e) =>



                    setDate(e.target.value)



                }



                style = { styles.modalInput }



                />







                { /* TIME */ }







                <



                input type = "time"



                value = { startTime }



                onChange = {



                    (e) =>



                    setStartTime(e.target.value)



                }



                style = { styles.modalInput }



                />







                <



                input type = "time"



                value = { endTime }



                onChange = {



                    (e) =>



                    setEndTime(e.target.value)



                }



                style = { styles.modalInput }



                />







                <



                button style = { styles.button }



                onClick = { handleBooking } >



                Confirm Booking <



                /button>







                { /* REVIEW */ }







                <



                h2 style = { styles.reviewHeading } >



                Add Review <



                /h2>







                <



                select value = { reviewRating }



                onChange = {



                    (e) =>



                    setReviewRating(



                        Number(e.target.value)



                    )



                }



                style = { styles.modalInput } >



                <



                option value = { 5 } >



                5 Star <



                /option>







                <



                option value = { 4 } >



                4 Star <



                /option>







                <



                option value = { 3 } >



                3 Star <



                /option>







                <



                option value = { 2 } >



                2 Star <



                /option>







                <



                option value = { 1 } >



                1 Star <



                /option>







                <



                /select>







                <



                textarea placeholder = "Write review..."



                value = { reviewComment }



                onChange = {



                    (e) =>



                    setReviewComment(



                        e.target.value



                    )



                }



                style = { styles.textarea }



                />







                <



                button style = { styles.button }



                onClick = { handleReview } >



                Submit Review <



                /button>







                <



                button style = { styles.closeBtn }



                onClick = { closeBooking } >



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



        padding: "30px",



        background: "#020617",



        minHeight: "100vh",



    },







    header: {



        marginBottom: "20px",



    },







    heading: {



        color: "white",



        fontSize: "48px",



        marginBottom: "10px",



    },







    tagline: {



        color: "#94a3b8",



        fontSize: "18px",



    },







    filterBar: {



        display: "grid",



        gridTemplateColumns: "1fr 1fr",



        gap: "15px",



        marginBottom: "25px",



    },







    input: {



        padding: "15px",



        borderRadius: "12px",



        border: "none",



        fontSize: "16px",



    },







    recommendHeading: {



        color: "white",



        marginBottom: "20px",



        marginTop: "10px",



    },







    grid: {



        display: "grid",



        gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",



        gap: "20px",



        marginBottom: "40px",



    },







    card: {



        background: "#0f172a",



        borderRadius: "20px",



        overflow: "hidden",



        border: "1px solid #1e293b",



    },







    image: {



        width: "100%",



        height: "220px",



        objectFit: "cover",



    },







    cardBody: {



        padding: "18px",



    },







    title: {



        color: "white",



        marginBottom: "10px",



    },







    text: {



        color: "#cbd5e1",



        marginBottom: "10px",



    },







    rating: {



        color: "#eab308",



        marginBottom: "10px",



    },







    price: {



        color: "#38bdf8",



        marginBottom: "15px",



    },







    button: {



        width: "100%",



        padding: "12px",



        border: "none",



        borderRadius: "12px",



        background: "linear-gradient(90deg,#2563eb,#38bdf8)",



        color: "white",



        fontWeight: "bold",



        cursor: "pointer",



        marginBottom: "10px",



    },







    wishlistBtn: {



        width: "100%",



        padding: "12px",



        border: "none",



        borderRadius: "12px",



        background: "#475569",



        color: "white",



        fontWeight: "bold",



        cursor: "pointer",



    },







    overlay: {



        position: "fixed",



        top: 0,



        left: 0,



        width: "100%",



        height: "100%",



        background: "rgba(0,0,0,0.8)",



        display: "flex",



        justifyContent: "center",



        alignItems: "center",



        zIndex: 999,



    },







    modal: {



        background: "#0f172a",



        padding: "25px",



        borderRadius: "20px",



        width: "400px",



        display: "flex",



        flexDirection: "column",



        gap: "12px",



        maxHeight: "90vh",



        overflowY: "auto",



    },







    modalImage: {



        width: "100%",



        height: "200px",



        borderRadius: "12px",



        objectFit: "cover",



    },







    modalTitle: {



        color: "white",



    },







    modalInput: {



        padding: "12px",



        borderRadius: "10px",



        border: "none",



    },







    reviewHeading: {



        color: "white",



        marginTop: "10px",



    },







    textarea: {



        padding: "12px",



        borderRadius: "10px",



        border: "none",



        minHeight: "100px",



        resize: "none",



    },







    closeBtn: {



        width: "100%",



        padding: "12px",



        border: "none",



        borderRadius: "12px",



        background: "#ef4444",



        color: "white",



        fontWeight: "bold",



        cursor: "pointer",



    },



};







export default Home;