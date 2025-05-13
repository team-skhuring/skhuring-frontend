import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Users, MessageCircle, LogOut, ChevronRight } from 'lucide-react';

const sidebarItems = [
  {
    label: 'Mentoring Lounge',
    icon: <Users size={18} />,
    active: true,
    location: '/mentoringLounge',
  },
  {
    label: 'mychat',
    icon: <MessageCircle size={18} />,
    active: false,
    chevron: false,
    location: '/mychat/1',
  },
  {
    label: 'mypage',
    icon: <Home size={18} />,
    active: false,
    chevron: false,
    location: '/mypage',
  },
];

export const Sidebar = () => {
  const navigate = useNavigate();
  return (
    <aside className="w-64 bg-white h-screen flex flex-col justify-between p-6 shadow-[8px_0_30px_rgba(173,216,230,0.2)] z-10">
      {/* 상단 로고 */}
      <div>
        <div className="flex items-center justify-between mb-12">
          <h1 className="font-black text-xl" onClick={() => navigate('/')}>
            스쿠링
          </h1>
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
              onClick={() => {
                navigate(item.location);
              }}
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
