import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function UserLogin() {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Login Form, 2: OTP Verification
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [otp, setOtp] = useState("");

    // Step 1: Send OTP for Login
    const handleSendOTP = async(e) => {
        e.preventDefault();
        try {
            await axios.post("http://localhost:5000/api/auth/send-otp", { identifier: email });
            setStep(2);
            alert("OTP sent to your email!");
        } catch (err) {
            alert("Failed to send OTP. Make sure email is registered.");
        }
    };

    // Step 2: Verify OTP
    const handleVerifyOTP = async(e) => {
        e.preventDefault();
        try {
            const res = await axios.post("http://localhost:5000/api/auth/verify-otp", { identifier: email, otp });

            // Save user details to localStorage
            localStorage.setItem("user", JSON.stringify(res.data.user));
            
            // Save token to localStorage (for ProtectedRoute)
            localStorage.setItem("token", res.data.token || "user-token");
            
            alert("Login Successful 🚀");
            navigate("/home");
        } catch (err) {
            alert("Invalid OTP");
        }
    };

    return ( <
        div style = { styles.container } >
        <
        form style = { styles.card }
        onSubmit = { step === 1 ? handleSendOTP : handleVerifyOTP } >
        <
        h1 style = { styles.title } > { step === 1 ? "User Login" : "Verify OTP" } < /h1>

        {
            step === 1 ? ( <
                >
                <
                input type = "email"
                placeholder = "Enter Email"
                value = { email }
                onChange = {
                    (e) => setEmail(e.target.value) }
                style = { styles.input }
                required /
                >
                <
                input type = "password"
                placeholder = "Enter Password"
                value = { password }
                onChange = {
                    (e) => setPassword(e.target.value) }
                style = { styles.input }
                /> <
                button style = { styles.button }
                type = "submit" > Login with OTP < /button> <
                />
            ) : ( <
                >
                <
                input type = "text"
                placeholder = "Enter 6-digit OTP"
                value = { otp }
                onChange = {
                    (e) => setOtp(e.target.value) }
                style = { styles.input }
                required /
                >
                <
                button style = { styles.button }
                type = "submit" > Verify & Login < /button> <
                />
            )
        }

        {
            step === 1 && ( <
                div style = {
                    { textAlign: "center" } } >
                <
                p style = { styles.text } > Don 't have an account?</p> <
                Link to = "/user-register" >
                <
                button type = "button"
                style = { styles.registerBtn } > Register < /button> <
                /Link> <
                /div>
            )
        } <
        /form> <
        /div>
    );
}

const styles = {
    container: {
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(to right, #0f172a, #1e3a8a)",
    },
    card: {
        width: "350px",
        padding: "40px",
        borderRadius: "20px",
        background: "rgba(255, 255, 255, 0.08)",
        backdropFilter: "blur(10px)",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
    },
    title: {
        textAlign: "center",
        color: "white",
    },
    input: {
        padding: "14px",
        borderRadius: "10px",
        border: "none",
        outline: "none",
        fontSize: "16px",
    },
    button: {
        padding: "14px",
        borderRadius: "10px",
        border: "none",
        background: "linear-gradient(to right, #2563eb, #38bdf8)",
        color: "white",
        fontWeight: "bold",
        cursor: "pointer",
        fontSize: "16px",
    },
    registerBtn: {
        padding: "12px",
        width: "100%",
        borderRadius: "10px",
        border: "1px solid white",
        background: "transparent",
        color: "white",
        cursor: "pointer",
        fontWeight: "bold",
    },
    text: {
        color: "#cbd5e1",
        fontSize: "14px",
        marginBottom: "10px",
    },
};

export default UserLogin;
