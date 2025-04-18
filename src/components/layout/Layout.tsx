import { Sidebar } from 'lucide-react';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div>
      <Sidebar />
      <Outlet />
    </div>
  );
}
