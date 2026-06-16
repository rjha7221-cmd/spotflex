import React, { useState } from "react";
import axios from "axios";
import { Bot, Send, Trash2, X } from "lucide-react";

const initialMessage = {
  sender: "ai",
  text: "Hello, I am the SpotFlex AI Assistant.",
};

function AIChatBot() {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([initialMessage]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMessage = message;
    const updatedChat = [...chat, { sender: "user", text: userMessage }];

    setChat(updatedChat);
    setMessage("");

    try {
      const res = await axios.post("http://localhost:5000/api/ai/chat", {
        message: userMessage,
      });

      setChat([...updatedChat, { sender: "ai", text: res.data.reply }]);
    } catch (error) {
      console.log(error);
      setChat([...updatedChat, { sender: "ai", text: "AI server error." }]);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className="ai-fab"
        aria-label="Open AI assistant"
        title="SpotFlex AI"
      >
        <Bot size={25} />
      </button>

      {open && (
        <div className="ai-window">
          <div className="ai-header">
            <div className="ai-title">
              <Bot size={19} />
              SpotFlex AI
            </div>
            <div className="action-row">
              <button
                type="button"
                className="icon-btn"
                onClick={() => setChat([initialMessage])}
                aria-label="Clear chat"
                title="Clear"
              >
                <Trash2 size={16} />
              </button>
              <button
                type="button"
                className="icon-btn"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                title="Close"
              >
                <X size={16} />
              </button>
            </div>
          </div>

          <div className="ai-messages">
            {chat.map((msg, index) => (
              <div key={`${msg.sender}-${index}`} className={`ai-bubble ${msg.sender}`}>
                {msg.text}
              </div>
            ))}
          </div>

          <div className="ai-input-row">
            <input
              type="text"
              placeholder="Ask anything..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              className="field"
            />
            <button
              type="button"
              onClick={sendMessage}
              className="icon-btn"
              aria-label="Send to AI"
              title="Send"
            >
              <Send size={17} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}

export default AIChatBot;
