import React, { useEffect, useState } from 'react';
import { Card, CardContent } from '../components/ui/card';
import jaxios from '../util/JwtUtil'; // JWT 토큰을 자동으로 헤더에 추가하는 axios 인스턴스

export default function MyPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [socialId, setSocialId] = useState('');
  const [profileImage, setProfileImage] = useState('');

  useEffect(() => {
    const fetchUserInfo = async () => {
      const id = localStorage.getItem('id');
      try {
        const response = await jaxios.get('api/user/loginUserInfo', {
          params: { id },
        });
        if (response.status === 200) {
          const data = response.data.loginUser;
          setName(data.name);
          setEmail(data.email);
          setSocialId(data.socialId);
          setProfileImage(data.profileImage);
        }
        console.log('로그인 유저 정보', response.data);
        console.log('응답 확인', response.status);
      } catch (error) {
        console.error('로그인 유저 정보 불러오기 실패', error);
      }
    };

    fetchUserInfo();
  }, []);

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
            <button className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow">
              <span className="material-icons">edit</span>
            </button>
          </div>
          <div>
            <h1 className="text-xl font-semibold">{name}</h1>
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
            <span className="col-span-2">{socialId}</span>
          </div>

          {/* <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Save Change
          </button> */}
        </div>

        {/* Silver Badge */}
        <div className="mt-12">
          <div className="flex items-center space-x-2">
            <span className="material-icons text-gray-500">shield</span>
            <span className="text-lg font-medium">실버</span>
          </div>
          <div className="mt-2 w-full h-2 bg-gray-200 rounded-full">
            <div className="w-2/3 h-full bg-gray-800 rounded-full" />
          </div>
          <div className="text-sm text-gray-500 mt-1">Silver | 671점</div>
        </div>

        {/* Mileage */}
        <div className="mt-6 text-lg">SKHU 마일리지 : 0,000점</div>

        {/* Memos */}
        <div className="mt-10">
          <h2 className="text-xl font-semibold mb-4">작성한 메모</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="font-semibold">진료</div>
                <div className="text-sm text-gray-600 truncate">
                  가나다라마바사아자차카타파하
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="font-semibold">재배추</div>
                <div className="text-sm text-gray-600 truncate">
                  김재찌가 마라탕 먹볶이 집밥 담밥 안삼주 취...
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="font-semibold">시험대비</div>
                <div className="text-sm text-gray-600 truncate">공부 방법</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="font-bold">Sample</div>
                <div className="text-sm text-gray-600">sample</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
