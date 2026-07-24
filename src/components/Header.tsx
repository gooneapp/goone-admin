import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { AdminRole } from '../types';
import { 
  Bell, 
  Search, 
  LogOut, 
  UserCheck, 
  ChevronDown, 
  ShieldAlert, 
  Sparkles 
} from 'lucide-react';
import { Badge } from './Badge';

export const Header: React.FC = () => {
  const { user, logout, switchRole } = useAuthStore();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const rolesList: { role: AdminRole; label: string; desc: string }[] = [
    { role: 'super_admin', label: 'Super Admin', desc: 'Full platform access & administrative governance' },
    { role: 'admin', label: 'Admin', desc: 'Platform operations, KYC review, category management' },
    { role: 'manager', label: 'Operations Manager', desc: 'SLA tracking, ticket assignment, partner verification' },
    { role: 'support', label: 'Support Agent', desc: 'Customer/partner tickets, resolution, internal notes' },
    { role: 'finance', label: 'Finance Lead', desc: 'Subscriptions, credit accounts, pricing, payment audits' },
    { role: 'marketing', label: 'Marketing Lead', desc: 'Advertisements, banners, announcements, i18n content' },
    { role: 'operations', label: 'Fleet & Logistics Lead', desc: 'Delivery partners, ride drivers, inventory monitoring' },
  ];

  const currentRole = user?.role || 'super_admin';

  return (
    <header
      style={{
        height: '70px',
        background: '#090d16',
        borderBottom: '1px solid #1e293b',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 2rem',
        position: 'sticky',
        top: 0,
        zIndex: 90,
      }}
    >
      {/* Search Input */}
      <div style={{ position: 'relative', width: '320px' }}>
        <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
        <input
          type="text"
          placeholder="Global search (Ctrl + K)..."
          style={{
            width: '100%',
            padding: '0.45rem 0.75rem 0.45rem 2.25rem',
            background: '#1e293b',
            border: '1px solid #334155',
            borderRadius: '8px',
            color: '#f8fafc',
            fontSize: '0.85rem',
            outline: 'none',
          }}
        />
      </div>

      {/* Action Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        {/* Interactive RBAC Role Selector Dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowRoleMenu(!showRoleMenu)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: '#1e293b',
              border: '1px solid #38bdf8',
              borderRadius: '8px',
              padding: '0.4rem 0.75rem',
              color: '#38bdf8',
              fontSize: '0.825rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            <UserCheck size={16} />
            <span>Switch Role: {currentRole.replace('_', ' ').toUpperCase()}</span>
            <ChevronDown size={14} />
          </button>

          {showRoleMenu && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: '110%',
                background: '#0f172a',
                border: '1px solid #334155',
                borderRadius: '12px',
                padding: '0.5rem',
                width: '320px',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.6)',
                zIndex: 100,
              }}
            >
              <div style={{ padding: '0.5rem 0.75rem', borderBottom: '1px solid #1e293b', fontSize: '0.75rem', fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                Test RBAC Role Access
              </div>
              {rolesList.map((r) => (
                <button
                  key={r.role}
                  onClick={() => {
                    switchRole(r.role);
                    setShowRoleMenu(false);
                  }}
                  style={{
                    display: 'block',
                    width: '100%',
                    textAlign: 'left',
                    padding: '0.55rem 0.75rem',
                    background: currentRole === r.role ? 'rgba(56, 189, 248, 0.15)' : 'transparent',
                    border: 'none',
                    borderRadius: '8px',
                    color: currentRole === r.role ? '#38bdf8' : '#e2e8f0',
                    cursor: 'pointer',
                    marginBottom: '0.2rem',
                  }}
                  onMouseEnter={(e) => {
                    if (currentRole !== r.role) e.currentTarget.style.background = '#1e293b';
                  }}
                  onMouseLeave={(e) => {
                    if (currentRole !== r.role) e.currentTarget.style.background = 'transparent';
                  }}
                >
                  <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{r.label}</div>
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{r.desc}</div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications Icon Bell */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            style={{
              background: '#1e293b',
              border: '1px solid #334155',
              color: '#94a3b8',
              padding: '0.45rem',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              position: 'relative',
            }}
          >
            <Bell size={18} />
            <span style={{ position: 'absolute', top: '-4px', right: '-4px', background: '#ef4444', color: '#fff', fontSize: '0.65rem', fontWeight: 700, borderRadius: '50%', width: '16px', height: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              2
            </span>
          </button>

          {showNotifications && (
            <div
              style={{
                position: 'absolute',
                right: 0,
                top: '110%',
                background: '#0f172a',
                border: '1px solid #334155',
                borderRadius: '12px',
                padding: '0.75rem',
                width: '300px',
                boxShadow: '0 20px 40px rgba(0,0,0,0.6)',
                zIndex: 100,
              }}
            >
              <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#f8fafc', marginBottom: '0.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                System Alerts <Badge variant="danger">2 Pending</Badge>
              </div>
              <div style={{ fontSize: '0.8rem', padding: '0.5rem', background: '#1e293b', borderRadius: '6px', marginBottom: '0.4rem', color: '#e2e8f0' }}>
                <strong style={{ color: '#ef4444', display: 'block' }}>Emergency SOS Alert</strong>
                Ride Auto driver deviated from route (TKT-2026-0004).
              </div>
              <div style={{ fontSize: '0.8rem', padding: '0.5rem', background: '#1e293b', borderRadius: '6px', color: '#e2e8f0' }}>
                <strong style={{ color: '#fbbf24', display: 'block' }}>KYC Queue</strong>
                2 new business registration verification documents pending.
              </div>
            </div>
          )}
        </div>

        {/* User Pill & Logout */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingLeft: '0.5rem', borderLeft: '1px solid #334155' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc' }}>{user?.name || 'Admin User'}</div>
            <div style={{ fontSize: '0.725rem', color: '#38bdf8', textTransform: 'capitalize' }}>{user?.email || 'admin@goone.in'}</div>
          </div>
          <button
            onClick={logout}
            title="Sign out of portal"
            style={{
              background: 'rgba(239, 68, 68, 0.15)',
              border: '1px solid rgba(239, 68, 68, 0.3)',
              color: '#f87171',
              padding: '0.45rem',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
            }}
          >
            <LogOut size={16} />
          </button>
        </div>
      </div>
    </header>
  );
};
