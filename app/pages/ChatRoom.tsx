// ChatRoom.tsx
import React, { useState, useEffect, useRef } from 'react';
import SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs';
import { useParams } from 'react-router-dom';

const ChatRoom = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [messages, setMessages] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const chatBoxRef = useRef<HTMLDivElement | null>(null);

  const [client, setClient] = useState<any>(null); // 수정: client를 useState로 관리

  useEffect(() => {
    const sock = new SockJS('/api/connect');
    const stompClient = Stomp.over(sock);
    const token = localStorage.getItem("token");
    stompClient.connect({
      Authorization : `Bearer ${token}`
    }, () => {
      console.log('WebSocket connected');

      stompClient.subscribe(`/topic/1`, (message: any) => {
        if (message.body) {
          const body = JSON.parse(message.body);
          const receivedMessage = body.message;
      
          // 동일한 메시지가 이미 있는지 확인 후 중복되지 않도록 처리
          setMessages(prev => {
            const isDuplicate = prev.some(msg => msg.content === receivedMessage.content && msg.sender === receivedMessage.sender);
            if (isDuplicate) {
              return prev; // 이미 있는 메시지라면 상태 변경 안 함
            }
            return [...prev, receivedMessage];
          });
        }
      });
      setClient(stompClient); // 연결 완료 후 클라이언트 저장
    });

    const handleBeforeUnload = () => {
      if (stompClient && stompClient.connected) {
        stompClient.disconnect(() => {
          console.log('WebSocket disconnected from beforeunload');
        });
      }
    };

    // 이벤트 등록
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      if (stompClient && stompClient.connected) {
        stompClient.disconnect(() => {
          console.log('WebSocket disconnected');
        });
      }
    };
  }, [roomId]);

  const sendMessage = () => {
    if (client && client.connected && newMessage.trim()) { // 내용이 비지 않으면
      const name = localStorage.getItem("name");
      const message = {
        sender: name,
        content: newMessage,
      };
      client.send(`/publish/1`, {}, JSON.stringify({ message }));
      setMessages(prev => [...prev, message]);
      setNewMessage(''); // 메시지 전송 후 입력창 초기화
    } else {
      console.error('WebSocket is not connected or message is empty');
    }
  };
  
  const handleKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newMessage.trim()) {
      sendMessage();
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
              <div key={idx} className={`mb-2 ${isMine ? 'flex justify-end' : 'flex justify-start'}`}>
                <div className="flex items-end">
                  {/* 이름 표시 */}
                  {!isMine && (
                    <div className="text-sm text-gray-500 mr-2">{msg.sender}</div>
                  )}
                  <div
                    className={`p-2 rounded-lg max-w-xs break-words ${isMine ? 'bg-blue-500 text-white' : 'bg-gray-300 text-black'}`}
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
          <button className="text-purple-500">+</button>
        </div>
        <div className="space-y-4">
          {/* 친구목록은 하드코딩 */}
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
