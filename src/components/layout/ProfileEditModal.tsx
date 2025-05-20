import React from 'react';
import { Dialog } from '@headlessui/react';
import { Pencil } from 'lucide-react';
import { Button } from '../ui/button';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileImage: string;
  name: string;
  onNameChange: (name: string) => void;
  onUpdate: () => void;
}

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  isOpen,
  onClose,
  profileImage,
  name,
  onNameChange,
  onUpdate,
}) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50">
      <div className="flex items-center justify-center min-h-screen px-4">
        {/* Overlay manually rendered */}
        <div className="fixed inset-0 bg-black opacity-30" onClick={onClose} />

        {/* Modal content */}
        <div className="relative bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 z-50 space-y-6">
          {/* Profile Image + Pencil Button */}
          <div className="relative w-24 h-24 mx-auto">
            <img
              src={profileImage}
              alt="Profile"
              className="rounded-full w-full h-full object-cover"
            />
            <button
              className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow"
              title="프로필 이미지 수정"
            >
              <Pencil size={18} />
            </button>
          </div>

          {/* Name Field */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이름
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => onNameChange(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring focus:border-blue-500"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button onClick={onUpdate} className="w-full">
              수정
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default ProfileEditModal;
