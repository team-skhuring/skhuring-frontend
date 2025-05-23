import React, { useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ChatRoom = () => {
  const navigate = useNavigate();
  const { roomId } = useParams<{ roomId: string }>();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const chatBoxRef = useRef<HTMLDivElement | null>(null);
  const [client, setClient] = useState<any>(null);
  const [isSurveyOpen, setIsSurveyOpen] = useState(false);


  const location = useLocation();
  const roomName = location.state?.roomTitle || '채팅방';
  const [showForm, setShowForm] = useState(false);
  const [roomTitle, setRoomTitle] = useState('');
  const [category, setCategory] = useState('IT'); // 예시 카테고리
  const [anonymous, setAnonymous] = useState(false);
  const [chatRooms, setChatRooms] = useState<any[]>([]);

  const [isLongPress, setIsLongPress] = useState(false);
  const [longPressTimer, setLongPressTimer] = useState<NodeJS.Timeout | null>(null);
  const [isCreator, setIsCreator] = useState(false);
  const [rating, setRating] = useState(0);

  const handleSubmitRating = () => {
    const score = rating * 5;
    console.log("제출된 별점:", rating, "-> 전송 점수:", score);
    handleCloseRoom(score); // 별점 기반 점수 전달
    setIsSurveyOpen(false);
  };

  const handleMouseDown = () => {
    const timer = setTimeout(() => {
      setIsLongPress(true);
    }, 600); // 600ms 이상 누르면 롱클릭으로 간주
    setLongPressTimer(timer);
  };

  const handleMouseUp = () => {
    if (longPressTimer) {
      clearTimeout(longPressTimer);
      setLongPressTimer(null);
    }
  };
  const handleCloseRoom = async (score: number) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `http://localhost:8070/chat/close/${roomId}`,
        { score }, // 별점 전달
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );
      alert("채팅방이 종료되었습니다.");
      navigate("/mentoringLounge");
    } catch (error) {
      console.error("방 종료 실패", error);
    }
  };
  
  const handleExitRoom = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(`http://localhost:8070/chat/leave/${roomId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('채팅방에서 나갔습니다.');
      navigate('/mentoringLounge');
    } catch (error) {
      console.error("나가기 실패", error);
    }
  };

  useEffect(() => {
    // 채팅방 목록에서 방장 여부를 확인하여 isCreator 상태 업데이트
    const currentRoom = chatRooms.find(room => String(room.roomId) === String(roomId));
    if (currentRoom) {
      setIsCreator(currentRoom.creator); // 해당 방의 creator 상태로 설정
    }
    console.log(currentRoom); // 현재 방 정보 확인
    console.log(isCreator); // 방장 여부 확인
  }, [chatRooms, roomId]);

  useEffect(() => {
    if (isLongPress) {
      if (isCreator) {
        const confirmClose = window.confirm('고민 해결 완료하시겠습니까?');
        if (confirmClose) {
          setIsSurveyOpen(true); // 설문조사 모달 열기
         // handleCloseRoom(); // 방장 종료 로직
        }
      } else {
        const confirmExit = window.confirm('채팅방에서 나가시겠습니까?');
        if (confirmExit) {
          handleExitRoom(); // 참가자 나가기 로직
        }
      }
      setIsLongPress(false); // 초기화
    }
  }, [isLongPress]);
  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:8070/chat/rooms/me', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setChatRooms(response.data);  // 서버에서 받은 채팅방 목록을 상태에 저장
      } catch (error) {
        console.error('채팅방 목록을 불러오는 데 실패했습니다.', error);
      }
    };

    fetchChatRooms();
  }, []);
  useEffect(() => {
    console.log(chatRooms);  // chatRooms 상태 값 확인
  }, [chatRooms]);
  const handleJoinRoom = (roomId: string, roomTitle: string) => {
    // 채팅방 제목을 클릭하면 해당 채팅방으로 이동
    navigate(`/mychat/${roomId}`, { state: { roomTitle: roomTitle } });
  };

  useEffect(() => {
    const fetchChatHistory = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(`http://localhost:8070/chat/history/${roomId}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMessages(response.data);
      } catch (error) {
        console.error('채팅 기록을 불러오는 데 실패했습니다.', error);
      }
    };

    fetchChatHistory();
  }, [roomId]);

  

  useEffect(() => {
    const sock = new SockJS('http://localhost:8070/connect');
    const stompClient = Stomp.over(sock);
    const token = localStorage.getItem("token");

    stompClient.connect(
      { Authorization: `Bearer ${token}` },
      () => {
        console.log('WebSocket connected');

        stompClient.subscribe(`/topic/${roomId}`, (message: any) => {
          if (message.body) {
            const receivedMessage = JSON.parse(message.body);

            setMessages(prev => {
              const isDuplicate = prev.some(
                msg => msg.content === receivedMessage.content && msg.sender === receivedMessage.sender
              );
              if (isDuplicate) return prev;
              return [...prev, receivedMessage];
            });
          }
        });

        setClient(stompClient);
      }
    );

    const handleBeforeUnload = () => {
      if (stompClient && stompClient.connected) {
        stompClient.disconnect(() => {
          console.log('WebSocket disconnected from beforeunload');
        });
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      if (stompClient && stompClient.connected) {
        stompClient.disconnect(() => {
          console.log('WebSocket disconnected');
        });
      }
    };
  }, [roomId]);

  const sendMessage = () => {
    if (client && client.connected && newMessage.trim()) {
      const name = localStorage.getItem("name");
      const message = {
        sender: name,
        content: newMessage,
      };

      client.send(`/publish/${roomId}`, {}, JSON.stringify(message));
      setMessages(prev => [...prev, message]);
      setNewMessage('');
    } else {
      console.error('WebSocket is not connected or message is empty');
    }
  };

  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newMessage.trim()) {
      sendMessage();
    }
  };

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
      setRoomTitle('');
      setCategory('STUDY');
      setAnonymous(false);
      setShowForm(false);
    } catch (error) {
      alert('채팅방 생성 실패');
      console.error(error);
    }
  };
  
  

  return (
    <div className="flex h-screen">
      {/* Left Chat Area */}
      <div className="flex flex-col w-3/4 border-r bg-white">
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <div className="text-lg font-semibold">{roomName}</div>
            <div className="text-sm text-green-500">● online</div>
          </div>
          <button className="bg-purple-100 text-purple-700 px-4 py-2 rounded font-medium text-sm">
            Call
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-3" ref={chatBoxRef}>
  {messages.map((msg, idx) => {
    const username = localStorage.getItem('name');
    const isMine = msg.sender === username;

    return (
      <div
        key={idx}
        className={`flex flex-col ${isMine ? 'items-end' : 'items-start'}`}
      >
        {/* 이름은 상대방만 표시 */}
        {!isMine && (
          <span className="text-xs text-gray-500 mb-1 ml-2">
            {msg.sender}
          </span>
        )}

        {/* 말풍선 */}
        <div
          className={`max-w-xs px-4 py-2 rounded-2xl text-sm shadow-md ${
            isMine
              ? 'bg-blue-500 text-white rounded-br-none'
              : 'bg-gray-100 text-gray-800 rounded-bl-none'
          }`}
        >
          {msg.content}
        </div>
      </div>
    );
  })}
</div>

        <div className="flex items-center p-4 border-t">
          <input
            type="text"
            className="flex-1 border rounded-lg p-2"
            placeholder="Type a message"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyUp={handleKeyUp}
          />
          <button
            onClick={sendMessage}
            className="ml-2 text-white bg-blue-500 px-4 py-2 rounded-lg"
          >
            ➤
          </button>
        </div>
      </div>

      {/* Right Message List */}
      <div className="w-1/4 bg-white p-4 overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <div className="font-semibold text-lg">My Chat</div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="text-purple-500 text-2xl"
          >
            ＋
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
        

    <div className="space-y-4">
      {chatRooms.map((room) => (
        <div key={room.roomId} className="flex items-center space-x-3">
          {/* 채팅방의 이미지 또는 아이콘 */}
          <div className="w-10 h-10 rounded-full bg-gray-300" />
          
          {/* 채팅방 제목과 최근 메시지 표시 */}
          <div
          onClick={() => handleJoinRoom(room.roomId, room.title)}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          >
            <div className="font-semibold text-sm">{room.title}</div>
            <div className="text-xs text-gray-500">
              {/* 최근 메시지 또는 예시 텍스트 */}
              {room.recentMessage || 'No messages yet'}
            </div>
          </div>
        </div>
      ))}
    </div>
      </div>
      {isSurveyOpen && (
  <div className="fixed inset-0 flex items-center justify-center ">
    <div className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-sm text-center">
      <h2 className="text-xl font-bold mb-4">멘토 평가</h2>
      <p className="mb-4 text-gray-700">멘토링에 만족하셨나요? 별점으로 평가해주세요.</p>

      {/* 별점 선택 */}
      <div className="flex justify-center gap-1 mb-6">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            onClick={() => setRating(star)}
            className={`text-3xl ${
              rating >= star ? "text-yellow-400" : "text-gray-300"
            }`}
          >
            ★
          </button>
        ))}
      </div>

      {/* 버튼 영역 */}
      <div className="flex justify-end gap-2">
        <button
          onClick={() => setIsSurveyOpen(false)}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded"
        >
          닫기
        </button>
        <button
          onClick={handleSubmitRating}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          제출
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
};

export default ChatRoom;