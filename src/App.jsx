import React, { useEffect, useState, useRef } from "react";
import "./App.css";

function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [name, setName] = useState("");
  const [joined, setJoined] = useState(false);
  const ws = useRef(null);

  useEffect(() => {
    ws.current = new WebSocket(`wss:${import.meta.env.VITE_APP_BACKEND_URL}`);

    ws.current.onmessage = (event) => {
      setMessages((prev) => [...prev, event.data]);
    };

    return () => {
      ws.current.close();
    };
  }, []);

  const joinChat = () => {
    if (name.trim()) {
      ws.current.send(JSON.stringify({ type: "join", name: name.trim() }));
      setJoined(true);
    }
  };

  const sendMessage = () => {
    if (input.trim() && joined) {
      const message = { type: "message", content: input };
      ws.current.send(JSON.stringify(message));
      setMessages((prev) => [...prev, `${name}: ${input}`]);
      setInput("");
    }
  };

  const clearChat = () => {
    const message = { type: "clear", content: null };
    ws.current.send(JSON.stringify(message));
    setMessages([]);
    setInput("");
    setName("");
  };

  return (
    <div className="App">
      <h2>WebSocket Chat</h2>
      {!joined ? (
        <div
          style={{
            minWidth: "300px",
            minHeight: "100px",
          }}
        >
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
          />
          <button onClick={joinChat}>Join</button>
        </div>
      ) : (
        <>
          <div className="chat-box">
            {messages.map((msg, idx) => (
              <div key={idx}>{msg}</div>
            ))}
          </div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Type a message..."
          />
          <button
            onClick={sendMessage}
            style={{
              marginTop: "1rem",
            }}
          >
            Send
          </button>

          <button
            onClick={clearChat}
            style={{
              marginTop: "1rem",
              backgroundColor: "red",
            }}
          >
            Clear chat
          </button>
        </>
      )}
    </div>
  );
}

export default App;
