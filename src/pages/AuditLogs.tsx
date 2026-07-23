import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { AuditLog } from '../types';
import { DataTable, Column } from '../components/DataTable';
import { Badge } from '../components/Badge';
import { ShieldCheck, Lock } from 'lucide-react';

export const AuditLogs: React.FC = () => {
  const [logs, setLogs] = useState<AuditLog[]>([]);

  useEffect(() => {
    api.getAuditLogs().then(setLogs);
  }, []);

  const columns: Column<AuditLog>[] = [
    { key: 'actionType', header: 'Administrative Action', sortable: true, render: (val) => <span style={{ fontWeight: 600, color: '#38bdf8' }}>{val}</span> },
    { key: 'actorName', header: 'Executing Admin User', sortable: true },
    { key: 'actorRole', header: 'Security Scope', render: (val) => <Badge variant="purple">{val ? val.toUpperCase() : 'UNKNOWN'}</Badge> },
    { key: 'entityReference', header: 'Target Resource', render: (_, row) => `${row.entityName || ''} (${row.entityReference})` },
    { key: 'reason', header: 'Mandatory Reason Logged', render: (val) => <span style={{ fontStyle: 'italic', color: '#fbbf24' }}>"{val || 'Standard System Operation'}"</span> },
    { key: 'ipAddress', header: 'IP Address', render: (val) => val || '127.0.0.1' },
    { key: 'timestamp', header: 'Timestamp', sortable: true, render: (val) => new Date(val).toLocaleString() },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <DataTable
        title="Immutable Platform Audit Log Trail"
        subtitle="Complete record of security role changes, business suspensions, manual subscription overrides, and debt write-offs."
        columns={columns}
        data={logs}
        keyExtractor={(item) => item.id}
        searchPlaceholder="Search action, actor, target, reason..."
      />
    </div>
  );
};
