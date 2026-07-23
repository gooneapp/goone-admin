import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { ApiKey } from '../types';
import { DataTable, Column } from '../components/DataTable';
import { Badge } from '../components/Badge';
import { Key, Plus, Copy, Lock } from 'lucide-react';

export const ApiManagement: React.FC = () => {
  const [keys, setKeys] = useState<ApiKey[]>([]);

  useEffect(() => {
    api.getApiKeys().then(setKeys);
  }, []);

  const columns: Column<ApiKey>[] = [
    { key: 'name', header: 'Key Alias / Integration Name', sortable: true },
    { key: 'keyPrefix', header: 'Key Prefix', render: (val) => <span style={{ fontFamily: 'monospace', color: '#38bdf8' }}>{val}****************</span> },
    {
      key: 'permissions',
      header: 'Scope Permissions',
      render: (val: string[]) => (
        <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
          {val.map(p => <Badge key={p} variant="purple">{p}</Badge>)}
        </div>
      ),
    },
    { key: 'rateLimit', header: 'Rate Limit (req/min)', render: (val) => `${val} RPM` },
    { key: 'lastUsedAt', header: 'Last Invoked', render: (val) => val ? new Date(val).toLocaleDateString() : 'Never' },
    { key: 'active', header: 'Status', render: (val) => <Badge variant={val ? 'success' : 'danger'}>{val ? 'Active' : 'Revoked'}</Badge> },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <DataTable
        title="API Keys & Third-Party Webhook Management"
        subtitle="Provision external API keys, rate limits, and webhook event subscriptions for enterprise integrations."
        columns={columns}
        data={keys}
        keyExtractor={(item) => item.id}
      />
    </div>
  );
};
