import React, { useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { useParams, useLocation } from 'react-router-dom';
import axios from 'axios';

const ChatRoom = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const chatBoxRef = useRef<HTMLDivElement | null>(null);
  const [client, setClient] = useState<any>(null);

  

  const location = useLocation();
  const roomName = location.state?.roomTitle || '채팅방';
  const [showForm, setShowForm] = useState(false);
  const [roomTitle, setRoomTitle] = useState('');
  const [category, setCategory] = useState('IT'); // 예시 카테고리
  const [anonymous, setAnonymous] = useState(false);

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
          <div className="font-semibold text-lg">Messages</div>
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
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gray-300" />
            <div>
              <div className="font-semibold text-sm">Florencio Dorrance</div>
              <div className="text-xs text-gray-500">woohooo 🔥</div>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-gray-300" />
            <div>
              <div className="font-semibold text-sm">Elmer Laverty</div>
              <div className="text-xs text-gray-500">Haha oh man 😂</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatRoom;