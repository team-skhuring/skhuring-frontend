import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import { useNavigate } from 'react-router-dom';

import jaxios from '../util/JwtUtil'; // JWT 토큰을 자동으로 헤더에 추가하는 axios 인스턴스
import Grade from '../components/layout/Grade'; // 등급 컴포넌트
import MemoModal from '../components/layout/MemoModal';
import ProfileEditModal from '../components/layout/ProfileEditModal';

import { Pencil } from 'lucide-react';

export default function MyPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [socialId, setSocialId] = useState('');
  const [socialType, setSocialType] = useState(''); // 소셜 로그인 타입 (카카오, 구글)
  const [profileImage, setProfileImage] = useState('');
  const [point, setPoint] = useState(0);

  interface MemoResDto {
    id: number;
    title: string;
    content: string;
  } // 메모 타입 정의
  const [memoList, setMemoList] = useState<MemoResDto[]>([]);
  const [selectedMemoId, setSelectedMemoId] = useState<number | null>(null);
  const [editedTitle, setEditedTitle] = useState('');
  const [editedContent, setEditedContent] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const userId = localStorage.getItem('id');
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      navigate('/'); // 로그인 페이지로 이동
    } else {
      fetchUserInfo(Number(userId)); // 로그인 유저 정보 불러오기
      fetchMemos(Number(userId)); // 메모 불러오기
    }
  }, []);

  /* 로그인 유저 정보 불러오기 */
  const fetchUserInfo = async (userId: number) => {
    try {
      const response = await jaxios.get('api/user/loginUserInfo', {
        params: { userId },
      });
      if (response.status === 200) {
        const data = response.data.loginUser;
        setName(data.name);
        setEmail(data.email);
        setSocialId(data.socialId);
        setSocialType(data.socialType);
        setProfileImage(data.profileImage);
        setPoint(data.point);
      }
      console.log('로그인 유저 정보', response.data);
    } catch (error) {
      console.error('로그인 유저 정보 불러오기 실패', error);
    }
  };

  /* 로그인 유저의 메모 정보 불러오기 */
  const fetchMemos = async (userId: number) => {
    try {
      const response = await jaxios.get('api/memo/user', {
        params: { userId },
      });
      if (response.status === 200) {
        setMemoList(response.data);
      }
      console.log('메모 정보', response.data);
    } catch (error) {
      console.error('메모 불러오기 실패', error);
    }
  };

  /* 프로필 수정 */
  const handleUpdateProfile = async () => {
    const isConfirmed = window.confirm(`프로필 정보를 수정하시겠습니까?`);

    if (!isConfirmed || userId === null) return; // 수정 취소

    try {
      const response = await jaxios.put('api/user/update', {
        id: userId,
        name,
        profileImage,
      });
      if (response.status === 200) {
        alert('프로필 정보가 수정되었습니다');
        console.log('프로필 수정 성공', response.data);
      }
    } catch (error) {
      alert('프로필 수정에 실패했습니다');
      console.error('프로필 수정 실패', error);
    }

    setIsEditModalOpen(false);
  };

  const openModal = (memo: MemoResDto) => {
    setSelectedMemoId(memo.id); // 실제 DB ID
    setEditedTitle(memo.title);
    setEditedContent(memo.content);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMemoId(null);
  };

  /* 메모 수정 */
  const handleUpdateMemo = async () => {
    const isConfirmed = window.confirm(
      `${selectedMemoId} 번 메모를 수정하시겠습니까? `
    );
    if (!isConfirmed || selectedMemoId === null) return; // 수정 취소

    try {
      const response = await jaxios.put('api/memo/update', {
        id: selectedMemoId,
        title: editedTitle,
        content: editedContent,
      });
      if (response.status === 200) {
        alert('메모가 수정되었습니다');
        console.log('메모 수정 성공', response.data);
      }
    } catch (error) {
      alert('메모 수정에 실패했습니다');
      console.error('메모 수정 실패', error);
    }

    fetchMemos(Number(userId)); // 메모 목록 새로고침
  };

  /* 메모 삭제 */
  const handleDeleteMemo = async () => {
    const isConfirmed = window.confirm(
      `${selectedMemoId}번 메모를 삭제하시겠습니까? `
    );
    if (!isConfirmed || selectedMemoId === null) return;

    try {
      const response = await jaxios.delete('api/memo/delete', {
        params: { memoId: selectedMemoId },
      });
      if (response.status === 200) {
        alert('메모가 삭제되었습니다');
        console.log('메모 삭제 성공', response.data);
      }
    } catch (error) {
      alert('메모 삭제에 실패했습니다');
      console.error('메모 삭제 실패', error);
    }
    closeModal(); // 모달 닫기
    fetchMemos(Number(userId)); // 메모 목록 새로고침
  };

  return (
    <div className="min-h-screen p-12 bg-white">
      <div className="mx-auto">
        {/* Profile Header */}
        <div className="flex items-center space-x-6">
          <div className="relative">
            <img
              src={profileImage}
              alt="Profile"
              className="rounded-full w-24 h-24"
            />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-semibold">{name}</h1>
              <button
                className="text-gray-500 hover:text-gray-700"
                title="프로필 수정"
                onClick={() => setIsEditModalOpen(true)}
              >
                <Pencil size={20} strokeWidth={1.5} />
              </button>
            </div>
            <p className="text-gray-500">{email || '-'}</p>
          </div>
        </div>

        {/* Info Form */}
        <div className="mt-8 space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <label className="text-gray-600">Name</label>
            <span className="col-span-2">{name}</span>

            <label className="text-gray-600">Email account</label>
            <span className="col-span-2">{email || '-'}</span>

            <label className="text-gray-600">Social ID</label>
            <span className="col-span-2">
              {socialType} {socialId}
            </span>
          </div>

          {/* Profile Edit Modal */}
          <ProfileEditModal
            isOpen={isEditModalOpen}
            onClose={() => setIsEditModalOpen(false)}
            profileImage={profileImage}
            name={name}
            onNameChange={setName}
            onUpdate={handleUpdateProfile}
          />

          {/* <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Save Change
          </button> */}
        </div>

        {/* Badge */}
        <Grade point={point} />

        {/* Mileage */}
        <div className="mt-6 text-lg">SKHU 마일리지 : {point}점</div>

        {/* Memos */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">작성한 메모</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {memoList.length > 0 ? (
              memoList.map((memo, index) => (
                <div
                  key={index}
                  onClick={() => openModal(memo)}
                  className="cursor-pointer"
                >
                  <Card className="h-full">
                    <CardContent className="p-2">
                      <div className="font-semibold">{memo.title}</div>
                      <div className="text-sm text-gray-600 truncate">
                        {memo.content}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))
            ) : (
              <div className="col-span-2 md:col-span-4 text-center text-gray-500">
                작성한 메모가 없습니다.
              </div>
            )}
          </div>
        </div>
      </div>

      <MemoModal
        isOpen={isModalOpen}
        onClose={closeModal}
        editedTitle={editedTitle}
        setEditedTitle={setEditedTitle}
        editedContent={editedContent}
        setEditedContent={setEditedContent}
        onUpdateMemo={handleUpdateMemo}
        onDeleteMemo={handleDeleteMemo}
      />
    </div>
  );
}
