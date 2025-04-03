import type { Route } from "../+types/root";
import MainPage from "./mainpage";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "SkhuRing" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}

export default function Home() {
  return <MainPage />;
}
