import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';

export function AppLayout() {
  return (
    <div className="flex min-h-screen bg-[var(--bg-dark)]">
      <Sidebar />
      <main className="flex-1" style={{ paddingLeft: 'var(--sidebar-width)' }}>
        <Outlet />
      </main>
    </div>
  );
}
