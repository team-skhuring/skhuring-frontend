import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const mentors = [
  {
    id: '1',
    name: '영어 회화 초보 탈출',
    category: '언어',
    mentor: 'Floyd Miles',
    creator: '최지은',
    count: '3명',
    status: 'Active',
  },
  {
    id: '2',
    name: '개발자 진로 고민방',
    category: '진로',
    mentor: 'Ronald Richards',
    creator: '김민준',
    count: '4명',
    status: 'Active',
  },
  {
    id: '3',
    name: '경제 스터디 그룹',
    category: '경제',
    mentor: 'Marvin McKinney',
    creator: '이수정',
    count: '5명',
    status: 'Active',
  },
  {
    id: '4',
    name: '중간고사 대비반',
    category: '성적',
    mentor: 'Jerome Bell',
    creator: '정해인',
    count: '3명',
    status: 'Inactive',
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
    <div className=" min-h-screen p-12">
      <h1 className="text-2xl font-semibold text-gray-800 mb-10">
        Mentoring Lounge
      </h1>

      <div className="flex items-center gap-4 justify-between mb-10">
        <div className="flex items-center gap-4 flex-1">
          <input
            type="text"
            placeholder="Search"
            className="bg-[#f1f5f9] text-sm text-gray-600 border border-gray-200 rounded-md px-4 py-2 w-1/3 placeholder:text-gray-400"
          />
          <select className="bg-[#f1f5f9] text-sm text-gray-600 border border-gray-200 rounded-md px-4 py-2 w-1/4">
            <option>category</option>
            <option>IT</option>
            <option>언어</option>
            <option>진로</option>
            <option>경제</option>
            <option>성적</option>
            <option>교재 나눔</option>
          </select>
        </div>
        <button className="bg-[#6366f1] text-white px-5 py-2 text-sm rounded-md hover:bg-[#4f46e5]">
          채팅방 만들기
        </button>
      </div>

      <div className="overflow-x-auto bg-white rounded-xl shadow-sm">
        <table className="min-w-full text-sm">
          <thead className="text-gray-400 text-xs border-b">
            <tr className="uppercase">
              <th className="py-3 px-6 text-left font-medium">주제</th>
              <th className="py-3 px-6 text-left font-medium">카테고리</th>
              <th className="py-3 px-6 text-left font-medium">멘토</th>
              <th className="py-3 px-6 text-left font-medium">생성자</th>
              <th className="py-3 px-6 text-left font-medium">인원수</th>
              <th className="py-3 px-6 text-center font-medium">입장</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {currentMentors.map((mentor, idx) => (
              <tr
                key={idx}
                className="border-b hover:bg-[#f8fafc] cursor-pointer"
                onClick={() => handleRowClick(mentor.id)}
              >
                <td className="py-4 px-6 font-medium">{mentor.name}</td>
                <td className="py-4 px-6">{mentor.category}</td>
                <td className="py-4 px-6">{mentor.mentor}</td>
                <td className="py-4 px-6">{mentor.creator}</td>
                <td className="py-4 px-6">{mentor.count}</td>
                <td className="py-4 px-6 text-center">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      mentor.status === 'Active'
                        ? 'bg-emerald-100 text-emerald-600'
                        : 'bg-red-100 text-red-500'
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

      <div className="flex justify-center mt-10 gap-1">
        {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((page) => (
          <button
            key={page}
            onClick={() => handlePageChange(page)}
            className={`w-8 h-8 text-sm rounded-md border flex items-center justify-center ${
              page === currentPage
                ? 'bg-[#6366f1] text-white'
                : 'bg-white text-gray-600'
            }`}
          >
            {page}
          </button>
        ))}
      </div>
    </div>
  );
}
