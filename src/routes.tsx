// routes.tsx
import { createBrowserRouter } from 'react-router-dom';

import App from './App';
import Layout from './components/layout/Layout';
import Home from './pages/Home';
import GoogleAuth from './components/common/GoogleAuth';
import KakaoAuth from './components/common/KakaoAuth';
import MentoringLounge from './pages/MentoringLounge';
import ChatRoom from './pages/chat/ChatRoom';
import MyPage from './pages/MyPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      // '/' => 홈 (Layout 없이)
      { index: true, element: <Home /> },

      // OAuth 경로 (Layout 없이)
      { path: 'oauth/google/redirect', element: <GoogleAuth /> },
      { path: 'oauth/kakao/redirect', element: <KakaoAuth /> },

      // Layout이 필요한 나머지 라우트
      {
        element: <Layout />,
        children: [
          { path: 'mentoringLounge', element: <MentoringLounge /> },
          { path: 'mychat/:roomId', element: <ChatRoom /> },
          { path: 'mypage', element: <MyPage /> },
        ],
      },
    ],
  },
]);
