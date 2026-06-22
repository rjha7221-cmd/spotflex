import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Building2, KeyRound, Mail, User } from "lucide-react";
import { useNotifications } from "../context/NotificationContext";

function OwnerRegister() {
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
        role: "owner",
      });

      addNotification({
        type: "success",
        title: "Owner account created",
        message: "You can login and manage your spaces now.",
      });
      navigate("/owner-login");
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
      <section className="auth-visual owner">
        <div className="auth-visual-content">
          <p className="eyebrow">
            <Building2 size={15} />
            Owner access
          </p>
          <h1>Turn unused space into organized revenue.</h1>
          <p>
            Register as an owner to publish spaces and track booking activity.
          </p>
        </div>
      </section>

      <form className="auth-card form-grid" onSubmit={handleRegister}>
        <div>
          <p className="eyebrow">
            <User size={15} />
            Create owner account
          </p>
          <h1>Owner Register</h1>
          <p>Tell us where to send account and booking updates.</p>
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
        <Link to="/owner-login" className="btn btn-secondary btn-full">
          Back to Login
        </Link>
      </form>
    </main>
  );
}

export default OwnerRegister;
