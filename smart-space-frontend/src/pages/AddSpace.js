import React, { useState } from "react";

import axios from "axios";

import { useNavigate } from "react-router-dom";

function AddSpace() {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [location, setLocation] = useState("");
    const [price, setPrice] = useState("");
    const [image, setImage] = useState("");

    const handleAddSpace = async(e) => {
        e.preventDefault();

        try {
            const res = await axios.post(
                "http://localhost:5000/api/spaces/add", {
                    title,
                    location,
                    price: Number(price),
                    image,
                }
            );

            if (res.data.success) {
                alert("Space Added Successfully ✅");

                navigate("/owner-dashboard");
            } else {
                alert("Failed To Add Space");
            }
        } catch (error) {
            console.log(error);

            alert("Something went wrong");
        }
    };

    return ( <
        div style = { styles.container } >
        <
        div style = { styles.card } >
        <
        h1 style = { styles.heading } >
        Add New Space <
        /h1>

        <
        form onSubmit = { handleAddSpace } >
        <
        input type = "text"
        placeholder = "Space Title"
        value = { title }
        onChange = {
            (e) =>
            setTitle(e.target.value)
        }
        style = { styles.input }
        required /
        >

        <
        input type = "text"
        placeholder = "Location"
        value = { location }
        onChange = {
            (e) =>
            setLocation(e.target.value)
        }
        style = { styles.input }
        required /
        >

        <
        input type = "number"
        placeholder = "Price"
        value = { price }
        onChange = {
            (e) =>
            setPrice(e.target.value)
        }
        style = { styles.input }
        required /
        >

        <
        input type = "text"
        placeholder = "Image URL"
        value = { image }
        onChange = {
            (e) =>
            setImage(e.target.value)
        }
        style = { styles.input }
        required /
        >

        <
        button type = "submit"
        style = { styles.button } >
        Add Space <
        /button> <
        /form> <
        /div> <
        /div>
    );
}

const styles = {
    container: {
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "#0f172a",
        padding: "20px",
    },

    card: {
        width: "400px",
        background: "rgba(255,255,255,0.08)",
        padding: "35px",
        borderRadius: "20px",
        backdropFilter: "blur(10px)",
        boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
    },

    heading: {
        color: "white",
        textAlign: "center",
        marginBottom: "25px",
        fontSize: "32px",
    },

    input: {
        width: "100%",
        padding: "14px",
        marginBottom: "18px",
        borderRadius: "10px",
        border: "none",
        outline: "none",
        fontSize: "16px",
        boxSizing: "border-box",
    },

    button: {
        width: "100%",
        padding: "14px",
        border: "none",
        borderRadius: "10px",
        background: "linear-gradient(to right,#2563eb,#38bdf8)",
        color: "white",
        fontSize: "17px",
        fontWeight: "bold",
        cursor: "pointer",
    },
};

export default AddSpace;