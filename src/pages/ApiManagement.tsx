import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { ApiKey } from '../types';
import { DataTable, Column, RowAction } from '../components/DataTable';
import { Badge } from '../components/Badge';
import { Key, Plus, Copy, Lock, Edit, Trash } from 'lucide-react';
import { Modal } from '../components/Modal';
import { toast } from '../store/toastStore';

export const ApiManagement: React.FC = () => {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingKey, setEditingKey] = useState<ApiKey | null>(null);

  useEffect(() => {
    api.getApiKeys().then(setKeys);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingKey?.id) {
      setKeys(keys.map(k => k.id === editingKey.id ? editingKey : k));
      toast.success('API Key updated successfully');
    } else if (editingKey) {
      const newKey: ApiKey = { 
        ...editingKey, 
        id: `key-${Date.now()}`, 
        keyPrefix: 'g_api_' + Math.random().toString(36).substring(2, 6),
        createdAt: new Date().toISOString()
      };
      setKeys([...keys, newKey]);
      toast.success('New API Key generated successfully');
    }
    setIsModalOpen(false);
  };

  const handleRevoke = (id: string) => {
    if (window.confirm('Are you sure you want to revoke this API Key? Any integrations using it will immediately fail.')) {
      setKeys(keys.map(k => k.id === id ? { ...k, active: false } : k));
      toast.success('API Key revoked');
    }
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to permanently delete this API Key?')) {
      setKeys(keys.filter(k => k.id !== id));
      toast.success('API Key deleted');
    }
  };

  const columns: Column<ApiKey>[] = [
    { key: 'name', header: 'Key Alias / Integration Name', sortable: true },
    { key: 'keyPrefix', header: 'Key Prefix', render: (val) => <span style={{ fontFamily: 'monospace', color: '#38bdf8' }}>{val}****************</span> },
    {
      key: 'permissions',
      header: 'Scope Permissions',
      render: (val: string[]) => (
        <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
          {val?.map(p => <Badge key={p} variant="purple">{p}</Badge>)}
        </div>
      ),
    },
    { key: 'rateLimit', header: 'Rate Limit (req/min)', render: (val) => `${val} RPM` },
    { key: 'lastUsedAt', header: 'Last Invoked', render: (val) => val ? new Date(val).toLocaleDateString() : 'Never' },
    { key: 'active', header: 'Status', render: (val) => <Badge variant={val ? 'success' : 'danger'}>{val ? 'Active' : 'Revoked'}</Badge> },
  ];

  const rowActions: RowAction<ApiKey>[] = [
    { label: 'Edit Metadata', icon: <Edit size={15} />, onClick: (row) => { setEditingKey(row); setIsModalOpen(true); } },
    { label: 'Revoke Key', icon: <Lock size={15} />, variant: 'danger', onClick: (row) => handleRevoke(row.id) },
    { label: 'Delete Permanently', icon: <Trash size={15} />, variant: 'danger', onClick: (row) => handleDelete(row.id) }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={() => { setEditingKey({ id: '', name: '', keyPrefix: '', permissions: ['READ_ORDERS'], rateLimit: 60, active: true, createdAt: '' }); setIsModalOpen(true); }}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#38bdf8', color: '#0f172a', border: 'none', padding: '0.6rem 1rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
        >
          <Plus size={18} /> Generate New Key
        </button>
      </div>

      <DataTable
        title="API Keys & Third-Party Webhook Management"
        subtitle="Provision external API keys, rate limits, and webhook event subscriptions for enterprise integrations."
        columns={columns}
        data={keys}
        keyExtractor={(item) => item.id}
        rowActions={rowActions}
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingKey?.id ? 'Edit API Key' : 'Generate API Key'}>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.875rem' }}>Key Alias / Name</label>
            <input required value={editingKey?.name || ''} onChange={(e) => setEditingKey(prev => prev ? { ...prev, name: e.target.value } : null)} style={{ width: '100%', padding: '0.6rem', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#f8fafc' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.875rem' }}>Rate Limit (RPM)</label>
            <input type="number" required value={editingKey?.rateLimit || 60} onChange={(e) => setEditingKey(prev => prev ? { ...prev, rateLimit: parseInt(e.target.value) } : null)} style={{ width: '100%', padding: '0.6rem', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#f8fafc' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.875rem' }}>Scope Permissions</label>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
              {['READ_ORDERS', 'WRITE_ORDERS', 'READ_CATALOG', 'WRITE_CATALOG'].map(perm => (
                <label key={perm} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
                  <input type="checkbox" checked={editingKey?.permissions?.includes(perm) || false} onChange={(e) => {
                    setEditingKey(prev => {
                      if (!prev) return null;
                      const perms = prev.permissions || [];
                      return { ...prev, permissions: e.target.checked ? [...perms, perm] : perms.filter(p => p !== perm) };
                    });
                  }} />
                  {perm}
                </label>
              ))}
            </div>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input type="checkbox" checked={editingKey?.active || false} onChange={(e) => setEditingKey(prev => prev ? { ...prev, active: e.target.checked } : null)} />
            Active
          </label>
          <button type="submit" style={{ marginTop: '1rem', background: '#38bdf8', color: '#0f172a', border: 'none', padding: '0.75rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
            Save API Key
          </button>
        </form>
      </Modal>
    </div>
  );
};
