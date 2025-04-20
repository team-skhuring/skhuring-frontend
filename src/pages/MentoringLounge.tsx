import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function MentoringLounge() {
  const navigate = useNavigate();

  const [roomTitle, setRoomTitle] = useState('');
  const [category, setCategory] = useState('IT'); // 예시 카테고리
  const [anonymous, setAnonymous] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [mentors, setMentors] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  const totalPages = Math.ceil(mentors.length / itemsPerPage);

  const handleRowClick = (roomId: string) => {
    navigate(`/mychat/${roomId}`);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const currentMentors = mentors.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // 채팅방 목록을 가져오는 함수
  const fetchChatRooms = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:8070/chat/rooms/list', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('응답 데이터:', response.data); // ✅ 콘솔 출력 추가됨

      const rooms = response.data.map((room: any) => ({
        id: room.roomId,
        name: room.title,
        category: room.category,
        mentor: room.mentor_status ? true : false,
        creator: room.creatorName || 'Unknown',
        count: `${room.currentMemberCount || 0}명`,
        status: room.full ? true : false,
      }));

      setMentors(rooms);
    } catch (error) {
      console.error('채팅방 조회 실패:', error);
    }
  };

  useEffect(() => {
    fetchChatRooms(); // 컴포넌트 로드 시 채팅방 목록을 가져옵니다.
  }, []);

  const handleCreateRoom = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post('http://localhost:8070/chat/room', {
        title: roomTitle,
        category,
        anonymous,
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert('채팅방이 생성되었습니다!');
      fetchChatRooms();  // 채팅방 생성 후 목록 갱신
      setRoomTitle('');   // 폼 초기화
      setCategory('IT');  // 기본 카테고리 설정
      setAnonymous(false); // 익명 설정 초기화
      setShowForm(false); // 폼 닫기
    } catch (error) {
      alert('채팅방 생성 실패');
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen p-12">
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
        <button onClick={() => setShowForm(!showForm)} className="bg-[#6366f1] text-white px-5 py-2 text-sm rounded-md hover:bg-[#4f46e5]">
          채팅방 만들기
        </button>
      </div>
      {showForm && (
          <div className="p-3 border rounded space-y-3 mb-4">
            <input
              type="text"
              placeholder="채팅방 주제"
              className="w-full p-2 border rounded"
              value={roomTitle}
              onChange={(e) => setRoomTitle(e.target.value)}
            />
            <select
              className="w-full p-2 border rounded"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="IT">IT</option>
              <option value="진로">진로</option>
              <option value="패션">패션</option>
              <option value="창업">창업</option>
            </select>
            <label className="flex items-center space-x-2 text-sm">
              <input
                type="checkbox"
                checked={anonymous}
                onChange={(e) => setAnonymous(e.target.checked)}
              />
              <span>익명으로 참여</span>
            </label>
            <button
              className="w-full bg-purple-500 text-white py-2 rounded"
              onClick={handleCreateRoom}
            >
              생성
            </button>
          </div>
        )}

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
                <td className="py-4 px-6">{mentor.mentor ? '멘토있음' : '멘토없음'}</td>
                <td className="py-4 px-6">{mentor.creator}</td>
                <td className="py-4 px-6">{mentor.count}</td>
                <td className="py-4 px-6 text-center">
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${
                      mentor.status === false
                        ? 'bg-emerald-100 text-emerald-600'
                        : 'bg-red-100 text-red-500'
                    }`}
                  >
                      {mentor.status === false ? '입장 가능' : '가득 참'}
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
