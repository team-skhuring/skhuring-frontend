import React from 'react';
import { Button } from '../components/ui/button';
import Header from '../components/common/Header';
import { Card, CardContent } from '../components/ui/card';
import { motion } from 'framer-motion';
import {
  FaGoogle,
  FaCogs,
  FaMobileAlt,
  FaLaptopCode,
  FaBug,
} from 'react-icons/fa';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID;
const REDIRECT_URI = import.meta.env.VITE_GOOGLE_REDIRECT_URL;

const googleLogin = () => {
  const googleAuthUrl = `https://accounts.google.com/o/oauth2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${REDIRECT_URI}&response_type=code&scope=openid profile email`;
  window.location.href = googleAuthUrl;
};

const kakaoLogin = () => {
  const kakaoAuthUrl = `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${KAKAO_CLIENT_ID}&redirect_uri=${KAKAO_REDIRECT_URI};`;
  window.location.href = kakaoAuthUrl;
};

export default function MainPage() {
  const isLoggedIn = Boolean(localStorage.getItem('token'));
  const name = localStorage.getItem('name') ?? '';

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('name');
    window.location.reload(); // 상태 초기화
  };

  return (
    <div className="min-h-screen bg-white text-gray-800">
      <Header name={name} />

      <main className="grid md:grid-cols-2 items-center py-20 px-10 md:px-36 lg:px-48 gap-16">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h1 className="text-5xl font-bold leading-tight">
            함께 <span className="text-purple-500">고민</span>하고 <br />
            함께 <span className="text-purple-500">성장</span>하는 공간
          </h1>
          <p className="mt-6 text-lg text-gray-600">
            누군가 채팅방을 열면, 누구나 멘토가 되어 <br />
            실시간으로 고민을 듣고, 서로 도울 수 있는 따뜻한 커뮤니티
          </p>
          <div className="mt-8 flex flex-col md:flex-row gap-4">
            {isLoggedIn ? (
              <div className="flex flex-col items-start gap-4">
                <p className="text-lg font-semibold text-gray-700">
                  고민을 바로 공유하고 해결해봐요!!
                </p>
                <div className="flex flex-col md:flex-row items-center gap-4">
                  <Button
                    onClick={() => {
                      window.location.href = '/chatrooms';
                    }}
                    className="bg-purple-500 text-white hover:bg-purple-600 px-8 py-4 rounded-2xl shadow-md"
                  >
                    채팅방 목록으로 가기
                  </Button>

                  <Button
                    onClick={logout}
                    variant="outline"
                    className="border-gray-300 px-8 py-4 rounded-2xl shadow-md"
                  >
                    로그아웃
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col md:flex-row gap-4 w-full">
                {/* Kakao Button */}
                <Button className="relative overflow-hidden h-12 min-w-[200px] rounded-xl border border-gray-300 p-0 w-full md:w-auto">
                  <img
                    src="/kakao_login_medium_narrow.png"
                    alt="Kakao Login"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                </Button>

                {/* Google Button */}
                <Button
                  onClick={googleLogin}
                  variant="outline"
                  className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border-gray-300 w-full md:w-auto h-12 min-w-[200px]"
                >
                  <FaGoogle size={20} /> Google로 시작하기
                </Button>
              </div>
            )}
          </div>
        </motion.div>

        <motion.div
          className="flex justify-center items-center"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1 }}
        >
          <img
            src="/skhuringMainpage.webp"
            alt="Main visual"
            className="w-full max-w-2xl object-contain"
          />
        </motion.div>
      </main>

      <section className="bg-gray-50 py-16 px-10 md:px-24">
        <h2 className="text-4xl font-bold text-center mb-12">Our Services</h2>
        <div className="grid md:grid-cols-4 gap-8">
          <Card className="border-2 border-purple-400">
            <CardContent className="text-center p-6">
              <FaMobileAlt size={40} className="mx-auto mb-4 text-purple-500" />
              <h3 className="text-xl font-semibold mb-2">
                Real-time Mentoring
              </h3>
              <p className="text-gray-600 text-sm">
                실시간 채팅을 통해 누구나 멘토 또는 멘티가 되어 고민을 나누고
                해결할 수 있습니다.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-400">
            <CardContent className="text-center p-6">
              <FaLaptopCode
                size={40}
                className="mx-auto mb-4 text-purple-500"
              />
              <h3 className="text-xl font-semibold mb-2">
                Various Consultation Fields
              </h3>
              <p className="text-gray-600 text-sm">
                IT, 진로, 취업, 인간관계 등 다양한 분야의 고민을 부담 없이
                상담할 수 있습니다.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-400">
            <CardContent className="text-center p-6">
              <FaBug size={40} className="mx-auto mb-4 text-purple-500" />
              <h3 className="text-xl font-semibold mb-2">
                Earn Skumileage Points
              </h3>
              <p className="text-gray-600 text-sm">
                멘토 활동을 하면 스쿰마일리지를 적립하여 다양한 혜택을 받을 수
                있습니다.
              </p>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-400">
            <CardContent className="text-center p-6">
              <FaCogs size={40} className="mx-auto mb-4 text-purple-500" />
              <h3 className="text-xl font-semibold mb-2">
                Supportive Community
              </h3>
              <p className="text-gray-600 text-sm">
                따뜻한 커뮤니티에서 누구나 고민을 나누고 함께 성장할 수
                있습니다.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
