import React, { useEffect, useRef, useState } from "react";
import axios from "../../../api/axios";
import { useSocket } from "../../../context/SocketContext";
import { useAuth } from "../../../context/AuthContext";
import Placeholder from "./Placeholder";
import TypingIndiactors from "./TypingIndiactors";
import { format, isSameDay, isToday, isYesterday } from "date-fns";

export default function ChatWindow({ user, onBack }) {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const messageEndRef = useRef(null);
  const { socket } = useSocket();
  const { user: authUser, loading } = useAuth();
  const [isTyping, setIsTyping] = useState(false);
  const typingTimer = useRef(null);
  const { onlineUsers } = useSocket();

  useEffect(() => {
    let isMounted = true;
    setMessages([]);

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

        const unread = res.data.filter((m) => {
          const receiverId =
            typeof m.receiver === "string" ? m.receiver : m.receiver?._id;
          return !m.read && receiverId === authUser._id;
        });

        console.log("🔍 Unread Messages to mark as read:");
        unread.forEach((m) =>
          console.log({
            messageId: m._id,
            sender: m.sender,
            receiver: m.receiver,
            receiverId:
              typeof m.receiver === "string" ? m.receiver : m.receiver?._id,
            authUser: authUser._id,
          })
        );

        for (const m of unread) {
          await axios.patch(
            `/messages/${m._id}/read`,
            {},
            { withCredentials: true }
          );

          console.log("🔁 Sending read receipt for:", m._id);

          socket.send(
            JSON.stringify({
              type: "message-read",
              messageId: m._id,
              to: m.sender._id,
            })
          );
        }

        console.log(
          "🔍 Unread messages:",
          unread.map((m) => ({
            id: m._id,
            receiver: m.receiver,
            sender: m.sender,
            read: m.read,
          }))
        );

        console.log(
          "🔍 Marking messages as read: ",
          unread.map((m) => m._id)
        );
        console.log("🔐 Current User: ", authUser?._id);
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

    const handleMessage = async (event) => {
      try {
        const msg = JSON.parse(event.data);
        console.log("📥 WebSocket msg:", msg);

        if (msg.type === "message-read") {
          console.log("📬 Read receipt received:", msg.messageId);

          setMessages((prev) => {
            const updated = prev.map((m) => {
              const sameId = m._id?.toString() === msg.messageId?.toString();
              if (sameId) {
                console.log("✅ Updating read status for message:", m._id);
              }
              return sameId ? { ...m, read: true } : m;
            });

            return [...updated];
          });
        }

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

            // ✅ Real-time read marking
            if (msg.from === user._id && msg.receiver === authUser._id) {
              try {
                await axios.patch(
                  `/messages/${msg._id}/read`,
                  {},
                  { withCredentials: true }
                );

                socket.send(
                  JSON.stringify({
                    type: "message-read",
                    messageId: msg._id,
                    to: msg.from, // sender
                  })
                );

                console.log("✅ Real-time read marked for:", msg._id);
              } catch (err) {
                console.error("❌ Failed to mark real-time read:", err);
              }
            }
          }
        }

        if (msg.type === "message-sent") {
          console.log("✅ Server confirmed message sent:", msg.messageId);

          setMessages((prev) =>
            prev.map((m) =>
              typeof m._id === "number" ? { ...m, _id: msg.messageId } : m
            )
          );
        }

        if (msg.type === "typing" && msg.from === user._id) {
          setIsTyping(true);
        }
        if (msg.type === "stop-typing" && msg.from === user._id) {
          setIsTyping(false);
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
  }, [messages, isTyping]);

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

  const handleTyping = () => {
    if (!socket || !authUser || !user) return;

    socket.send(
      JSON.stringify({
        type: "typing",
        receiver: user._id,
      })
    );

    if (typingTimer.current) clearTimeout(typingTimer.current);

    typingTimer.current = setTimeout(() => {
      socket.send(
        JSON.stringify({
          type: "stop-typing",
          receiver: user._id,
        })
      );
    }, 2000);
  };

  function getDateLabel(date) {
    if (isToday(date)) return "Today";
    if (isYesterday(date)) return "Yesterday";
    return format(date, "eeee, MMMM d");
  }

  let lastMessageDate = null;

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
          {onlineUsers.includes(user._id) && (
            <span className="ml-2 text-green-400 text-sm">● online</span>
          )}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-2 bg-gray-900">
        {messages.map((msg) => {
          const msgDate = new Date(msg.createdAt);
          const showDateSeparator =
            !lastMessageDate || !isSameDay(msgDate, lastMessageDate);
          lastMessageDate = msgDate;

          return (
            <React.Fragment key={msg._id + "-with-date"}>
              {showDateSeparator && (
                <div className="text-center text-gray-400 text-sm my-4">
                  {getDateLabel(msgDate)}
                </div>
              )}
              <div className="flex flex-col items-start">
                <div
                  className={`flex flex-col my-1 max-w-[75%] px-4 py-2 rounded-lg text-white ${
                    msg.fromSelf ? "bg-blue-600 self-end" : "bg-gray-700"
                  }`}
                >
                  {msg.text}

                  <span
                    className={`text-xs flex items-center gap-1 text-gray-400 ${
                      msg.fromSelf ? "self-end pr-2" : "pl-2"
                    }`}
                  >
                    {format(new Date(msg.createdAt), "p")}
                    {msg.fromSelf && (
                      <>
                        {msg.read ? (
                          <span className="text-blue-500">✓✓</span>
                        ) : (
                          <span className="text-gray-400">✓</span>
                        )}
                      </>
                    )}
                  </span>
                </div>
              </div>
            </React.Fragment>
          );
        })}
        <div ref={messageEndRef} />
      </div>

      {isTyping && (
        <div className="flex justify-start pl-4 mb-2">
          <TypingIndiactors />
        </div>
      )}

      <div className="p-3 bg-gray-800 border-t border-gray-700 flex gap-2">
        <input
          type="text"
          className="flex-1 p-2 rounded bg-gray-700 text-white"
          placeholder="Type a message..."
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            handleTyping();
          }}
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
