import React, { useState } from "react";
import { LogOut, MessageCircle, User } from "lucide-react";
import Divider from "@mui/material/Divider";
import Button from "@mui/material/Button";
import ProfileSection from "../components/Auth/Chat/ProfileSection";

export default function ChatPage() {
  const [activeSection, setActiveSection] = useState("chat");

  return (
    <div className="flex h-screen bg-gray-900 text-white">
      <div className="w-20 md:w-40 bg-gray-800 flex flex-col justify-between py-4 px-2">
        <div>
          <div className="p-3 border-b border-gray-700 flex gap-2 justify-center items-center">
            <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg">
              <MessageCircle className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold hidden md:inline">Texora</h1>
          </div>

          <Divider variant="middle" />

          <div className="flex flex-col gap-4 justify-center items-center mt-4">
            <div className="flex justify-center items-center hover:bg-gray-700 cursor-pointer p-2 rounded w-full">
              <button
                onClick={() => setActiveSection("chat")}
                className="w-12 h-12 text-gray-400 hover:text-white hover:bg-gray-700 rounded-2xl cursor-pointer flex justify-center items-center"
              >
                <MessageCircle className="w-8 h-8" />
              </button>

              <h3 className="font-bold hidden md:inline">Chats</h3>
            </div>

            <div className="flex justify-center items-center hover:bg-gray-700 cursor-pointer p-2 rounded w-full">
              <button
                onClick={() => setActiveSection("profile")}
                className="w-12 h-12 text-gray-400 hover:text-white rounded-2xl flex justify-center items-center"
              >
                <User className="w-8 h-8" />
              </button>

              <h3 className="font-bold hidden md:inline">Profile</h3>
            </div>
          </div>
        </div>
        <div className="px-4">
           <div className="flex justify-center items-center cursor-pointer p-2 rounded w-full">
              <button
                onClick={() => setActiveSection("profile")}
                className="w-12 h-12 text-gray-400 hover:text-white rounded-2xl flex justify-center items-center cursor-pointer"
              >
                <LogOut className="w-8 h-8" />
              </button>

              <h3 className="font-bold hidden md:inline">Logout</h3>
            </div>
        </div>
      </div>

      <ProfileSection/>
    </div>
  );
}
