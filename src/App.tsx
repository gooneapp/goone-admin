import React, { useState } from 'react';
import { useAuthStore } from './store/authStore';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { ToastContainer } from './components/Toast';

// Import All 22 Domain Pages
import { Login } from './pages/Login';
import { Dashboard } from './pages/Dashboard';
import { UserList } from './pages/UserList';
import { Businesses } from './pages/Businesses';
import { KycReview } from './pages/KycReview';
import { CategoryManager } from './pages/CategoryManager';
import { InventoryMonitoring } from './pages/InventoryMonitoring';
import { Orders } from './pages/Orders';
import { DeliveryManagement } from './pages/DeliveryManagement';
import { Payments } from './pages/Payments';
import { Subscriptions } from './pages/Subscriptions';
import { CreditManagement } from './pages/CreditManagement';
import { Reports } from './pages/Reports';
import { Analytics } from './pages/Analytics';
import { SupportTickets } from './pages/SupportTickets';
import { NotificationCenter } from './pages/NotificationCenter';
import { AdvertisementManager } from './pages/AdvertisementManager';
import { ContentManager } from './pages/ContentManager';
import { SettingsPage } from './pages/Settings';
import { AuditLogs } from './pages/AuditLogs';
import { ApiManagement } from './pages/ApiManagement';
import { SystemMonitoring } from './pages/SystemMonitoring';
import { MasterData } from './pages/MasterData';
import { AdminUserList } from './pages/AdminUserList';

export function App() {
  const { isAuthenticated, isCheckingAuth, checkAuth } = useAuthStore();
  const [currentPath, setCurrentPath] = useState('/dashboard');

  React.useEffect(() => {
    checkAuth();
  }, []);

  if (isCheckingAuth) {
    return (
      <div style={{ minHeight: '100vh', background: '#090d16', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#f8fafc', fontFamily: 'system-ui, sans-serif' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #0284c7, #38bdf8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, fontSize: '1.5rem', color: '#fff', marginBottom: '1rem', boxShadow: '0 0 25px rgba(56, 189, 248, 0.5)' }}>
          GO
        </div>
        <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#94a3b8' }}>Verifying Admin Session...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Login />;
  }

  const renderPage = () => {
    switch (currentPath) {
      case '/dashboard': return <Dashboard />;
      case '/analytics': return <Analytics />;
      case '/users': return <UserList />;
      case '/businesses': return <Businesses />;
      case '/kyc-review': return <KycReview />;
      case '/categories': return <CategoryManager />;
      case '/inventory': return <InventoryMonitoring />;
      case '/orders': return <Orders />;
      case '/delivery': return <DeliveryManagement />;
      case '/payments': return <Payments />;
      case '/subscriptions': return <Subscriptions />;
      case '/credit': return <CreditManagement />;
      case '/reports': return <Reports />;
      case '/support-tickets': return <SupportTickets />;
      case '/notifications': return <NotificationCenter />;
      case '/advertisements': return <AdvertisementManager />;
      case '/cms': return <ContentManager />;
      case '/settings': return <SettingsPage />;
      case '/audit-logs': return <AuditLogs />;
      case '/api-management': return <ApiManagement />;
      case '/system-monitoring': return <SystemMonitoring />;
      case '/master-data': return <MasterData />;
      case '/admin-users': return <AdminUserList />;
      default: return <Dashboard />;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#090d16', color: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif' }}>
      <ToastContainer />
      <Sidebar currentPath={currentPath} onNavigate={(path) => setCurrentPath(path)} />

      <div style={{ marginLeft: '260px', flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <Header />
        <main style={{ padding: '2rem', flex: 1, overflowY: 'auto' }}>
          {renderPage()}
        </main>
      </div>
    </div>
  );
}

export default App;
