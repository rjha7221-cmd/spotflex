import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

function UserLogin() {
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async(e) => {
        e.preventDefault();

        try {
            const res = await axios.post(
                "http://localhost:5000/api/auth/login", { email, password }
            );

            console.log("LOGIN RESPONSE:", res.data);

            // ❌ if backend failed
            if (!res.data.success) {
                alert(res.data.message);
                return;
            }

            // ✅ direct backend user
            const user = res.data.user;

            if (!user || !user._id) {
                alert("Invalid backend response");
                return;
            }

            // save token
            localStorage.setItem("token", res.data.token);

            // save user
            localStorage.setItem(
                "user",
                JSON.stringify({
                    id: user._id,
                    name: user.name,
                    email: user.email,
                })
            );

            alert("Login Successful 🚀");

            navigate("/home");

        } catch (err) {
            console.log("LOGIN ERROR:", err.message);
            alert("Login Failed");
        }
    };

    return ( <
        div style = { styles.container } >
        <
        form style = { styles.card }
        onSubmit = { handleLogin } >
        <
        h1 style = { styles.title } > User Login < /h1>

        <
        input type = "email"
        placeholder = "Enter Email"
        value = { email }
        onChange = {
            (e) => setEmail(e.target.value) }
        style = { styles.input }
        />

        <
        input type = "password"
        placeholder = "Enter Password"
        value = { password }
        onChange = {
            (e) => setPassword(e.target.value) }
        style = { styles.input }
        />

        <
        button style = { styles.button }
        type = "submit" >
        Login <
        /button>

        <
        p style = { styles.text } > Don 't have account?</p>

        <
        Link to = "/user-register" >
        <
        button type = "button"
        style = { styles.registerBtn } >
        Register <
        /button> <
        /Link> <
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
        background: "linear-gradient(to right,#0f172a,#1e3a8a)",
    },
    card: {
        width: "350px",
        padding: "40px",
        borderRadius: "20px",
        background: "rgba(255,255,255,0.08)",
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
        padding: "12px",
        borderRadius: "10px",
        border: "none",
        outline: "none",
    },
    button: {
        padding: "12px",
        borderRadius: "10px",
        border: "none",
        background: "#2563eb",
        color: "white",
        cursor: "pointer",
    },
    registerBtn: {
        padding: "12px",
        width: "100%",
        borderRadius: "10px",
        border: "1px solid white",
        background: "transparent",
        color: "white",
        cursor: "pointer",
    },
    text: {
        color: "white",
        textAlign: "center",
    },
};

export default UserLogin;