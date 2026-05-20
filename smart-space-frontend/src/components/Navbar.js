import React from "react";

import { Link, useNavigate } from "react-router-dom";

function Navbar() {
    const navigate = useNavigate();

    let user = null;

    try {
        const storedUser =
            localStorage.getItem("user");

        if (
            storedUser &&
            storedUser !== "undefined"
        ) {
            user =
                JSON.parse(storedUser);
        }
    } catch (error) {
        console.log(error);

        localStorage.removeItem(
            "user"
        );
    }

    const logout = () => {
        localStorage.removeItem(
            "user"
        );

        navigate("/");
    };

    return ( <
        nav style = {
            {
                background: "#081028",
                padding: "15px 40px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
            }
        } >
        <
        h1 style = {
            {
                color: "#38bdf8",
                fontSize: "40px",
                fontWeight: "bold",
            }
        } >
        SpotFlex <
        /h1>

        <
        div style = {
            {
                display: "flex",
                gap: "20px",
                alignItems: "center",
            }
        } >
        <
        Link to = "/"
        style = { styles.link } >
        Home <
        /Link>

        {
            user && ( <
                >
                <
                Link to = "/my-bookings"
                style = { styles.link } >
                My Bookings <
                /Link>

                <
                button onClick = { logout }
                style = { styles.logout } >
                Logout <
                /button> <
                />
            )
        }

        {
            !user && ( <
                >
                <
                Link to = "/login"
                style = { styles.link } >
                User Login <
                /Link>

                <
                Link to = "/owner-login"
                style = { styles.link } >
                Owner Login <
                /Link> <
                />
            )
        } <
        /div> <
        /nav>
    );
}

const styles = {
    link: {
        color: "white",
        textDecoration: "none",
        fontSize: "18px",
        fontWeight: "500",
    },

    logout: {
        background: "linear-gradient(to right,#2563eb,#38bdf8)",
        border: "none",
        color: "white",
        padding: "10px 18px",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "bold",
    },
};

export default Navbar;