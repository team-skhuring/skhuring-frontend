import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  Users,
  MessageCircle,
  LogOut,
  ChevronRight,
} from 'lucide-react';

const sidebarItems = [
  { label: 'mychat', icon: <MessageCircle size={18} />, path: '/mychat/1', chevron: false },
  { label: 'mypage', icon: <Home size={18} />, path: '/mypage', chevron: false },
  {
    label: 'Mentoring Lounge',
    icon: <Users size={18} />,
    path: '/mentoringLounge',
    chevron: true,
  },
];


export const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="w-64 bg-white h-screen flex flex-col justify-between p-6 shadow-[8px_0_30px_rgba(173,216,230,0.2)] z-10">
      {/* 상단 로고 */}
      <div>
        <div className="flex items-center justify-between mb-12">
          <h1
            className="font-black text-xl cursor-pointer"
            onClick={() => navigate('/')}
          >
            스쿠링
          </h1>
          <span className="text-xs text-gray-400">v.01</span>
        </div>

        {/* 메뉴 영역 */}
        <nav className="flex flex-col gap-4">
          {sidebarItems.map((item, idx) => {
            const isActive = location.pathname.startsWith(item.path);
            return (
              <button
                key={idx}
                onClick={() => navigate(item.path)}
                className={`
                  flex items-center justify-between px-4 py-2 rounded-lg
                  ${isActive ? 'bg-[#5D5FEF] text-white' : 'text-gray-500 hover:text-black'}
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
            );
          })}
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
