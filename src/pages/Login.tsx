import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { AdminRole } from '../types';
import { ShieldCheck, Lock, Mail, UserCheck } from 'lucide-react';

export const Login: React.FC = () => {
  const { setAuth } = useAuthStore();
  const [email, setEmail] = useState('admin@gon.com');
  const [password, setPassword] = useState('password123');

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { apiClient } = await import('../api/client');
      const res = await apiClient.post('/admin/auth/login', { email, password });
      
      const payload = res.data?.data || res.data;
      const finalToken = payload?.access_token || payload?.token;
      const refreshToken = payload?.refresh_token || '';
      const adminUser = payload?.admin;
      
      if (!finalToken) {
        throw new Error('No authorization token received from server.');
      }
      
      setAuth(finalToken, refreshToken, adminUser);
      
      const { toast } = await import('../store/toastStore');
      toast.success('Successfully logged in');
    } catch (err) {
      // API error toasts are handled by apiClient response interceptor
    } finally {
      setIsLoading(false);
    }
  };

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

          <button
            type="submit"
            disabled={isLoading}
            style={{
              marginTop: '0.5rem',
              padding: '0.75rem',
              background: isLoading ? '#475569' : 'linear-gradient(135deg, #0284c7, #38bdf8)',
              border: 'none',
              borderRadius: '8px',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.95rem',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              boxShadow: isLoading ? 'none' : '0 4px 15px rgba(56, 189, 248, 0.4)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem',
            }}
          >
            <ShieldCheck size={18} /> {isLoading ? 'Authenticating...' : 'Sign In to Portal'}
          </button>
        </form>
      </div>
    </div>
  );
};
