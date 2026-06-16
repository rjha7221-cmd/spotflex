import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Building2, KeyRound, Mail, ShieldCheck } from "lucide-react";

function OwnerLogin() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");

  const handleSendOTP = async (e) => {
    e.preventDefault();

    try {
      await axios.post("http://localhost:5000/api/auth/send-otp", {
        identifier: email,
      });
      setStep(2);
      alert("OTP sent to your email.");
    } catch (err) {
      alert("Failed to send OTP. Ensure email is registered.");
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post("http://localhost:5000/api/auth/verify-otp", {
        identifier: email,
        otp,
      });

      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("token", res.data.token || "owner-token");

      alert("Owner login successful.");
      navigate("/owner-dashboard");
    } catch (err) {
      alert("Invalid OTP");
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-visual owner">
        <div className="auth-visual-content">
          <p className="eyebrow">
            <Building2 size={15} />
            Owner console
          </p>
          <h1>Manage listings, bookings, and earnings confidently.</h1>
          <p>
            SpotFlex gives owners a focused dashboard for space operations and
            guest communication.
          </p>
        </div>
      </section>

      <form
        className="auth-card form-grid"
        onSubmit={step === 1 ? handleSendOTP : handleVerifyOTP}
      >
        <div>
          <p className="eyebrow">
            <KeyRound size={15} />
            {step === 1 ? "Owner login" : "Verification"}
          </p>
          <h1>{step === 1 ? "Welcome back" : "Enter owner OTP"}</h1>
          <p>
            {step === 1
              ? "Use your registered email to receive a secure login code."
              : "Confirm the code sent to your email."}
          </p>
        </div>

        {step === 1 ? (
          <>
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
              />
            </label>
            <button className="btn btn-primary btn-full" type="submit">
              Send OTP
            </button>
          </>
        ) : (
          <>
            <label className="input-with-icon">
              <ShieldCheck size={18} />
              <input
                type="text"
                placeholder="6-digit OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="field"
                required
              />
            </label>
            <button className="btn btn-primary btn-full" type="submit">
              Verify and Login
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-full"
              onClick={() => setStep(1)}
            >
              Change Email
            </button>
          </>
        )}

        {step === 1 && (
          <div className="auth-links">
            <p>Listing for the first time?</p>
            <Link to="/owner-register" className="btn btn-secondary btn-full">
              Create Owner Account
            </Link>
          </div>
        )}
      </form>
    </main>
  );
}

export default OwnerLogin;
