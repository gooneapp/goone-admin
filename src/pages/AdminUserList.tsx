import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { AdminUser, AdminRole } from '../types';
import { DataTable, Column } from '../components/DataTable';
import { Badge } from '../components/Badge';
import { Modal } from '../components/Modal';
import { UserCheck, Plus, ShieldCheck, Lock } from 'lucide-react';

export const AdminUserList: React.FC = () => {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<AdminRole>('support');

  useEffect(() => {
    api.getAdminUsers().then(setAdminUsers);
  }, []);

  const handleCreateAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    const created: AdminUser = {
      id: `usr-adm-${Date.now()}`,
      email,
      name,
      role,
      active: true,
      createdAt: new Date().toISOString(),
    };
    setAdminUsers(prev => [...prev, created]);
    setIsCreateOpen(false);
    setEmail('');
    setName('');
    alert(`Admin account created for ${created.name} with role: ${created.role}`);
  };

  const columns: Column<AdminUser>[] = [
    { key: 'name', header: 'Admin Full Name', sortable: true },
    { key: 'email', header: 'Login Email', sortable: true, render: (val) => <span style={{ color: '#38bdf8' }}>{val}</span> },
    {
      key: 'role',
      header: 'Security Scope Role',
      sortable: true,
      filterable: true,
      filterOptions: ['super_admin', 'admin', 'manager', 'support', 'finance', 'marketing', 'operations'],
      render: (val: AdminRole) => {
        const variants: Record<AdminRole, any> = {
          super_admin: 'danger',
          admin: 'purple',
          manager: 'info',
          support: 'neutral',
          finance: 'success',
          marketing: 'warning',
          operations: 'info',
        };
        return <Badge variant={variants[val] || 'neutral'}>{val.replace('_', ' ').toUpperCase()}</Badge>;
      },
    },
    { key: 'active', header: 'Account Status', render: (val) => <Badge variant={val ? 'success' : 'danger'}>{val ? 'Active' : 'Revoked'}</Badge> },
    { key: 'createdAt', header: 'Created Date', sortable: true, render: (val) => new Date(val).toLocaleDateString() },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={() => setIsCreateOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'linear-gradient(135deg, #0284c7, #38bdf8)', border: 'none', color: '#fff', padding: '0.6rem 1.2rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
        >
          <Plus size={16} /> Create New Internal Admin Account
        </button>
      </div>

      <DataTable
        title="Internal Administrator Accounts (7 RBAC Tiers)"
        subtitle="Manage access privileges for Super Admin, Admin, Manager, Support, Finance, Marketing, and Operations."
        columns={columns}
        data={adminUsers}
        keyExtractor={(item) => item.id}
        searchPlaceholder="Search admin name, email, role..."
      />

      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Provision Internal Admin Account"
        subtitle="Assign security scope role across the 7 RBAC tiers."
      >
        <form onSubmit={handleCreateAdmin} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.3rem' }}>Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Anand Kumar"
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: '100%', padding: '0.6rem', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.3rem' }}>Email Address *</label>
            <input
              type="email"
              required
              placeholder="e.g. anand@goone.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '0.6rem', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.3rem' }}>Security Scope Role *</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as AdminRole)}
              style={{ width: '100%', padding: '0.6rem', background: '#1e293b', border: '1px solid #38bdf8', borderRadius: '8px', color: '#38bdf8', fontWeight: 600 }}
            >
              <option value="super_admin">Super Admin (Full Governance)</option>
              <option value="admin">Admin (Operations & Categories)</option>
              <option value="manager">Operations Manager (SLA & KYC)</option>
              <option value="support">Support Agent (Tickets & Disputes)</option>
              <option value="finance">Finance Lead (Subscriptions & Credit)</option>
              <option value="marketing">Marketing Lead (Ads & Banners)</option>
              <option value="operations">Fleet & Logistics Lead (Drivers & Inventory)</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid #334155', paddingTop: '1rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={() => setIsCreateOpen(false)} style={{ background: '#1e293b', border: '1px solid #334155', color: '#cbd5e1', padding: '0.55rem 1rem', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
            <button type="submit" style={{ background: 'linear-gradient(135deg, #0284c7, #38bdf8)', border: 'none', color: '#fff', padding: '0.55rem 1.1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Create Account</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
