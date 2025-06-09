import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export default function Layout() {
  return (
    <div className="flex min-h-screen">
      <div className="shadow-[8px_0_30px_rgba(173,216,230,0.2)] z-10">
        <Sidebar />
      </div>
      <main className="flex-1 bg-gray-50">
        <Outlet />
      </main>
    </div>
  );
}
