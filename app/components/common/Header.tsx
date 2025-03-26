import React from "react";
import { Button } from "../ui/button";

export default function Header() {
  return (
    <header className="flex justify-between items-center p-6 shadow">
      <div className="text-2xl font-bold flex items-center gap-2">
        <div className="w-8 h-8 bg-green-400 rounded-full" />
        <span>스쿠링</span>
      </div>
      <nav className="flex gap-6 text-base">
        <a href="#" className="hover:text-purple-500">My Chat</a>
        <a href="#" className="hover:text-purple-500">Chat Room</a>
        <Button className="bg-black text-white px-5 py-2 rounded-2xl hover:opacity-90">My Page</Button>
      </nav>
    </header>
  );
}