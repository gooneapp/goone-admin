import React from 'react';
import { Outlet } from './Outlet';
import { Navigate } from '../router';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { useAuthStore } from '../store/authStore';

export const Layout: React.FC = () => {
  const { token } = useAuthStore();

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      <Sidebar currentPath="" onNavigate={() => {}} />
      <div style={{ flex: 1, marginLeft: '260px', display: 'flex', flexDirection: 'column' }}>
        <Header />
        <main style={{ flex: 1, padding: '2rem', maxWidth: '1600px', width: '100%', margin: '0 auto' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};
