// components/MemoModal.tsx
import React from "react";

interface MemoModalProps {
  memoTitle: string;
  memoContent: string;
  setMemoTitle: (value: string) => void;
  setMemoContent: (value: string) => void;
  onClose: () => void;
  onSave: () => void;
}

const MemoModal: React.FC<MemoModalProps> = ({
  memoTitle,
  memoContent,
  setMemoTitle,
  setMemoContent,
  onClose,
  onSave,
}) => {
  return (
    <div className="fixed inset-0 bg-opacity-50 flex justify-center items-center z-50 bg-black/50">
      <div className="bg-white w-[700px] p-6 rounded shadow-lg relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-4">메모</h2>

        <input
          className="w-full border p-2 rounded mb-4"
          placeholder="제목 입력"
          value={memoTitle}
          onChange={(e) => setMemoTitle(e.target.value)}
        />

        <textarea
          className="w-full h-40 border p-2 rounded mb-4"
          placeholder="메모 내용을 입력하세요"
          value={memoContent}
          onChange={(e) => setMemoContent(e.target.value)}
        />

        <div className="flex justify-between items-center">
          <button
            className="bg-purple-600 text-white px-4 py-2 rounded"
            onClick={onSave}
          >
            저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default MemoModal;
