import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext"; // Context import kiya

function Navbar() {
    const navigate = useNavigate();
    const { theme, toggleTheme } = useContext(ThemeContext); // Theme variables destructure kiye
    const user = JSON.parse(localStorage.getItem("user"));

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/");
    };

    // Dynamic Styles override configuration 
    const navbarStyle = {
        ...styles.navbar,
        background: theme.isDarkMode ? "rgba(8, 13, 33, 0.8)" : "rgba(255, 255, 255, 0.85)",
        borderBottom: `1px solid ${theme.border}`
    };
    const logoStyle = {...styles.logo, color: theme.text };
    const linkStyle = {...styles.link, color: theme.isDarkMode ? "#cbd5e1" : "#475569" };
    const userTextStyle = {...styles.userText, color: theme.subText };
    const secondaryBtnStyle = {
        ...styles.secondaryBtn,
        color: theme.isDarkMode ? "#e2e8f0" : "#334155",
        border: `1px solid ${theme.border}`
    };

    return ( <
        div style = { navbarStyle } >
        <
        Link to = "/"
        style = { styles.brandWrap } >
        <
        div style = { styles.logoDot } > S < /div> <
        h1 style = { logoStyle } > SpotFlex < /h1> <
        /Link>

        <
        div style = { styles.links } >
        <
        Link to = "/"
        style = { linkStyle } >
        Landing <
        /Link> <
        Link to = "/home"
        style = { linkStyle } >
        Spaces <
        /Link> {
            user && ( <
                Link to = "/my-bookings"
                style = { linkStyle } >
                My Bookings <
                /Link>
            )
        } {
            user && user.role === "owner" && ( <
                Link to = "/owner-dashboard"
                style = { linkStyle } >
                Owner Dashboard <
                /Link>
            )
        }

        { /* Dynamic Light/Dark Mode Toggle Button */ } <
        button onClick = { toggleTheme }
        style = { styles.toggleBtn } > { theme.isDarkMode ? "☀️ Light" : "🌙 Dark" } <
        /button>

        {
            user ? ( <
                >
                <
                span style = { userTextStyle } > Hi, { user.name || "User" } < /span> <
                button onClick = { handleLogout }
                style = { styles.button } >
                Logout <
                /button> <
                />
            ) : ( <
                >
                <
                Link to = "/user-login"
                style = { secondaryBtnStyle } >
                User Login <
                /Link> <
                Link to = "/owner-login"
                style = { styles.buttonLink } >
                Owner Login <
                /Link> <
                />
            )
        } <
        /div> <
        /div>
    );
}

const styles = {
    navbar: {
        backdropFilter: "blur(14px)",
        padding: "14px 26px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        flexWrap: "wrap",
        gap: "14px",
        transition: "all 0.3s ease",
    },
    brandWrap: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        textDecoration: "none",
    },
    logoDot: {
        width: "34px",
        height: "34px",
        borderRadius: "10px",
        background: "linear-gradient(135deg,#38bdf8,#6366f1)",
        color: "#fff",
        display: "grid",
        placeItems: "center",
        fontWeight: 800,
    },
    logo: {
        fontSize: "24px",
        fontWeight: 800,
        letterSpacing: "0.5px",
        margin: 0,
    },
    links: {
        display: "flex",
        alignItems: "center",
        gap: "14px",
        flexWrap: "wrap",
    },
    link: {
        fontWeight: 600,
        fontSize: "14px",
        textDecoration: "none",
        transition: "color 0.2s ease",
    },
    userText: {
        fontSize: "14px",
        marginLeft: "8px",
        fontWeight: "500",
    },
    toggleBtn: {
        background: "rgba(255, 255, 255, 0.1)",
        border: "1px solid rgba(148,163,184,0.2)",
        color: "inherit",
        padding: "8px 14px",
        borderRadius: "10px",
        fontWeight: 600,
        cursor: "pointer",
        fontSize: "13px",
        display: "flex",
        alignItems: "center",
        gap: "5px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
        transition: "transform 0.2s ease",
    },
    button: {
        background: "linear-gradient(90deg,#2563eb,#38bdf8)",
        color: "white",
        border: "none",
        padding: "8px 14px",
        borderRadius: "10px",
        fontWeight: 700,
        cursor: "pointer",
    },
    buttonLink: {
        background: "linear-gradient(90deg,#2563eb,#38bdf8)",
        color: "white",
        border: "none",
        padding: "8px 14px",
        borderRadius: "10px",
        fontWeight: 700,
        textDecoration: "none",
    },
    secondaryBtn: {
        padding: "7px 14px",
        borderRadius: "10px",
        fontWeight: 700,
        textDecoration: "none",
        transition: "all 0.3s ease",
    },
};

export default Navbar;