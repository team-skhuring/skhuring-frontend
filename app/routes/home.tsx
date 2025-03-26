import type { Route } from "./+types/home";
import MainPage from "../pages/mainpage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "SkhuRing" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return <MainPage />;
}
