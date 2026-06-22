import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";

import AddSpace from "./pages/AddSpace";
import Home from "./pages/Home";
import LandingPage from "./pages/LandingPage";
import MyBookings from "./pages/MyBookings";
import MySpaces from "./pages/MySpaces";
import OwnerDashboard from "./pages/OwnerDashboard";
import OwnerLogin from "./pages/OwnerLogin";
import OwnerRegister from "./pages/OwnerRegister";
import UserLogin from "./pages/UserLogin";
import UserRegister from "./pages/UserRegister";
import Wishlist from "./pages/Wishlist";

import AIChatBot from "./components/AIChatBot";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";
import ToastHost from "./components/ToastHost";
import { NotificationProvider } from "./context/NotificationContext";
import { ThemeProvider } from "./context/ThemeContext";

function AppContent() {
  return (
    <div className="app-shell">
      <BrowserRouter>
        <Navbar />
        <AIChatBot />
        <ToastHost />

        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<UserLogin />} />
          <Route path="/user-login" element={<UserLogin />} />
          <Route path="/user-register" element={<UserRegister />} />
          <Route path="/owner-login" element={<OwnerLogin />} />
          <Route path="/owner-register" element={<OwnerRegister />} />
          <Route path="/home" element={<Home />} />
          <Route
            path="/owner-dashboard"
            element={
              <ProtectedRoute>
                <OwnerDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/add-space"
            element={
              <ProtectedRoute>
                <AddSpace />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-spaces"
            element={
              <ProtectedRoute>
                <MySpaces />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-bookings"
            element={
              <ProtectedRoute>
                <MyBookings />
              </ProtectedRoute>
            }
          />
          <Route path="/wishlist" element={<Wishlist />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <NotificationProvider>
        <AppContent />
      </NotificationProvider>
    </ThemeProvider>
  );
}

export default App;
