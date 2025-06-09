import React from 'react';
import { Dialog } from '@headlessui/react';
import { Pencil } from 'lucide-react';
import { Button } from '../ui/button';

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  profileImage: string;
  setProfileImage?: (imageUrl: string) => void;
  name: string;
  setName: (name: string) => void;
  onUpdate: () => void;
}

const DEFAULT_IMAGE_URLS = [
  'https://skhuring-default-images.s3.ap-northeast-2.amazonaws.com/default-images/cat.png',
  'https://skhuring-default-images.s3.ap-northeast-2.amazonaws.com/default-images/man1.png',
  'https://skhuring-default-images.s3.ap-northeast-2.amazonaws.com/default-images/man2.png',
  'https://skhuring-default-images.s3.ap-northeast-2.amazonaws.com/default-images/man3.png',
  'https://skhuring-default-images.s3.ap-northeast-2.amazonaws.com/default-images/woman1.png',
  'https://skhuring-default-images.s3.ap-northeast-2.amazonaws.com/default-images/woman2.png',
];

const ProfileEditModal: React.FC<ProfileEditModalProps> = ({
  isOpen,
  onClose,
  profileImage,
  setProfileImage,
  name,
  setName,
  onUpdate,
}) => {
  return (
    <Dialog open={isOpen} onClose={onClose} className="fixed inset-0 z-50">
      <div className="flex items-center justify-center min-h-screen px-4">
        <div className="fixed inset-0 bg-black opacity-30" onClick={onClose} />

        <div className="relative bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 z-50 space-y-6">
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

          {/* 기본 제공 프로필 사진 */}
          <div className="grid grid-cols-3 gap-3">
            {DEFAULT_IMAGE_URLS.map((url) => (
              <button
                key={url}
                onClick={() => setProfileImage?.(url)}
                className="rounded-full overflow-hidden w-16 h-16 border border-gray-300 hover:ring-2 hover:ring-blue-400"
              >
                <img
                  src={url}
                  alt="기본 이미지"
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              이름
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring focus:border-blue-500"
            />
          </div>

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
