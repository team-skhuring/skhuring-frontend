// src/pages/MentoringLounge.tsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const mentors = [
  {
    id: '1',
    name: 'Floyd Miles',
    category: '언어',
    contact: '(205) 555-0100',
    email: 'floyd@yahoo.com',
    country: 'Kiribati',
    status: 'Inactive',
  },
  {
    id: '2',
    name: 'Ronald Richards',
    category: '진로',
    contact: '(302) 555-0107',
    email: 'ronald@adobe.com',
    country: 'Israel',
    status: 'Inactive',
  },
  {
    id: '3',
    name: 'Marvin McKinney',
    category: '경제',
    contact: '(252) 555-0126',
    email: 'marvin@tesla.com',
    country: 'Iran',
    status: 'Active',
  },
  {
    id: '4',
    name: 'Jerome Bell',
    category: '성적',
    contact: '(629) 555-0129',
    email: 'jerome@google.com',
    country: 'Réunion',
    status: 'Active',
  },
];

export default function MentoringLounge() {
  const navigate = useNavigate();

  const handleRowClick = (mentorId: string) => {
    navigate(`/mychat/${mentorId}`);
  };

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  const totalPages = Math.ceil(mentors.length / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const currentMentors = mentors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="flex min-h-screen">
      {/* Main Content */}
      <main className="ml-64 flex-1 p-8 bg-gray-50">
        <h1 className="text-3xl font-bold mb-8">Mentoring Lounge</h1>

        {/* 검색 + 카테고리 */}
        <div className="flex items-center gap-4 mb-6">
          <input
            type="text"
            placeholder="Search"
            className="border p-2 rounded w-1/3"
          />
          <select className="border p-2 rounded w-1/4">
            <option>Category</option>
            <option>IT</option>
            <option>언어</option>
            <option>진로</option>
            <option>경제</option>
            <option>성적</option>
            <option>교재 나눔</option>
          </select>
        </div>

        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          채팅방 만들기
        </button>

        {/* 테이블 */}
        <div className="overflow-x-auto bg-white rounded-lg shadow">
          <table className="min-w-full">
            <thead className="bg-gray-100 text-gray-600 uppercase text-sm">
              <tr>
                <th className="py-3 px-6 text-left">주제</th>
                <th className="py-3 px-6 text-left">카테고리</th>
                <th className="py-3 px-6 text-left">연락처</th>
                <th className="py-3 px-6 text-left">이메일</th>
                <th className="py-3 px-6 text-left">국가</th>
                <th className="py-3 px-6 text-center">상태</th>
              </tr>
            </thead>
            <tbody>
              {currentMentors.map((mentor, idx) => (
                <tr
                  key={idx}
                  className="border-b hover:bg-gray-100"
                  onClick={() => handleRowClick(mentor.id)}
                >
                  <td className="py-3 px-6">{mentor.name}</td>
                  <td className="py-3 px-6">{mentor.category}</td>
                  <td className="py-3 px-6">{mentor.contact}</td>
                  <td className="py-3 px-6">{mentor.email}</td>
                  <td className="py-3 px-6">{mentor.country}</td>
                  <td className="py-3 px-6 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        mentor.status === 'Active'
                          ? 'bg-green-100 text-green-600'
                          : 'bg-red-100 text-red-600'
                      }`}
                    >
                      {mentor.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 페이지네이션 */}
        <div className="flex justify-center mt-6 gap-2">
          {Array.from({ length: totalPages }, (_, idx) => idx + 1).map(
            (page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-4 py-2 rounded ${
                  page === currentPage
                    ? 'bg-blue-500 text-white'
                    : 'bg-white border text-gray-700'
                }`}
              >
                {page}
              </button>
            )
          )}
        </div>
      </main>
    </div>
  );
}
