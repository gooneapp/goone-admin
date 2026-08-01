import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { ApiKey } from '../types';
import { DataTable, Column } from '../components/DataTable';
import { Badge } from '../components/Badge';
import { TriangleAlert as AlertTriangle } from 'lucide-react';

export const ApiManagement: React.FC = () => {
  const [keys, setKeys] = useState<ApiKey[]>([]);

  useEffect(() => {
    api.getApiKeys().then(setKeys);
  }, []);

  const columns: Column<ApiKey>[] = [
    { key: 'name', header: 'Key Alias / Integration Name', sortable: true },
    { key: 'keyPreview', header: 'Key', render: (val) => <span style={{ fontFamily: 'monospace', color: '#38bdf8' }}>{val}</span> },
    {
      key: 'scopes',
      header: 'Scope Permissions',
      render: (val: string[]) => (
        <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
          {val?.map(p => <Badge key={p} variant="purple">{p}</Badge>)}
        </div>
      ),
    },
    { key: 'admin', header: 'Created By', accessor: (row) => row.admin?.name || '-' },
    { key: 'lastUsedAt', header: 'Last Invoked', render: (val) => val ? new Date(val).toLocaleDateString() : 'Never' },
    { key: 'expiresAt', header: 'Expires', render: (val) => val ? new Date(val).toLocaleDateString() : 'Never' },
    { key: 'isActive', header: 'Status', render: (val) => <Badge variant={val ? 'success' : 'danger'}>{val ? 'Active' : 'Revoked'}</Badge> },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.35)', borderRadius: '12px', padding: '1rem 1.25rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
        <AlertTriangle color="#f59e0b" size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
        <div style={{ fontSize: '0.85rem', color: '#fde68a', lineHeight: '1.5' }}>
          <strong>Key management isn't wired up yet.</strong> The backend only exposes a read-only API key listing — there's no generate/revoke/delete endpoint yet, so this view is reporting-only for now. Secret values are never returned by the API; only a masked preview is shown.
        </div>
      </div>

      <DataTable
        title="API Keys & Third-Party Webhook Management"
        subtitle="Read-only view of provisioned external API keys, scopes, and usage."
        columns={columns}
        data={keys}
        keyExtractor={(item) => item.id}
      />
    </div>
  );
};
