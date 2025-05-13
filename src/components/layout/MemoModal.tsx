// components/MemoModal.tsx
import { Button } from '../ui/button';

interface MemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  editedTitle: string;
  setEditedTitle: (title: string) => void;
  editedContent: string;
  setEditedContent: (content: string) => void;
  onUpdateMemo: () => void;
  onDeleteMemo: () => void;
}

export default function MemoModal({
  isOpen,
  onClose,
  editedTitle,
  setEditedTitle,
  editedContent,
  setEditedContent,
  onUpdateMemo,
  onDeleteMemo,
}: MemoModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 backdrop-blur-sm bg-black/10 flex items-center justify-center z-50">
      <div className="bg-white p-8 rounded-xl w-full max-w-xl relative">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-black"
          onClick={onClose}
        >
          ×
        </button>

        <div className="mb-4">
          <label className="block font-medium">제목</label>
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 rounded mt-1"
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium">내용</label>
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full border border-gray-300 px-3 py-2 rounded mt-1"
            rows={8}
          />
        </div>

        <div className="flex gap-2">
          <Button onClick={onUpdateMemo} className="w-1/2">
            수정
          </Button>
          <Button
            onClick={onDeleteMemo}
            className="w-1/2 bg-red-500 hover:bg-red-600 text-white"
          >
            삭제
          </Button>
        </div>
      </div>
    </div>
  );
}
