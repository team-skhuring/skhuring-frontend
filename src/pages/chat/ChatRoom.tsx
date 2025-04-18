import React, { useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ChatRoom = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const chatBoxRef = useRef<HTMLDivElement | null>(null);
  const [client, setClient] = useState<any>(null);

  const [showForm, setShowForm] = useState(false);
  const [roomTitle, setRoomTitle] = useState('');
  const [category, setCategory] = useState('IT'); // 예시 카테고리
  const [anonymous, setAnonymous] = useState(false);

  useEffect(() => {
    const sock = new SockJS('http://localhost:8070/connect');
    const stompClient = Stomp.over(sock);
    const token = localStorage.getItem('token');

    stompClient.connect({ Authorization: `Bearer ${token}` }, () => {
      console.log('WebSocket connected');

      stompClient.subscribe(`/topic/${roomId}`, (message: any) => {
        if (message.body) {
          const receivedMessage = JSON.parse(message.body);

          setMessages((prev) => {
            const isDuplicate = prev.some(
              (msg) =>
                msg.content === receivedMessage.content &&
                msg.sender === receivedMessage.sender
            );
            if (isDuplicate) return prev;
            return [...prev, receivedMessage];
          });
        }
      });

      setClient(stompClient);
    });

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
      const name = localStorage.getItem('name');
      const message = {
        sender: name,
        content: newMessage,
      };

      client.send(`/publish/${roomId}`, {}, JSON.stringify(message));
      setMessages((prev) => [...prev, message]);
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
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:8070/chat/room',
        {
          title: roomTitle,
          category,
          anonymous,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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
    <div className="flex h-screen bg-gray-100">
      {/* 왼쪽 사이드바 */}
      <div className="w-1/6 bg-white p-4 flex flex-col justify-between border-r">
        <div>
          <div className="text-2xl font-bold mb-6">스쿠링</div>
          <nav className="space-y-4">
            <div className="text-gray-700 font-semibold">Chat</div>
            <div className="text-gray-700 font-semibold">MyPage</div>
          </nav>
        </div>
        <div className="text-sm text-gray-500">
          <div>Evano</div>
          <div>Project Manager</div>
        </div>
      </div>

      {/* 중앙 채팅영역 */}
      <div className="flex flex-col w-2/3 p-4">
        <div className="border-b pb-4 mb-4">
          <div className="text-xl font-bold">Chat Room {roomId}</div>
        </div>

        <div className="flex-1 overflow-y-auto h-[400px]" ref={chatBoxRef}>
          {messages.map((msg, idx) => {
            const username = localStorage.getItem('name');
            const isMine = msg.sender === username;
            return (
              <div
                key={idx}
                className={`mb-2 ${
                  isMine ? 'flex justify-end' : 'flex justify-start'
                }`}
              >
                <div className="flex items-end">
                  {!isMine && (
                    <div className="text-sm text-gray-500 mr-2">
                      {msg.sender}
                    </div>
                  )}
                  <div
                    className={`p-2 rounded-lg max-w-xs break-words ${
                      isMine
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-300 text-black'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 입력창 */}
        <div className="mt-4 flex items-center">
          <input
            type="text"
            className="flex-1 p-2 rounded-lg border"
            placeholder="Type your message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyUp={handleKeyUp}
          />
          <button
            onClick={sendMessage}
            className="ml-2 px-4 py-2 bg-purple-500 text-white rounded-lg"
          >
            Send
          </button>
        </div>
      </div>

      {/* 오른쪽 메시지 리스트 */}
      <div className="w-1/6 bg-white p-4 border-l">
        <div className="flex justify-between items-center mb-4">
          <div className="font-bold">Messages</div>
          <button
            onClick={() => setShowForm((prev) => !prev)}
            className="text-purple-500 text-xl"
          >
            +
          </button>
        </div>

        {/* 채팅방 생성 폼 */}
        {showForm && (
          <div className="space-y-2 p-2 border rounded">
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
              className="w-full bg-purple-500 text-white p-2 rounded"
              onClick={handleCreateRoom}
            >
              생성
            </button>
          </div>
        )}

        {/* 친구목록 (하드코딩) */}
        <div className="space-y-4 mt-4">
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gray-300 rounded-full" />
            <div>
              <div className="font-semibold">Florencio Dorrance</div>
              <div className="text-sm text-gray-500">woohooo 🔥</div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gray-300 rounded-full" />
            <div>
              <div className="font-semibold">Elmer Laverty</div>
              <div className="text-sm text-gray-500">Haha oh man 😂</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;
