//라우트정의하는 파일이라고함
import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("/Users/incheol/SkhuRing/skhuring-frontend/app/pages/home.tsx"), // 홈 페이지
  route("/oauth/google/redirect", "/Users/incheol/SkhuRing/skhuring-frontend/app/components/common/GoogleAuth.tsx"), // 구글 로그인 페이지 추가
] satisfies RouteConfig;