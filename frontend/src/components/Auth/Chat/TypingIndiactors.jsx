import React from "react";

export default function TypingIndiactors() {
  return (
    <div className="flex items-center gap-1 px-4 py-2">
      <div className="bg-gray-400 rounded-full w-2 h-2 animate-bounce [animation-delay:0ms]"></div>
      <div className="bg-gray-400 rounded-full w-2 h-2 animate-bounce [animation-delay:200ms]"></div>
      <div className="bg-gray-400 rounded-full w-2 h-2 animate-bounce [animation-delay:400ms]"></div>
    </div>
  );
}
