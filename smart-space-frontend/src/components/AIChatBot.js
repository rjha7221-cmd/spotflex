import React, { useState } from "react";
import axios from "axios";

function AIChatbot() {

    const [open, setOpen] = useState(false);

    const [message, setMessage] = useState("");

    const [chat, setChat] = useState([{
        sender: "ai",
        text: "Hello 👋 I am SpotFlex AI Assistant",
    }, ]);

    const sendMessage = async() => {

        if (!message.trim()) return;

        const updatedChat = [
            ...chat,
            {
                sender: "user",
                text: message,
            },
        ];

        setChat(updatedChat);

        const userMessage = message;

        setMessage("");

        try {

            const res = await axios.post(
                "http://localhost:5000/api/ai/chat", {
                    message: userMessage,
                }
            );

            setChat([
                ...updatedChat,
                {
                    sender: "ai",
                    text: res.data.reply,
                },
            ]);

        } catch (error) {

            console.log(error);

            setChat([
                ...updatedChat,
                {
                    sender: "ai",
                    text: "AI Server Error",
                },
            ]);
        }
    };

    const clearChat = () => {

        setChat([{
            sender: "ai",
            text: "Hello 👋 I am SpotFlex AI Assistant",
        }, ]);
    };

    return ( <
        > { /* FLOATING BUTTON */ }

        <
        button onClick = {
            () => setOpen(!open) }
        style = { styles.floatingBtn } >
        🤖
        <
        /button>

        { /* CHATBOX */ }

        {
            open && (

                <
                div style = { styles.chatbox } >

                { /* HEADER */ }

                <
                div style = { styles.header } >

                <
                span >
                SpotFlex AI <
                /span>

                <
                div style = { styles.headerBtns } >

                <
                button onClick = { clearChat }
                style = { styles.clearBtn } >
                Clear <
                /button>

                <
                button onClick = {
                    () => setOpen(false) }
                style = { styles.closeBtn } >
                ✖
                <
                /button>

                <
                /div>

                <
                /div>

                { /* MESSAGES */ }

                <
                div style = { styles.messages } >

                {
                    chat.map((msg, index) => (

                        <
                        div key = { index }
                        style = {
                            msg.sender === "user" ?
                            styles.userMsg :
                                styles.aiMsg
                        } >
                        { msg.text } <
                        /div>
                    ))
                }

                <
                /div>

                { /* INPUT */ }

                <
                div style = { styles.inputArea } >

                <
                input type = "text"
                placeholder = "Ask anything..."
                value = { message }
                onChange = {
                    (e) =>
                    setMessage(e.target.value)
                }
                onKeyDown = {
                    (e) => {
                        if (e.key === "Enter") {
                            sendMessage();
                        }
                    }
                }
                style = { styles.input }
                />

                <
                button onClick = { sendMessage }
                style = { styles.sendBtn } >
                Send <
                /button>

                <
                /div>

                <
                /div>
            )
        } <
        />
    );
}

const styles = {

    floatingBtn: {

        position: "fixed",

        bottom: "25px",

        right: "25px",

        width: "65px",

        height: "65px",

        borderRadius: "50%",

        border: "none",

        background: "#2563eb",

        color: "white",

        fontSize: "28px",

        cursor: "pointer",

        boxShadow: "0 10px 25px rgba(0,0,0,0.3)",

        zIndex: 9999,
    },

    chatbox: {

        position: "fixed",

        bottom: "100px",

        right: "25px",

        width: "350px",

        height: "500px",

        background: "#0f172a",

        borderRadius: "20px",

        display: "flex",

        flexDirection: "column",

        overflow: "hidden",

        boxShadow: "0 10px 40px rgba(0,0,0,0.4)",

        zIndex: 9999,
    },

    header: {

        background: "#2563eb",

        color: "white",

        padding: "15px",

        display: "flex",

        justifyContent: "space-between",

        alignItems: "center",

        fontWeight: "bold",
    },

    headerBtns: {

        display: "flex",

        alignItems: "center",

        gap: "10px",
    },

    clearBtn: {

        background: "white",

        color: "#2563eb",

        border: "none",

        padding: "5px 10px",

        borderRadius: "6px",

        fontWeight: "bold",

        cursor: "pointer",

        fontSize: "12px",
    },

    closeBtn: {

        background: "transparent",

        border: "none",

        color: "white",

        fontSize: "18px",

        cursor: "pointer",
    },

    messages: {

        flex: 1,

        padding: "15px",

        overflowY: "auto",

        display: "flex",

        flexDirection: "column",

        gap: "10px",
    },

    userMsg: {

        alignSelf: "flex-end",

        background: "#2563eb",

        color: "white",

        padding: "10px",

        borderRadius: "10px",

        maxWidth: "80%",
    },

    aiMsg: {

        alignSelf: "flex-start",

        background: "#1e293b",

        color: "white",

        padding: "10px",

        borderRadius: "10px",

        maxWidth: "80%",
    },

    inputArea: {

        display: "flex",

        padding: "10px",

        borderTop: "1px solid #334155",
    },

    input: {

        flex: 1,

        padding: "10px",

        borderRadius: "10px",

        border: "none",

        outline: "none",
    },

    sendBtn: {

        marginLeft: "10px",

        padding: "10px 15px",

        border: "none",

        borderRadius: "10px",

        background: "#2563eb",

        color: "white",

        cursor: "pointer",
    },
};

export default AIChatbot;