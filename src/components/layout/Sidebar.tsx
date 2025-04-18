import React from 'react';
import { useNavigate } from 'react-router-dom';

import { Home, Users, MessageCircle, Settings } from 'lucide-react';

const sidebarItems = [
  { label: '홈', icon: <Home size={20} /> },
  { label: '멘토링', icon: <Users size={20} /> },
  { label: '메시지', icon: <MessageCircle size={20} /> },
  { label: '설정', icon: <Settings size={20} /> },
];

export const Sidebar = () => {
  return (
    <aside className="w-60 bg-white h-screen fixed top-0 left-0 flex flex-col p-6 shadow">
      <h2 className="text-2xl font-bold mb-8">멘토링 센터</h2>
      <nav className="flex flex-col gap-4">
        {sidebarItems.map((item, idx) => (
          <button
            key={idx}
            className="flex items-center gap-3 p-2 hover:bg-gray-200 rounded"
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
};
