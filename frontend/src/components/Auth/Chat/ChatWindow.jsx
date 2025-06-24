import React, { useEffect, useRef, useState } from "react";
import axios from "../../../api/axios";
import { useSocket } from "../../../context/SocketContext";
import { useAuth } from "../../../context/AuthContext";
import LandingPage from "../../../pages/LandingPage";
import Placeholder from "./Placeholder";

export default function ChatWindow({ user, onBack }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const messageEndRef = useRef(null);
  const socket = useSocket();
  const { user: authUser, loading } = useAuth();

  useEffect(() => {
    let isMounted = true;
    setMessages([]); // 👈 Clear messages immediately when user changes

    const fetchMessages = async () => {
      if (!authUser?._id || !user?._id) return;

      try {
        const res = await axios.get(`/messages/${user._id}`, {
          withCredentials: true,
        });
        if (!isMounted) return;

        const formatted = res.data.map((m) => ({
          ...m,
          fromSelf: m.sender?._id === authUser._id,
        }));

        setMessages(formatted);
      } catch (err) {
        console.error("Failed to fetch messages:", err);
      }
    };

    fetchMessages();

    return () => {
      isMounted = false;
    };
  }, [user, authUser]);

  useEffect(() => {
    if (!socket || !authUser || !user) return;

    const handleMessage = (event) => {
      try {
        const msg = JSON.parse(event.data);
        console.log("📥 WebSocket msg:", msg);

        if (msg.type === "new-message") {
          const isRelevant =
            (msg.from === user._id && msg.receiver === authUser._id) ||
            (msg.from === authUser._id && msg.receiver === user._id);

          if (isRelevant) {
            setMessages((prev) => [
              ...prev,
              {
                ...msg,
                fromSelf: msg.from === authUser._id,
              },
            ]);
          }
        }
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
      }
    };

    socket.addEventListener("message", handleMessage);
    return () => socket.removeEventListener("message", handleMessage);
  }, [socket, user, authUser]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (text.trim() === "") return;

    const messageData = {
      type: "message",
      receiver: user._id,
      text,
    };

    socket.send(JSON.stringify(messageData));

    setMessages((prev) => [
      ...prev,
      {
        _id: Date.now(),
        fromSelf: true,
        text,
        createdAt: new Date().toISOString(),
      },
    ]);
    setText("");
  };

  if (loading) return <div>Loading...</div>;
  if (!authUser) return <Placeholder />;

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center p-3 bg-gray-800 border-b border-gray-700">
        <button onClick={onBack} className="mr-3 text-white text-xl">
          ←
        </button>
        <img
          src={user.avatar}
          alt={user.firstName}
          className="w-10 h-10 rounded-full mr-3"
        />
        <p className="text-white font-semibold">
          {user.firstName} {user.lastName}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-2 bg-gray-900">
        {messages.map((msg) => (
          <div
            key={msg._id}
            className={`my-2 max-w-[75%] px-4 py-2 rounded-lg text-white ${
              msg.fromSelf ? "bg-blue-600 ml-auto" : "bg-gray-700"
            }`}
          >
            {msg.text}
          </div>
        ))}
        <div ref={messageEndRef} />
      </div>

      <div className="p-3 bg-gray-800 border-t border-gray-700 flex gap-2">
        <input
          type="text"
          className="flex-1 p-2 rounded bg-gray-700 text-white"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
