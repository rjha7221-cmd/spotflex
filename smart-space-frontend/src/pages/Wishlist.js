import React, { useEffect, useState } from "react";
import axios from "axios";

function Wishlist() {
    const [wishlist, setWishlist] = useState([]);
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        fetchWishlist();
    }, []);

    // Function ke andar user ko access karo
    const fetchWishlist = async() => {
        const userData = JSON.parse(localStorage.getItem("user"));
        if (!userData) return;
        try {
            const res = await axios.get(`http://localhost:5000/api/wishlist/${userData.id || userData._id}`);
            setWishlist(res.data);
        } catch (error) {
            console.error("Error:", error);
        }
    };

    const removeWishlist = async(spaceId) => {
        if (!user) return;
        try {
            await axios.delete(`http://localhost:5000/api/wishlist/${user.id || user._id}/${spaceId}`);
            // Remove locally after deleting from DB
            setWishlist(wishlist.filter((item) => item.spaceId !== spaceId));
            alert("Removed from Wishlist");
        } catch (error) {
            console.error("Error removing item:", error);
        }
    };
    console.log("Database se aaya data:", wishlist);

    return ( <
            div style = { styles.container } >
            <
            h1 style = { styles.heading } > ❤️My Wishlist < /h1> {
            wishlist.length === 0 ? ( <
                p style = { styles.empty } > No spaces in wishlist < /p>
            ) : ( <
                div style = { styles.grid } > {
                    wishlist.map((space) => ( <
                        div key = { space._id }
                        style = { styles.card } >
                        <
                        img src = { space.image }
                        alt = "space"
                        style = { styles.image }
                        /> <
                        div style = { styles.cardBody } >
                        <
                        h2 style = { styles.title } > { space.title } < /h2> <
                        p style = { styles.text } > 📍{ space.location } < /p> <
                        h3 style = { styles.price } > ₹{ space.price } < /h3> <
                        button style = { styles.removeBtn }
                        onClick = {
                            () => removeWishlist(space.spaceId)
                        } >
                        Remove <
                        /button> < /
                        div > <
                        /div>
                    ))
                } <
                /div>
            )
        } <
        /div>
);
}
const styles = {
    container: {
        minHeight: "100vh",
        background: "#020617",
        padding: "30px",
    },

    heading: {
        color: "white",
        marginBottom: "30px",
        fontSize: "40px",
    },

    empty: {
        color: "#94a3b8",
        fontSize: "20px",
    },

    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))",
        gap: "20px",
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

    price: {
        color: "#38bdf8",
        marginBottom: "15px",
    },

    removeBtn: {
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

export default Wishlist;