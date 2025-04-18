// src/components/GoogleAuth.tsx
import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

import axios from 'axios';
export default function GoogleAuth() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get('code');

    console.log(code);
    if (code) {
      sendCodeToServer(code);
    }
  }, [location]);

  const sendCodeToServer = async (code: string) => {
    try {
      const response = await axios.post('/api/user/google/doLogin', { code });

      const token = response.data.token;
      const name = response.data.name;
      localStorage.setItem('token', token);
      localStorage.setItem('name', name);
      navigate('/'); // 인증 후 리디렉션
    } catch (error) {
      console.error('Google login error', error);
    }
  };

  return <div>구글 로그인 진행중...</div>;
}
