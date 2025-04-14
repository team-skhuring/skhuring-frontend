//라우트정의하는 파일이라고함
import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index('./pages/home.tsx'),
  route('/oauth/google/redirect', './components/common/GoogleAuth.tsx'),
  route("/mentoring-lounge", "./pages/mentoring-lounge.tsx"),
  route("/mychat/:roomId", "./pages/ChatRoom.tsx"),
] satisfies RouteConfig;