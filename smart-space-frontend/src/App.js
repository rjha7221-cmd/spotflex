import React, { useContext } from "react";
import {
    BrowserRouter,
    Routes,
    Route,
} from "react-router-dom";

import Home from "./pages/Home";
import AddSpace from "./pages/AddSpace";
import MySpaces from "./pages/MySpaces";
import LandingPage from "./pages/LandingPage";

import UserLogin from "./pages/UserLogin";
import UserRegister from "./pages/UserRegister";

import OwnerLogin from "./pages/OwnerLogin";
import OwnerRegister from "./pages/OwnerRegister";

import OwnerDashboard from "./pages/OwnerDashboard";

import ProtectedRoute from "./components/ProtectedRoute";

import MyBookings from "./pages/MyBookings";

import Navbar from "./components/Navbar";

import Wishlist from "./pages/Wishlist";

import AIChatBot from "./components/AIChatBot";

// THEME
import {
    ThemeProvider,
    ThemeContext,
} from "./context/ThemeContext";

// ==============================
// APP CONTENT
// ==============================

function AppContent() {

    const { theme } =
    useContext(ThemeContext);

    return (

        <
        div style = {
            {
                background: theme.background,
                minHeight: "100vh",
                color: theme.text,
                transition: "background 0.3s ease, color 0.3s ease",
            }
        } >

        <
        BrowserRouter >

        { /* NAVBAR */ } <
        Navbar / >

        { /* GLOBAL CHATBOT */ } <
        AIChatBot / >

        { /* ROUTES */ } <
        Routes >

        { /* LANDING */ } <
        Route path = "/"
        element = { < LandingPage / > }
        />

        { /* LOGIN */ } <
        Route path = "/login"
        element = { < UserLogin / > }
        />

        { /* USER AUTH */ } <
        Route path = "/user-login"
        element = { < UserLogin / > }
        />

        <
        Route path = "/user-register"
        element = { < UserRegister / > }
        />

        { /* OWNER AUTH */ } <
        Route path = "/owner-login"
        element = { < OwnerLogin / > }
        />

        <
        Route path = "/owner-register"
        element = { < OwnerRegister / > }
        />

        { /* HOME */ } <
        Route path = "/home"
        element = { < Home / > }
        />

        { /* OWNER DASHBOARD */ } <
        Route path = "/owner-dashboard"
        element = { <
            ProtectedRoute >
            <
            OwnerDashboard / >
            <
            /ProtectedRoute>
        }
        />

        { /* ADD SPACE */ } <
        Route path = "/add-space"
        element = { <
            ProtectedRoute >
            <
            AddSpace / >
            <
            /ProtectedRoute>
        }
        />

        { /* MY SPACES */ } <
        Route path = "/my-spaces"
        element = { <
            ProtectedRoute >
            <
            MySpaces / >
            <
            /ProtectedRoute>
        }
        />

        { /* BOOKINGS */ } <
        Route path = "/my-bookings"
        element = { <
            ProtectedRoute >
            <
            MyBookings / >
            <
            /ProtectedRoute>
        }
        />

        { /* WISHLIST */ } <
        Route path = "/wishlist"
        element = { < Wishlist / > }
        />

        <
        /Routes>

        <
        /BrowserRouter>

        <
        /div>
    );
}

// ==============================
// MAIN APP
// ==============================

function App() {

    return (

        <
        ThemeProvider >

        <
        AppContent / >

        <
        /ThemeProvider>
    );
}

export default App;