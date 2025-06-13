// components/ChatBotModal.tsx
import React, { useState } from 'react';
import axios from 'axios';

interface ChatBotModalProps {
  onClose: () => void;
}

const ChatBotModal: React.FC<ChatBotModalProps> = ({ onClose }) => {
  const [sentence, setSentence] = useState('');
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    if (!question.trim()) return;

    const token = localStorage.getItem('token'); // 또는 Recoil, Redux 등에서 불러올 수도 있음

    setLoading(true);
    setAnswer('');

    try {
      const response = await axios.post(
        '/api/ai/qa',
        {
          sentence,
          question,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`, // 인증 토큰 추가
          },
        }
      );

      setAnswer(response.data.answer || '답변을 받을 수 없습니다.');
    } catch (err) {
      console.error('AI 요청 실패:', err);
      setAnswer('에러가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
      <div className="bg-white w-full max-w-xl p-6 rounded-lg shadow-lg">
        {/* 상단 바 */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">🤖 챗봇 질문하기</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-red-500 text-xl font-bold"
          >
            ×
          </button>
        </div>

        {/* 문맥 입력 */}
        <textarea
          rows={2}
          className="w-full border rounded-md p-2 mb-3 resize-none"
          placeholder="현재 상황을 입력하세요 (예: 현재 이런 상황이야~)"
          value={sentence}
          onChange={(e) => setSentence(e.target.value)}
          disabled={loading}
        />

        {/* 질문 입력 */}
        <textarea
          rows={2}
          className="w-full border rounded-md p-2 mb-4 resize-none"
          placeholder="질문을 입력하세요"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          disabled={loading}
        />

        {/* 질문 전송 버튼 */}
        <button
          onClick={handleSend}
          disabled={loading}
          className={`px-4 py-2 rounded font-medium mb-4 text-white ${
            loading
              ? 'bg-blue-300 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          {loading ? (
            <div className="flex items-center justify-center space-x-2">
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                ></path>
              </svg>
              <span>질문 중...</span>
            </div>
          ) : (
            '질문하기'
          )}
        </button>

        {/* 응답 출력 */}
        <div className="border rounded-md p-3 bg-gray-100 h-40 overflow-y-auto whitespace-pre-line text-gray-800">
          {answer || '여기에 챗봇의 응답이 표시됩니다.'}
        </div>
      </div>
    </div>
  );
};

export default ChatBotModal;
