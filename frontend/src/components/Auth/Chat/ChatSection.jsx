import React, { useState } from "react";
import UserList from "./UserList";
import ChatWindow from "./ChatWindow";
import Placeholder from "./Placeholder";
import { useAuth } from "../../../context/AuthContext";

export default function ChatSection() {
  const [selectedUser, setSelectedUser] = useState(null);

  const { user: authUser, loading } = useAuth();

  if (loading) return <div className="text-white p-4">Loading chat...</div>;

  if (!authUser)
    return <div className="text-red-500 p-4">Unauthorized. Please log in.</div>;

  return (
    <div className="flex w-full h-full">
      <div className="w-1/3 border-r border-gray-700 bg-gray-800">
        <UserList onSelectUser={setSelectedUser} />
      </div>

      <div className="flex-1 bg-gray-900">
        {selectedUser ? (
          <ChatWindow
            key={selectedUser._id}
            user={selectedUser}
            onBack={() => setSelectedUser(null)}
          />
        ) : (
          <Placeholder />
        )}
      </div>
    </div>
  );
}
