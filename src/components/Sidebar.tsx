import React from 'react';
import { useAuthStore } from '../store/authStore';
import { AdminRole } from '../types';
import { 
  LayoutDashboard, 
  Building2, 
  FileCheck, 
  Layers, 
  CreditCard, 
  Truck, 
  LifeBuoy, 
  FileText, 
  Settings, 
  ShieldCheck, 
  ChartColumn as BarChart3,
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  BookOpen,
  Bell,
  Image,
  Globe,
  Key,
  Activity,
  Database,
  UserCheck
} from 'lucide-react';

interface SidebarProps {
  currentPath: string;
  onNavigate: (path: string) => void;
}

interface NavItem {
  path: string;
  label: string;
  icon: React.ReactNode;
  roles?: AdminRole[];
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export const Sidebar: React.FC<SidebarProps> = ({ currentPath, onNavigate }) => {
  const { user } = useAuthStore();
  const role = user?.role || 'super_admin';

  const isAllowed = (roles?: AdminRole[]) => {
    if (!roles || role === 'super_admin') return true;
    return roles.includes(role);
  };

  const sections: NavSection[] = [
    {
      title: 'OVERVIEW',
      items: [
        { path: '/dashboard', label: 'Dashboard', icon: <LayoutDashboard size={18} /> },
        { path: '/analytics', label: 'Platform Analytics', icon: <BarChart3 size={18} />, roles: ['super_admin', 'admin', 'finance', 'marketing', 'operations'] },
      ],
    },
    {
      title: 'BUSINESS & USERS',
      items: [
        { path: '/users', label: 'User Directory', icon: <Users size={18} />, roles: ['super_admin', 'admin', 'manager', 'support'] },
        { path: '/businesses', label: 'Businesses & Shops', icon: <Building2 size={18} />, roles: ['super_admin', 'admin', 'manager', 'finance'] },
        { path: '/kyc-review', label: 'KYC Document Approval', icon: <FileCheck size={18} />, roles: ['super_admin', 'admin', 'manager'] },
      ],
    },
    {
      title: 'CATALOG & ORDERS',
      items: [
        { path: '/categories', label: 'Categories & Extension Modules', icon: <Layers size={18} />, roles: ['super_admin', 'admin'] },
        { path: '/inventory', label: 'Products & Inventory', icon: <Package size={18} />, roles: ['super_admin', 'admin', 'operations'] },
        { path: '/orders', label: 'Orders & KOT Bills', icon: <ShoppingCart size={18} />, roles: ['super_admin', 'admin', 'operations', 'support'] },
      ],
    },
    {
      title: 'LOGISTICS & FINANCE',
      items: [
        { path: '/delivery', label: 'Delivery & Partner Vehicles', icon: <Truck size={18} />, roles: ['super_admin', 'admin', 'operations', 'manager'] },
        { path: '/payments', label: 'Payments & Transactions', icon: <DollarSign size={18} />, roles: ['super_admin', 'finance'] },
        { path: '/subscriptions', label: 'Subscriptions & Plans', icon: <CreditCard size={18} />, roles: ['super_admin', 'admin', 'finance'] },
        { path: '/credit', label: 'Khata Credit Management', icon: <BookOpen size={18} />, roles: ['super_admin', 'finance'] },
      ],
    },
    {
      title: 'SUPPORT & MARKETING',
      items: [
        { path: '/support-tickets', label: 'Support & Emergency SOS', icon: <LifeBuoy size={18} />, roles: ['super_admin', 'admin', 'manager', 'support'] },
        { path: '/notifications', label: 'Notifications & Broadcast', icon: <Bell size={18} />, roles: ['super_admin', 'admin', 'marketing', 'support'] },
        { path: '/advertisements', label: 'Advertisements & Banners', icon: <Image size={18} />, roles: ['super_admin', 'marketing'] },
        { path: '/cms', label: 'CMS & Translations', icon: <Globe size={18} />, roles: ['super_admin', 'admin', 'marketing'] },
      ],
    },
    {
      title: 'SYSTEM & GOVERNANCE',
      items: [
        { path: '/settings', label: 'App Config & Feature Toggles', icon: <Settings size={18} />, roles: ['super_admin', 'admin'] },
        { path: '/audit-logs', label: 'Platform Audit Logs', icon: <ShieldCheck size={18} />, roles: ['super_admin', 'admin', 'manager', 'finance'] },
        { path: '/api-management', label: 'API Keys & Webhooks', icon: <Key size={18} />, roles: ['super_admin'] },
        { path: '/system-monitoring', label: 'System Health & Services', icon: <Activity size={18} />, roles: ['super_admin', 'operations'] },
        { path: '/master-data', label: 'Master Data Tables', icon: <Database size={18} />, roles: ['super_admin', 'admin'] },
        { path: '/admin-users', label: 'Admin Accounts', icon: <UserCheck size={18} />, roles: ['super_admin'] },
      ],
    },
  ];

  return (
    <aside
      style={{
        width: '260px',
        background: '#090d16',
        borderRight: '1px solid #1e293b',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        display: 'flex',
        flexDirection: 'column',
        zIndex: 100,
        userSelect: 'none',
      }}
    >
      {/* Brand logo */}
      <div style={{ padding: '1.25rem 1.5rem', borderBottom: '1px solid #1e293b', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
        <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #0284c7, #38bdf8)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: '#ffffff', fontSize: '1.2rem', boxShadow: '0 0 15px rgba(56, 189, 248, 0.4)' }}>
          GO
        </div>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc', letterSpacing: '0.5px' }}>GoOne Admin</h1>
          <span style={{ fontSize: '0.7rem', color: '#38bdf8', fontWeight: 600, letterSpacing: '1px', textTransform: 'uppercase' }}>Enterprise Hub</span>
        </div>
      </div>

      {/* Navigation menu */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '1rem 0.75rem' }}>
        {sections.map((sec, sIdx) => {
          const visibleItems = sec.items.filter(item => isAllowed(item.roles));
          if (visibleItems.length === 0) return null;

          return (
            <div key={sIdx} style={{ marginBottom: '1.25rem' }}>
              <div style={{ padding: '0 0.75rem', fontSize: '0.675rem', fontWeight: 700, color: '#64748b', letterSpacing: '1px', marginBottom: '0.4rem' }}>
                {sec.title}
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.15rem' }}>
                {visibleItems.map((item) => {
                  const isActive = currentPath === item.path;
                  return (
                    <button
                      key={item.path}
                      onClick={() => onNavigate(item.path)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.6rem 0.75rem',
                        borderRadius: '8px',
                        border: 'none',
                        background: isActive ? 'linear-gradient(90deg, rgba(56, 189, 248, 0.15), rgba(56, 189, 248, 0.05))' : 'transparent',
                        color: isActive ? '#38bdf8' : '#cbd5e1',
                        borderLeft: isActive ? '3px solid #38bdf8' : '3px solid transparent',
                        fontWeight: isActive ? 600 : 500,
                        fontSize: '0.85rem',
                        textAlign: 'left',
                        cursor: 'pointer',
                        transition: 'all 0.15s ease',
                      }}
                      onMouseEnter={(e) => {
                        if (!isActive) e.currentTarget.style.background = '#1e293b';
                      }}
                      onMouseLeave={(e) => {
                        if (!isActive) e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <span style={{ color: isActive ? '#38bdf8' : '#64748b' }}>{item.icon}</span>
                      {item.label}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Role Footer */}
      <div style={{ padding: '1rem', borderTop: '1px solid #1e293b', background: '#0b1120' }}>
        <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Active Security Persona</div>
        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#38bdf8', textTransform: 'capitalize', marginTop: '0.1rem' }}>
          {role.replace('_', ' ')}
        </div>
      </div>
    </aside>
  );
};
