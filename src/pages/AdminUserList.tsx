import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { toast } from '../store/toastStore';
import { useAuthStore } from '../store/authStore';
import { AdminUser } from '../types';
import { DataTable, Column } from '../components/DataTable';
import { Badge } from '../components/Badge';
import { Modal } from '../components/Modal';
import { Plus, Lock } from 'lucide-react';

// The backend AdminUser model only supports these two roles today — this list
// must stay in sync with the `AdminRole` enum in prisma/schema.prisma.
const ADMIN_ROLES = ['support', 'super_admin'] as const;
type BackendAdminRole = (typeof ADMIN_ROLES)[number];

export const AdminUserList: React.FC = () => {
  const [adminUsers, setAdminUsers] = useState<AdminUser[]>([]);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<BackendAdminRole>('support');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isSuperAdmin = useAuthStore((s) => s.user?.role === 'super_admin');

  const loadAdminUsers = () => {
    api.getAdminUsers().then(setAdminUsers);
  };

  useEffect(() => {
    loadAdminUsers();
  }, []);

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await api.createAdminUser({ email, password, name, role });
      toast.success(`Admin account created for ${name} with role: ${role}`);
      setIsCreateOpen(false);
      setEmail('');
      setName('');
      setPassword('');
      setRole('support');
      loadAdminUsers();
    } catch {
      // Error toast already shown by the global API error interceptor.
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleActive = async (user: AdminUser) => {
    try {
      await api.updateAdminUser(user.id, { active: !user.active });
      toast.success(`${user.name}'s account ${user.active ? 'revoked' : 'reinstated'}.`);
      loadAdminUsers();
    } catch {
      // Error toast already shown by the global API error interceptor.
    }
  };

  const columns: Column<AdminUser>[] = [
    { key: 'name', header: 'Admin Full Name', sortable: true },
    { key: 'email', header: 'Login Email', sortable: true, render: (val) => <span style={{ color: '#38bdf8' }}>{val}</span> },
    {
      key: 'role',
      header: 'Security Scope Role',
      sortable: true,
      filterable: true,
      filterOptions: [...ADMIN_ROLES],
      render: (val: string) => (
        <Badge variant={val === 'super_admin' ? 'danger' : 'neutral'}>{val.replace('_', ' ').toUpperCase()}</Badge>
      ),
    },
    { key: 'active', header: 'Account Status', render: (val) => <Badge variant={val ? 'success' : 'danger'}>{val ? 'Active' : 'Revoked'}</Badge> },
    { key: 'createdAt', header: 'Created Date', sortable: true, render: (val) => new Date(val).toLocaleDateString() },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {isSuperAdmin && (
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <button
            onClick={() => setIsCreateOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'linear-gradient(135deg, #0284c7, #38bdf8)', border: 'none', color: '#fff', padding: '0.6rem 1.2rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
          >
            <Plus size={16} /> Create New Internal Admin Account
          </button>
        </div>
      )}

      <DataTable
        title="Internal Administrator Accounts"
        subtitle="Manage access privileges for Support and Super Admin accounts."
        columns={columns}
        data={adminUsers}
        keyExtractor={(item) => item.id}
        searchPlaceholder="Search admin name, email, role..."
        rowActions={
          isSuperAdmin
            ? [
                {
                  label: 'Toggle Access',
                  icon: <Lock size={14} />,
                  onClick: (row) => handleToggleActive(row),
                },
              ]
            : undefined
        }
      />

      <Modal
        isOpen={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        title="Provision Internal Admin Account"
        subtitle="Assign a Support or Super Admin role."
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
              autoComplete="off"
              placeholder="e.g. anand@goone.in"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '0.6rem', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.3rem' }}>Temporary Password *</label>
            <input
              type="password"
              required
              minLength={8}
              autoComplete="new-password"
              placeholder="Min. 8 characters"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '0.6rem', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.3rem' }}>Security Scope Role *</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as BackendAdminRole)}
              style={{ width: '100%', padding: '0.6rem', background: '#1e293b', border: '1px solid #38bdf8', borderRadius: '8px', color: '#38bdf8', fontWeight: 600 }}
            >
              <option value="support">Support Agent</option>
              <option value="super_admin">Super Admin (Full Governance)</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid #334155', paddingTop: '1rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={() => setIsCreateOpen(false)} style={{ background: '#1e293b', border: '1px solid #334155', color: '#cbd5e1', padding: '0.55rem 1rem', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
            <button type="submit" disabled={isSubmitting} style={{ background: 'linear-gradient(135deg, #0284c7, #38bdf8)', border: 'none', color: '#fff', padding: '0.55rem 1.1rem', borderRadius: '8px', cursor: isSubmitting ? 'not-allowed' : 'pointer', fontWeight: 600, opacity: isSubmitting ? 0.7 : 1 }}>
              {isSubmitting ? 'Creating...' : 'Create Account'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
