import React from 'react';
import {
  Home,
  Users,
  MessageCircle,
  Settings,
  LogOut,
  ChevronRight,
  ChevronDown,
} from 'lucide-react';

const sidebarItems = [
  { label: 'mychat', icon: <MessageCircle size={18} />, active: false },
  { label: 'mypage', icon: <Home size={18} />, active: false, chevron: true },
  {
    label: 'Mentoring Lounge',
    icon: <Users size={18} />,
    active: true,
    chevron: true,
  },
];

export const Sidebar = () => {
  return (
    <aside className="w-64 bg-white h-screen flex flex-col justify-between p-6 shadow-[8px_0_30px_rgba(173,216,230,0.2)] z-10">
      {/* 상단 로고 */}
      <div>
        <div className="flex items-center justify-between mb-12">
          <h1 className="font-black text-xl">스쿠링</h1>
          <span className="text-xs text-gray-400">v.01</span>
        </div>

        {/* 메뉴 영역 */}
        <nav className="flex flex-col gap-4">
          {sidebarItems.map((item, idx) => (
            <button
              key={idx}
              className={`
                flex items-center justify-between px-4 py-2 rounded-lg
                ${
                  item.active
                    ? 'bg-[#5D5FEF] text-white'
                    : 'text-gray-500 hover:text-black'
                }
              `}
            >
              <span className="flex items-center gap-3">
                {item.icon}
                <span className="text-sm">{item.label}</span>
              </span>
              {item.chevron && (
                <ChevronRight size={16} className="opacity-60" />
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* 하단 유저 정보 및 로그아웃 */}
      <div className="space-y-6">
        <div className="flex items-center gap-3 text-sm text-red-500 font-medium cursor-pointer">
          <LogOut size={18} />
          <span>Logout Account</span>
        </div>
      </div>
    </aside>
  );
};
