import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { MessageSquare, Send } from "lucide-react";
import io from "socket.io-client";

const socket = io.connect("http://localhost:5000");

function ChatBox({ roomId, userName }) {
  const [messages, setMessages] = useState([]);
  const [msg, setMsg] = useState("");
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (!roomId) return undefined;

    socket.emit("join_room", roomId);

    axios
      .get(`http://localhost:5000/api/messages/${roomId}`)
      .then((res) => setMessages(res.data))
      .catch((err) => console.log("Error loading messages", err));

    const handleReceiveMessage = (data) => {
      if (data.roomId !== roomId) return;

      setMessages((prev) => [
        ...prev,
        {
          userName: data.userName,
          text: data.text || data.message,
          createdAt: data.createdAt || new Date().toISOString(),
        },
      ]);
    };

    socket.on("receive_message", handleReceiveMessage);

    return () => socket.off("receive_message", handleReceiveMessage);
  }, [roomId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = () => {
    if (!msg.trim()) return;

    const data = {
      roomId,
      userName,
      message: msg,
    };

    socket.emit("send_message", data);
    setMessages((prev) => [
      ...prev,
      { userName, text: msg, createdAt: new Date().toISOString() },
    ]);
    setMsg("");
  };

  const formatTime = (value) => {
    if (!value) return "";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) return "";

    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="chat-panel">
      <div className="chat-header">
        <div className="chat-header-icon">
          <MessageSquare size={17} />
        </div>
        <div>
          <strong>Booking chat</strong>
          <span>Live room</span>
        </div>
      </div>

      <div className="chat-messages">
        {messages.length === 0 ? (
          <p className="meta-row">No messages yet.</p>
        ) : (
          messages.map((message, index) => {
            const isOwnMessage = message.userName === userName;

            return (
              <div
                key={`${message.userName}-${index}-${message.createdAt || ""}`}
                className={`chat-bubble ${isOwnMessage ? "own" : "their"}`}
              >
                <div className="chat-bubble-meta">
                  <strong>{isOwnMessage ? "You" : message.userName}</strong>
                  <span>{formatTime(message.createdAt)}</span>
                </div>
                <p>{message.text || message.message}</p>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
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
          disabled={!msg.trim()}
        >
          <Send size={17} />
        </button>
      </div>
    </div>
  );
}

export default ChatBox;
