import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { ArrowLeft, KeyRound, Mail, ShieldCheck } from "lucide-react";

import { useNotifications } from "../context/NotificationContext";

function AuthAccessForm({
  role,
  accountLabel,
  visualIcon: VisualIcon,
  visualEyebrow,
  visualTitle,
  visualText,
  visualVariant = "",
  successPath,
  registerPath,
  registerPrompt,
  registerLabel,
  loginSuccessMessage,
}) {
  const navigate = useNavigate();
  const { addNotification } = useNotifications();
  const [authView, setAuthView] = useState("login");
  const [loginMethod, setLoginMethod] = useState("password");
  const [otpStep, setOtpStep] = useState("send");
  const [resetStep, setResetStep] = useState("request");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [resetOtp, setResetOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isResetView = authView === "reset";
  const isOtpVerification = !isResetView && loginMethod === "otp" && otpStep === "verify";
  const isResetConfirm = isResetView && resetStep === "confirm";

  const notify = (type, title, message) => {
    addNotification({ type, title, message });
  };

  const saveSession = (data) => {
    localStorage.setItem("user", JSON.stringify(data.user));
    localStorage.setItem("token", data.token || `${role}-token`);
  };

  const selectLoginMethod = (method) => {
    setLoginMethod(method);
    setOtpStep("send");
    setOtp("");
  };

  const showResetView = () => {
    setAuthView("reset");
    setResetStep("request");
    setResetOtp("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const showLoginView = () => {
    setAuthView("login");
    setResetStep("request");
    setResetOtp("");
    setNewPassword("");
    setConfirmPassword("");
  };

  const handlePasswordLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        password,
        role,
      });

      saveSession(res.data);
      notify("success", "Login successful", loginSuccessMessage);
      navigate(successPath);
    } catch (err) {
      notify("error", "Login failed", err.response?.data?.message || "Check your email and password.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.post("http://localhost:5000/api/auth/send-otp", {
        identifier: email,
        role,
      });
      setOtpStep("verify");
      notify("success", "OTP sent", "Check your registered email for the login code.");
    } catch (err) {
      notify("error", "OTP failed", err.response?.data?.message || "Could not send OTP.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await axios.post("http://localhost:5000/api/auth/verify-otp", {
        identifier: email,
        otp,
        role,
      });

      saveSession(res.data);
      notify("success", "Login successful", loginSuccessMessage);
      navigate(successPath);
    } catch (err) {
      notify("error", "Invalid OTP", err.response?.data?.message || "Enter the latest OTP from your email.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSendResetOTP = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await axios.post("http://localhost:5000/api/auth/forgot-password/send-otp", {
        identifier: email,
        role,
      });
      setResetStep("confirm");
      notify("success", "Reset OTP sent", "Use the code from your email to create a new password.");
    } catch (err) {
      notify("error", "Reset failed", err.response?.data?.message || "Could not send reset OTP.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      notify("error", "Passwords do not match", "Confirm your new password and try again.");
      return;
    }

    setIsSubmitting(true);

    try {
      await axios.post("http://localhost:5000/api/auth/forgot-password/reset", {
        identifier: email,
        otp: resetOtp,
        newPassword,
        role,
      });

      setPassword("");
      setLoginMethod("password");
      showLoginView();
      notify("success", "Password updated", "You can now login with your new password.");
    } catch (err) {
      notify("error", "Reset failed", err.response?.data?.message || "Enter a valid reset code.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLoginSubmit =
    loginMethod === "password"
      ? handlePasswordLogin
      : isOtpVerification
        ? handleVerifyOTP
        : handleSendOTP;

  const handleSubmit = isResetView
    ? isResetConfirm
      ? handleResetPassword
      : handleSendResetOTP
    : handleLoginSubmit;

  const formLabel = isResetView
    ? "Password reset"
    : isOtpVerification
      ? "Verification"
      : `${accountLabel} login`;
  const formTitle = isResetView
    ? isResetConfirm
      ? "Create new password"
      : "Forgot password"
    : isOtpVerification
      ? `Enter ${role === "owner" ? "owner " : ""}OTP`
      : "Welcome back";
  const formText = isResetView
    ? isResetConfirm
      ? "Enter the reset code and choose a new password."
      : "Send a reset code to your registered email."
    : loginMethod === "password"
      ? `Sign in with your ${role === "owner" ? "owner " : ""}email and password.`
      : isOtpVerification
        ? "Confirm the code sent to your registered email."
        : "Use your email to receive a one-time login code.";

  return (
    <main className="auth-page">
      <section className={`auth-visual ${visualVariant}`}>
        <div className="auth-visual-content">
          <p className="eyebrow">
            <VisualIcon size={15} />
            {visualEyebrow}
          </p>
          <h1>{visualTitle}</h1>
          <p>{visualText}</p>
        </div>
      </section>

      <form className="auth-card form-grid auth-motion" onSubmit={handleSubmit}>
        <div>
          <p className="eyebrow">
            <KeyRound size={15} />
            {formLabel}
          </p>
          <h1>{formTitle}</h1>
          <p>{formText}</p>
        </div>

        {!isResetView && !isOtpVerification && (
          <div className="auth-method-toggle" role="tablist" aria-label="Login method">
            <button
              type="button"
              className={`auth-method-option ${loginMethod === "password" ? "active" : ""}`}
              onClick={() => selectLoginMethod("password")}
            >
              <KeyRound size={16} />
              Password
            </button>
            <button
              type="button"
              className={`auth-method-option ${loginMethod === "otp" ? "active" : ""}`}
              onClick={() => selectLoginMethod("otp")}
            >
              <ShieldCheck size={16} />
              OTP
            </button>
          </div>
        )}

        {!isOtpVerification && !isResetConfirm && (
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
        )}

        {!isResetView && loginMethod === "password" && (
          <>
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
            <button className="btn btn-primary btn-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Logging in..." : "Login with Password"}
            </button>
            <button type="button" className="auth-text-button" onClick={showResetView}>
              Forgot password?
            </button>
          </>
        )}

        {!isResetView && loginMethod === "otp" && isOtpVerification && (
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
            <button className="btn btn-primary btn-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Verifying..." : "Verify and Login"}
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-full"
              onClick={() => setOtpStep("send")}
            >
              Change Email
            </button>
          </>
        )}

        {!isResetView && loginMethod === "otp" && !isOtpVerification && (
          <>
            <button className="btn btn-primary btn-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send OTP"}
            </button>
            <button type="button" className="auth-text-button" onClick={showResetView}>
              Forgot password?
            </button>
          </>
        )}

        {isResetView && !isResetConfirm && (
          <>
            <button className="btn btn-primary btn-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Sending..." : "Send Reset OTP"}
            </button>
            <button type="button" className="btn btn-secondary btn-full" onClick={showLoginView}>
              <ArrowLeft size={16} />
              Back to Login
            </button>
          </>
        )}

        {isResetConfirm && (
          <>
            <label className="input-with-icon">
              <ShieldCheck size={18} />
              <input
                type="text"
                placeholder="Reset OTP"
                value={resetOtp}
                onChange={(e) => setResetOtp(e.target.value)}
                className="field"
                required
              />
            </label>
            <label className="input-with-icon">
              <KeyRound size={18} />
              <input
                type="password"
                placeholder="New password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="field"
                minLength={6}
                required
              />
            </label>
            <label className="input-with-icon">
              <KeyRound size={18} />
              <input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="field"
                minLength={6}
                required
              />
            </label>
            <button className="btn btn-primary btn-full" type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Updating..." : "Update Password"}
            </button>
            <button
              type="button"
              className="btn btn-secondary btn-full"
              onClick={() => setResetStep("request")}
            >
              Change Email
            </button>
          </>
        )}

        {!isResetView && !isOtpVerification && (
          <div className="auth-links">
            <p>{registerPrompt}</p>
            <Link to={registerPath} className="btn btn-secondary btn-full">
              {registerLabel}
            </Link>
          </div>
        )}
      </form>
    </main>
  );
}

export default AuthAccessForm;
