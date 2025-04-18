import React from "react";

export default function Header({ name }: { name: string }) {
  return (
    <header className="flex justify-between items-center p-6 shadow">
      {/* 로고 영역 */}
      <div className="text-2xl font-bold flex items-center gap-2">
        <div className="w-8 h-8 bg-green-400 rounded-full" />
        <span>스쿠링</span>
      </div>

      {/* 오른쪽: 환영 메시지 */}
      <div className="text-base text-gray-700">
        {name && `환영합니다, ${name}님`}
      </div>
    </header>
  );
}
