import { type RouteConfig, index, route } from '@react-router/dev/routes';

export default [
  index('./pages/home.tsx'),
  route('/oauth/google/redirect', './components/common/GoogleAuth.tsx'),
  route('/oauth/kakao/redirect', './components/common/KakaoAuth.tsx'),
] satisfies RouteConfig;
