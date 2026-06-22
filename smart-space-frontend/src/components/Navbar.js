import React, { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Building2,
  CalendarDays,
  Heart,
  LayoutDashboard,
  LogOut,
  Moon,
  Search,
  Sun,
  User,
} from "lucide-react";

import { ThemeContext } from "../context/ThemeContext";
import { useNotifications } from "../context/NotificationContext";
import NotificationCenter from "./NotificationCenter";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const { addNotification } = useNotifications();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    addNotification({
      type: "info",
      title: "Signed out",
      message: "Your SpotFlex session has ended.",
    });
    navigate("/");
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="site-nav">
      <div className="nav-left">
        {location.pathname !== "/" && (
          <button
            type="button"
            className="icon-btn"
            onClick={() => navigate(-1)}
            aria-label="Go back"
            title="Back"
          >
            <ArrowLeft size={18} />
          </button>
        )}

        <Link to="/" className="brand-link" aria-label="SpotFlex home">
          <span className="brand-mark">S</span>
          <h1 className="brand-text">SpotFlex</h1>
        </Link>
      </div>

      <div className="nav-links">
        <Link to="/" className={`nav-link ${isActive("/") ? "active" : ""}`}>
          <Building2 size={17} />
          <span>Landing</span>
        </Link>
        <Link
          to="/home"
          className={`nav-link ${isActive("/home") ? "active" : ""}`}
        >
          <Search size={17} />
          <span>Spaces</span>
        </Link>

        <button
          type="button"
          className="icon-btn"
          onClick={toggleTheme}
          aria-label={theme.isDarkMode ? "Switch to light theme" : "Switch to dark theme"}
          title={theme.isDarkMode ? "Light theme" : "Dark theme"}
        >
          {theme.isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <NotificationCenter />

        {user ? (
          <div className="profile-menu">
            <button type="button" className="profile-button">
              <User size={17} />
              <span>{user.name || "Account"}</span>
            </button>

            <div className="dropdown-menu">
              <Link to="/my-bookings" className="dropdown-item">
                <CalendarDays size={17} />
                My Bookings
              </Link>
              <Link to="/wishlist" className="dropdown-item">
                <Heart size={17} />
                Wishlist
              </Link>
              {user.role === "owner" && (
                <Link to="/owner-dashboard" className="dropdown-item">
                  <LayoutDashboard size={17} />
                  Owner Dashboard
                </Link>
              )}
              <button
                type="button"
                onClick={handleLogout}
                className="dropdown-button"
              >
                <LogOut size={17} />
                Logout
              </button>
            </div>
          </div>
        ) : (
          <div className="nav-actions">
            <Link to="/user-login" className="btn btn-secondary btn-sm">
              User Login
            </Link>
            <Link to="/owner-login" className="btn btn-primary btn-sm">
              Owner Login
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
