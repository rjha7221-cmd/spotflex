import React, { useEffect, useState } from "react";
import io from "socket.io-client";
import axios from "axios";

const socket = io.connect("http://localhost:5000");

function ChatBox({ roomId, userName }) {
    const [messages, setMessages] = useState([]);
    const [msg, setMsg] = useState("");

    useEffect(() => {
        socket.emit("join_room", roomId);

        // Purane messages fetch karo
        axios.get(`http://localhost:5000/api/messages/${roomId}`)
            .then(res => setMessages(res.data))
            .catch(err => console.log("Error loading messages", err));

        // Naye messages receive karo
        socket.on("receive_message", (data) => {
            setMessages((prev) => [...prev, { userName: data.userName, text: data.message }]);
        });

        return () => socket.off("receive_message");
    }, [roomId]);

    const send = () => {
        if (!msg.trim()) return;
        const data = { roomId, userName, message: msg };
        socket.emit("send_message", data);
        setMessages((prev) => [...prev, { userName, text: msg }]);
        setMsg("");
    };

    return ( <
        div style = {
            { display: "flex", flexDirection: "column", height: "200px", background: "#0b122e", padding: "10px", borderRadius: "8px", border: "1px solid #444" }
        } >
        <
        div style = {
            { flex: 1, overflowY: "auto", color: "#e2e8f0", fontSize: "12px", marginBottom: "10px" }
        } > {
            messages.map((m, i) => ( <
                div key = { i }
                style = {
                    { marginBottom: "5px" }
                } >
                <
                strong style = {
                    { color: "#7dd3fc" }
                } > { m.userName }: < /strong> {m.text} < /
                div >
            ))
        } <
        /div> <
        div style = {
            { display: "flex", gap: "5px" }
        } >
        <
        input value = { msg }
        onChange = {
            (e) => setMsg(e.target.value)
        }
        onKeyPress = {
            (e) => e.key === 'Enter' && send()
        }
        style = {
            { flex: 1, padding: "8px", borderRadius: "6px", border: "1px solid #444", background: "#1e293b", color: "white" }
        }
        placeholder = "Type a message..." /
        >
        <
        button onClick = { send }
        style = {
            { background: "#2563eb", color: "white", border: "none", padding: "8px 12px", borderRadius: "6px", cursor: "pointer" }
        } > Send < /button> < /
        div > <
        /div>
    );
}

export default ChatBox;