import React, { useEffect, useState } from 'react';
// import { useAuth } from '../../../context/AuthContext';
import axios from "../../../api/axios";

export default function UserList({ onSelectUser }) {
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState('');
  // const { user } = useAuth();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await axios.get('/user/people');
        setUsers(res.data.users); 
        setFiltered(res.data.users);
      } catch (error) {
        console.error('Failed to fetch users:', error);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    setFiltered(
      users.filter((u) =>
        `${u.firstName} ${u.lastName}`.toLowerCase().includes(search.toLowerCase())
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
        {filtered.map((u) => (
          <div
            key={u._id}
            onClick={() => onSelectUser(u)} // ✅ trigger callback
            className="flex items-center gap-3 p-3 hover:bg-gray-700 cursor-pointer border-b border-gray-600"
          >
            <img
              src={u.avatar}
              alt={u.firstName}
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="text-white font-medium">
                {u.firstName} {u.lastName}
              </p>
            </div>
          </div>
        ))}

        {filtered.length === 0 && (
          <p className="text-center text-gray-400 mt-4">No users found</p>
        )}
      </div>
    </div>
  );
}
