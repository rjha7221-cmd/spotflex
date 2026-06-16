import React, { useEffect, useState } from "react";
import axios from "axios";
import { Send } from "lucide-react";
import io from "socket.io-client";

const socket = io.connect("http://localhost:5000");

function ChatBox({ roomId, userName }) {
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    socket.emit("join_room", roomId);

    axios
      .get(`http://localhost:5000/api/messages/${roomId}`)
      .then((res) => setMessages(res.data))
      .catch((err) => console.log("Error loading messages", err));

    socket.on("receive_message", (data) => {
      setMessages((prev) => [
        ...prev,
        { userName: data.userName, text: data.message },
      ]);
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

  return (
    <div className="chat-panel">
      <div className="chat-messages">
        {messages.length === 0 ? (
          <p className="meta-row">No messages yet.</p>
        ) : (
          messages.map((message, index) => (
            <div key={`${message.userName}-${index}`} className="chat-line">
              <strong>{message.userName}:</strong> {message.text}
            </div>
          ))
        )}
      </div>

      <div className="chat-input-row">
        <input
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          className="field"
          placeholder="Type a message..."
        />
        <button
          type="button"
          onClick={send}
          className="icon-btn"
          aria-label="Send message"
          title="Send"
        >
          <Send size={17} />
        </button>
      </div>
    </div>
  );
}

export default ChatBox;
