import React, { useEffect, useState } from "react";
// import { useAuth } from '../../../context/AuthContext';
import axios from "../../../api/axios";
import { useSocket } from "../../../context/SocketContext";

export default function UserList({ onSelectUser }) {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const { onlineUsers } = useSocket();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get("/user/people");
        setUsers(res.data.users);
        setFiltered(res.data.users);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    setFiltered(
      users.filter((u) =>
        `${u.firstName} ${u.lastName}`
          .toLowerCase()
          .includes(search.toLowerCase())
      )
    );
  }, [search, users]);

  return (
    <div className="h-full flex flex-col p-2">
      <input
        type="text"
        placeholder="Search user..."
        className="p-3 m-2 rounded-3xl bg-gray-700 text-white"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <div className="flex-1 overflow-y-auto">
        {filtered.map((u) => {
          const isOnline = onlineUsers.includes(u._id);

          return (
            <div key={u._id} className="relative flex items-center gap-3 p-3" onClick={() => onSelectUser(u)}>
              <img src={u.avatar} className="w-10 h-10 rounded-full" />

              {isOnline && (
                <span className="absolute left-9 top-10 w-3 h-3 bg-green-400 rounded-full border-2 border-gray-900" />
              )}

              <div>
                <p className="text-white font-medium">
                  {u.firstName} {u.lastName}
                </p>
              </div>
            </div>
          );
        })}

        {filtered.length === 0 && (
          <p className="text-center text-gray-400 mt-4">No users found</p>
        )}
      </div>
    </div>
  );
}
