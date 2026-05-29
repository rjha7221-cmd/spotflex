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

import {
    ThemeProvider,
    ThemeContext,
} from "./context/ThemeContext";

function AppContent() {
    const { theme } =
    useContext(ThemeContext);

    return ( <
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
        <
        Navbar / >

        <
        Routes > { /* Landing */ } <
        Route path = "/"
        element = { < LandingPage / > }
        />

        { /* Login */ } <
        Route path = "/login"
        element = { < UserLogin / > }
        />

        { /* User Auth */ } <
        Route path = "/user-login"
        element = { < UserLogin / > }
        />

        <
        Route path = "/user-register"
        element = { < UserRegister / > }
        />

        { /* Owner Auth */ } <
        Route path = "/owner-login"
        element = { < OwnerLogin / > }
        />

        <
        Route path = "/owner-register"
        element = { < OwnerRegister / > }
        />

        { /* Home */ } <
        Route path = "/home"
        element = { < Home / > }
        />

        { /* Wishlist */ } <
        Route path = "/wishlist"
        element = { < Wishlist / > }
        />

        { /* Protected Routes */ } <
        Route path = "/owner-dashboard"
        element = { <
            ProtectedRoute >
            <
            OwnerDashboard / >
            <
            /ProtectedRoute>
        }
        />

        <
        Route path = "/add-space"
        element = { <
            ProtectedRoute >
            <
            AddSpace / >
            <
            /ProtectedRoute>
        }
        />

        <
        Route path = "/my-spaces"
        element = { <
            ProtectedRoute >
            <
            MySpaces / >
            <
            /ProtectedRoute>
        }
        />

        <
        Route path = "/my-bookings"
        element = { <
            ProtectedRoute >
            <
            MyBookings / >
            <
            /ProtectedRoute>
        }
        /> <
        /Routes> <
        /BrowserRouter> <
        /div>
    );
}

function App() {
    return ( <
        ThemeProvider >
        <
        AppContent / >
        <
        /ThemeProvider>
    );
}

export default App;