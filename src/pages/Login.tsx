import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { AdminRole } from '../types';
import { ShieldCheck, Lock, Mail, UserCheck } from 'lucide-react';

export const Login: React.FC = () => {
  const { setAuth } = useAuthStore();
  const [email, setEmail] = useState('superadmin@goone.in');
  const [password, setPassword] = useState('password123');
  const [selectedRole, setSelectedRole] = useState<AdminRole>('super_admin');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuth('demo-jwt-token-production-ready', {
      id: `usr-adm-${Date.now()}`,
      email,
      name: `GoOne ${selectedRole.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase())}`,
      role: selectedRole,
      active: true,
      createdAt: new Date().toISOString(),
    });
  };

  const roles: { role: AdminRole; label: string }[] = [
    { role: 'super_admin', label: 'Super Admin' },
    { role: 'admin', label: 'Admin' },
    { role: 'manager', label: 'Operations Manager' },
    { role: 'support', label: 'Support Agent' },
    { role: 'finance', label: 'Finance Lead' },
    { role: 'marketing', label: 'Marketing Lead' },
    { role: 'operations', label: 'Fleet & Logistics Lead' },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'radial-gradient(circle at top right, #1e293b, #090d16)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', color: '#f8fafc' }}>
      <div style={{ background: 'rgba(15, 23, 42, 0.85)', backdropFilter: 'blur(16px)', border: '1px solid #334155', borderRadius: '16px', padding: '2.5rem', width: '100%', maxWidth: '440px', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.7)' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: 'linear-gradient(135deg, #0284c7, #38bdf8)', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontWeight: 900, color: '#fff', fontSize: '1.75rem', boxShadow: '0 0 20px rgba(56, 189, 248, 0.5)', marginBottom: '1rem' }}>
            GO
          </div>
          <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700 }}>GoOne Admin Portal</h2>
          <p style={{ margin: '0.4rem 0 0 0', fontSize: '0.875rem', color: '#94a3b8' }}>Production Executive Management Operating System</p>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: '#cbd5e1', marginBottom: '0.4rem' }}>Email Address</label>
            <div style={{ position: 'relative' }}>
              <Mail size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: '100%', padding: '0.65rem 0.75rem 0.65rem 2.25rem', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc', fontSize: '0.9rem', outline: 'none' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: '#cbd5e1', marginBottom: '0.4rem' }}>Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{ width: '100%', padding: '0.65rem 0.75rem 0.65rem 2.25rem', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc', fontSize: '0.9rem', outline: 'none' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: '#cbd5e1', marginBottom: '0.4rem' }}>Select Role Security Scope</label>
            <div style={{ position: 'relative' }}>
              <UserCheck size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#38bdf8' }} />
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value as AdminRole)}
                style={{ width: '100%', padding: '0.65rem 0.75rem 0.65rem 2.25rem', background: '#1e293b', border: '1px solid #0284c7', borderRadius: '8px', color: '#38bdf8', fontWeight: 600, fontSize: '0.9rem', outline: 'none' }}
              >
                {roles.map((r) => (
                  <option key={r.role} value={r.role}>{r.label}</option>
                ))}
              </select>
            </div>
          </div>

          <button
            type="submit"
            style={{
              marginTop: '0.5rem',
              padding: '0.75rem',
              background: 'linear-gradient(135deg, #0284c7, #38bdf8)',
              border: 'none',
              borderRadius: '8px',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(56, 189, 248, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}
          >
            <ShieldCheck size={18} /> Sign In to Portal
          </button>
        </form>
      </div>
    </div>
  );
};
