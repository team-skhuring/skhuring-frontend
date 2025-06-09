import { Outlet } from 'react-router-dom';

export default function () {
  return (
    <div className="min-h-screen">
      <Outlet />
    </div>
  );
}
