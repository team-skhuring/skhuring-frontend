import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import axios from 'axios';

const KakaoAuth = () => {
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
      const response = await axios.post('/api/user/kakao/doLogin', { code });
      const token = response.data.token;
      const name = response.data.name;
      localStorage.setItem('token', token);
      localStorage.setItem('name', name);
      navigate('/');
    } catch (error) {
      console.error('Kakao login error', error);
    }
  };

  return <div>구글 로그인 진행중...</div>;
};

export default KakaoAuth;
