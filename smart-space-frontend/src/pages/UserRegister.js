import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { KeyRound, Mail, ShieldCheck, User } from "lucide-react";
import { useNotifications } from "../context/NotificationContext";

function UserRegister() {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        name,
        email,
        password,
        role: "user",
      });

      addNotification({
        type: "success",
        title: "Account created",
        message: "You can login with your new user account.",
      });
      navigate("/user-login");
    } catch (error) {
      addNotification({
        type: "error",
        title: "Registration failed",
        message: error.response?.data?.message || "Please check your details and try again.",
      });
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-visual">
        <div className="auth-visual-content">
          <p className="eyebrow">
            <ShieldCheck size={15} />
            User access
          </p>
          <h1>Book work, event, and parking spaces faster.</h1>
          <p>
            Create an account to save spaces, manage bookings, and chat with
            owners.
          </p>
        </div>
      </section>

      <form className="auth-card form-grid" onSubmit={handleRegister}>
        <div>
          <p className="eyebrow">
            <User size={15} />
            Create account
          </p>
          <h1>User Register</h1>
          <p>Set up your SpotFlex profile in a few details.</p>
        </div>

        <label className="input-with-icon">
          <User size={18} />
          <input
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="field"
            required
          />
        </label>

        <label className="input-with-icon">
          <Mail size={18} />
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="field"
            required
          />
        </label>

        <label className="input-with-icon">
          <KeyRound size={18} />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="field"
            required
          />
        </label>

        <button className="btn btn-primary btn-full" type="submit">
          Register
        </button>
        <Link to="/user-login" className="btn btn-secondary btn-full">
          Back to Login
        </Link>
      </form>
    </main>
  );
}

export default UserRegister;
