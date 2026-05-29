import React, { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";
import { ArrowLeft } from "lucide-react";

function Navbar() {
    const navigate = useNavigate();

    const { theme, toggleTheme } =
    useContext(ThemeContext);

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const [showProfileMenu, setShowProfileMenu] =
    useState(false);

    const firstLetter =
        user && user.name ?
        user.name.charAt(0).toUpperCase() :
        "U";

    const handleLogout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");

        navigate("/");
    };

    // Dynamic Theme Styles
    const navbarStyle = {
        ...styles.navbar,

        background: theme.isDarkMode ?
            "rgba(8, 13, 33, 0.85)" :
            "rgba(255,255,255,0.9)",

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
            "#334155",
    };

    return ( <
        div style = { navbarStyle } >

        { /* LEFT SECTION */ } <
        div style = {
            {
                display: "flex",
                alignItems: "center",
                gap: "12px",
            }
        } >

        { /* BACK BUTTON */ } <
        button onClick = {
            () => navigate(-1) }
        style = {
            {
                background: "transparent",
                border: "none",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
            }
        } >
        <
        ArrowLeft size = { 24 }
        color = { theme.isDarkMode ? "white" : "black" }
        /> <
        /button>

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
        /h1> <
        /Link> <
        /div>

        { /* NAV LINKS */ } <
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

        { /* OWNER DASHBOARD */ } {
            user &&
                user.role === "owner" && ( <
                    Link to = "/owner-dashboard"
                    style = { linkStyle } >
                    Owner Dashboard <
                    /Link>
                )
        }

        { /* USER LOGGED IN */ } {
            user ? ( <
                div style = { styles.profileWrapper } >

                { /* PROFILE ICON */ } <
                div style = { styles.profileIcon }
                onClick = {
                    () =>
                    setShowProfileMenu(!showProfileMenu)
                } >
                { firstLetter } <
                /div>

                { /* DROPDOWN */ } {
                    showProfileMenu && ( <
                        div style = {
                            {
                                ...styles.dropdown,

                                    background:
                                    theme.isDarkMode ?
                                    "rgba(15,23,42,0.97)" :
                                    "rgba(255,255,255,0.97)",

                                    border: `1px solid ${theme.border}`,
                            }
                        } >

                        { /* PROFILE HEADER */ } <
                        div style = { styles.profileTop } >

                        <
                        div style = { styles.bigAvatar } > { firstLetter } <
                        /div>

                        <
                        div >
                        <
                        h3 style = {
                            {
                                color: theme.text,
                                margin: 0,
                                fontSize: "18px",
                            }
                        } >
                        { user.name } <
                        /h3>

                        <
                        p style = {
                            {
                                color: "#94a3b8",
                                fontSize: "13px",
                                marginTop: "4px",
                            }
                        } >
                        SpotFlex User <
                        /p> <
                        /div> <
                        /div>

                        <
                        div style = { styles.divider } > < /div>

                        { /* MENU LINKS */ }

                        <
                        Link to = "/my-bookings"
                        style = { styles.dropdownLink }
                        onClick = {
                            () =>
                            setShowProfileMenu(false)
                        } >
                        📦My Bookings <
                        /Link>

                        <
                        Link to = "/wishlist"
                        style = { styles.dropdownLink }
                        onClick = {
                            () =>
                            setShowProfileMenu(false)
                        } >
                        ❤️Wishlist <
                        /Link>

                        { /* THEME BUTTON */ } <
                        button onClick = { toggleTheme }
                        style = { styles.dropdownButton } >
                        {
                            theme.isDarkMode ?
                            "☀️ Light Mode" :
                                "🌙 Dark Mode"
                        } <
                        /button>

                        <
                        div style = { styles.divider } > < /div>

                        { /* LOGOUT */ } <
                        button onClick = { handleLogout }
                        style = { styles.logoutBtn } >
                        🚪Logout <
                        /button>

                        <
                        /div>
                    )
                } <
                /div>
            ) : ( <
                >
                <
                Link to = "/user-login"
                style = { styles.secondaryBtn } >
                User Login <
                /Link>

                <
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

        transition: "0.3s",
    },

    brandWrap: {
        display: "flex",

        alignItems: "center",

        gap: "10px",

        textDecoration: "none",
    },

    logoDot: {
        width: "36px",

        height: "36px",

        borderRadius: "12px",

        background: "linear-gradient(135deg,#38bdf8,#6366f1)",

        color: "#fff",

        display: "grid",

        placeItems: "center",

        fontWeight: "800",
    },

    logo: {
        fontSize: "24px",

        fontWeight: "800",

        margin: 0,
    },

    links: {
        display: "flex",

        alignItems: "center",

        gap: "14px",

        flexWrap: "wrap",
    },

    link: {
        textDecoration: "none",

        fontWeight: "600",

        fontSize: "15px",
    },

    profileWrapper: {
        position: "relative",
    },

    profileIcon: {
        width: "45px",

        height: "45px",

        borderRadius: "50%",

        background: "linear-gradient(135deg,#2563eb,#38bdf8)",

        color: "white",

        display: "flex",

        justifyContent: "center",

        alignItems: "center",

        fontWeight: "bold",

        fontSize: "18px",

        cursor: "pointer",

        boxShadow: "0 6px 18px rgba(37,99,235,0.4)",
    },

    dropdown: {
        position: "absolute",

        top: "60px",

        right: "0",

        width: "270px",

        borderRadius: "22px",

        padding: "18px",

        boxShadow: "0 15px 40px rgba(0,0,0,0.4)",

        display: "flex",

        flexDirection: "column",

        gap: "12px",

        backdropFilter: "blur(18px)",
    },

    profileTop: {
        display: "flex",

        alignItems: "center",

        gap: "12px",
    },

    bigAvatar: {
        width: "58px",

        height: "58px",

        borderRadius: "50%",

        background: "linear-gradient(135deg,#2563eb,#38bdf8)",

        color: "white",

        display: "flex",

        justifyContent: "center",

        alignItems: "center",

        fontSize: "24px",

        fontWeight: "bold",
    },

    divider: {
        height: "1px",

        background: "rgba(148,163,184,0.2)",

        margin: "4px 0",
    },

    dropdownLink: {
        textDecoration: "none",

        color: "#e2e8f0",

        fontWeight: "600",

        padding: "12px",

        borderRadius: "12px",

        background: "rgba(255,255,255,0.05)",

        transition: "0.2s",
    },

    dropdownButton: {
        padding: "12px",

        borderRadius: "12px",

        border: "none",

        background: "#1e293b",

        color: "white",

        fontWeight: "600",

        cursor: "pointer",

        fontSize: "14px",
    },

    logoutBtn: {
        padding: "12px",

        borderRadius: "12px",

        border: "none",

        background: "#ef4444",

        color: "white",

        fontWeight: "bold",

        cursor: "pointer",

        fontSize: "14px",
    },

    secondaryBtn: {
        padding: "8px 14px",

        borderRadius: "10px",

        border: "1px solid rgba(148,163,184,0.3)",

        textDecoration: "none",

        color: "#e2e8f0",

        fontWeight: "700",
    },

    buttonLink: {
        background: "linear-gradient(90deg,#2563eb,#38bdf8)",

        color: "white",

        padding: "8px 14px",

        borderRadius: "10px",

        textDecoration: "none",

        fontWeight: "700",
    },
};

export default Navbar;