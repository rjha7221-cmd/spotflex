import React, { useContext } from "react";

import {
    Link,
    useNavigate,
    useLocation,
} from "react-router-dom";

import { ThemeContext } from "../context/ThemeContext";

function Navbar() {

    const navigate = useNavigate();

    const location = useLocation();

    const { theme, toggleTheme } =
    useContext(ThemeContext);

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    // LOGOUT
    const handleLogout = () => {

        localStorage.removeItem("user");

        localStorage.removeItem("token");

        navigate("/");
    };

    // BACK BUTTON
    const handleBack = () => {
        navigate(-1);
    };

    // DYNAMIC STYLES
    const navbarStyle = {
        ...styles.navbar,

        background: theme.isDarkMode ?
            "rgba(8, 13, 33, 0.85)" :
            "rgba(255,255,255,0.85)",

        borderBottom: `1px solid ${theme.border}`,
    };

    const logoStyle = {
        ...styles.logo,
        color: theme.text,
    };

    const linkStyle = {
        ...styles.link,

        color: theme.isDarkMode ?
            "#cbd5e1" :
            "#475569",
    };

    const secondaryBtnStyle = {
        ...styles.secondaryBtn,

        color: theme.isDarkMode ?
            "#e2e8f0" :
            "#334155",

        border: `1px solid ${theme.border}`,
    };

    return (

        <
        div style = { navbarStyle } >

        { /* LEFT */ } <
        div style = { styles.leftSection } >

        { /* BACK BUTTON */ } {
            location.pathname !== "/" && (

                <
                button onClick = { handleBack }
                style = { styles.backBtn } >
                ←
                <
                /button>
            )
        }

        { /* LOGO */ } <
        Link to = "/"
        style = { styles.brandWrap } >

        <
        div style = { styles.logoDot } >
        S <
        /div>

        <
        h1 style = { logoStyle } >
        SpotFlex <
        /h1>

        <
        /Link>

        <
        /div>

        { /* RIGHT */ } <
        div style = { styles.links } >

        <
        Link to = "/"
        style = { linkStyle } >
        Landing <
        /Link>

        <
        Link to = "/home"
        style = { linkStyle } >
        Spaces <
        /Link>

        { /* THEME BUTTON */ } <
        button onClick = { toggleTheme }
        style = { styles.toggleBtn } >

        {
            theme.isDarkMode ?
            "☀️ Light" :
                "🌙 Dark"
        }

        <
        /button>

        { /* USER DROPDOWN */ } {
            user ? (

                <
                div style = { styles.profileWrapper }

                onMouseEnter = {
                    (e) => {
                        e.currentTarget.children[1].style.display =
                            "flex";
                    }
                }

                onMouseLeave = {
                    (e) => {
                        e.currentTarget.children[1].style.display =
                            "none";
                    }
                } >

                <
                button style = { styles.profileBtn } >

                👤{ user.name }

                <
                /button>

                <
                div style = { styles.dropdown } >

                <
                Link to = "/my-bookings"
                style = { styles.dropdownItem } >
                📖My Bookings <
                /Link>

                <
                Link to = "/wishlist"
                style = { styles.dropdownItem } >
                ❤️Wishlist <
                /Link>

                {
                    user.role === "owner" && (

                        <
                        Link to = "/owner-dashboard"
                        style = { styles.dropdownItem } >
                        🏢Owner Dashboard <
                        /Link>
                    )
                }

                <
                button onClick = { handleLogout }
                style = { styles.logoutBtn } >
                🚪Logout <
                /button>

                <
                /div>

                <
                /div>

            ) : (

                <
                >

                <
                Link to = "/user-login"
                style = { secondaryBtnStyle } >
                User Login <
                /Link>

                <
                Link to = "/owner-login"
                style = { styles.buttonLink } >
                Owner Login <
                /Link>

                <
                />
            )
        }

        <
        /div>

        <
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

    leftSection: {

        display: "flex",

        alignItems: "center",

        gap: "15px",
    },

    backBtn: {

        background: "linear-gradient(90deg,#0f172a,#1e293b)",

        color: "white",

        border: "1px solid #334155",

        padding: "8px 14px",

        borderRadius: "10px",

        cursor: "pointer",

        fontWeight: "bold",

        fontSize: "18px",

        display: "flex",

        alignItems: "center",

        justifyContent: "center",

        transition: "0.3s",
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

    toggleBtn: {

        background: "rgba(255,255,255,0.1)",

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

    // PROFILE DROPDOWN

    profileWrapper: {

        position: "relative",
    },

    profileBtn: {

        background: "linear-gradient(90deg,#2563eb,#38bdf8)",

        color: "white",

        border: "none",

        padding: "10px 16px",

        borderRadius: "12px",

        cursor: "pointer",

        fontWeight: "bold",

        fontSize: "14px",
    },

    dropdown: {

        position: "absolute",

        top: "50px",

        right: 0,

        background: "#0f172a",

        border: "1px solid #334155",

        borderRadius: "12px",

        minWidth: "220px",

        display: "none",

        flexDirection: "column",

        overflow: "hidden",

        zIndex: 999,

        boxShadow: "0 10px 25px rgba(0,0,0,0.4)",
    },

    dropdownItem: {

        padding: "14px",

        color: "white",

        textDecoration: "none",

        borderBottom: "1px solid #1e293b",

        fontSize: "14px",

        transition: "0.3s",
    },

    logoutBtn: {

        padding: "14px",

        border: "none",

        background: "#ef4444",

        color: "white",

        cursor: "pointer",

        fontWeight: "bold",
    },
};

export default Navbar;