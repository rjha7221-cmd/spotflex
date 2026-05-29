import React, { useState } from "react";

function SearchBar() {
    const [search, setSearch] = useState("");
    const [isListening, setIsListening] = useState(false);

    // 🎤 VOICE SEARCH LOGIC
    const startVoiceSearch = () => {
        const SpeechRecognition =
            window.SpeechRecognition || window.webkitSpeechRecognition;

        if (!SpeechRecognition) {
            alert("Sorry, your browser does not support voice search.");
            return;
        }

        const recognition = new SpeechRecognition();
        recognition.lang = "en-US";
        recognition.interimResults = false;

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            setSearch(transcript);
        };

        recognition.onerror = (event) => {
            console.log("Speech error:", event.error);
            setIsListening(false);
        };

        recognition.start();
    };

    const handleSearch = () => {
        if (!search.trim()) return alert("Please enter something to search!");
        console.log("Searching for:", search);
        alert("Searching: " + search);
    };

    return ( <
        div style = { styles.container } >
        <
        div style = { styles.inputWrapper } >
        <
        input type = "text"
        placeholder = "Search Space..."
        value = { search }
        onChange = {
            (e) => setSearch(e.target.value)
        }
        style = { styles.input }
        /> <
        button onClick = { startVoiceSearch }
        style = {
            {...styles.micInside, color: isListening ? "#ef4444" : "#64748b" }
        }
        title = "Voice Search" > { isListening ? "●" : "🎤" } <
        /button> < /
        div >

        <
        button onClick = { handleSearch }
        style = { styles.button } >
        Search <
        /button> < /
        div >
    );
}

const styles = {
    container: {
        display: "flex",
        justifyContent: "center",
        gap: "10px",
        padding: "20px",
        alignItems: "center",
    },
    inputWrapper: {
        position: "relative",
        width: "100%",
        maxWidth: "400px",
    },
    input: {
        width: "100%",
        padding: "12px 45px 12px 15px", // Right side space for mic
        borderRadius: "10px",
        border: "1px solid #cbd5e1",
        fontSize: "16px",
        boxSizing: "border-box", // Important: prevents overflow
        outline: "none"
    },
    micInside: {
        position: "absolute",
        right: "10px",
        top: "50%",
        transform: "translateY(-50%)",
        border: "none",
        background: "transparent",
        cursor: "pointer",
        fontSize: "20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "5px"
    },
    button: {
        padding: "12px 24px",
        border: "none",
        background: "#111827",
        color: "white",
        borderRadius: "10px",
        cursor: "pointer",
        fontWeight: "600"
    },
};

export default SearchBar;