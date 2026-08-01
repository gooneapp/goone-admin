import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { CreditAccount } from '../types';
import { DataTable, Column } from '../components/DataTable';
import { Badge } from '../components/Badge';
import { StatCard } from '../components/StatCard';
import { BookOpen, DollarSign } from 'lucide-react';

export const CreditManagement: React.FC = () => {
  const [credits, setCredits] = useState<CreditAccount[]>([]);

  useEffect(() => {
    api.getCreditAccounts().then(setCredits);
  }, []);

  const totalReceivables = credits.reduce((sum, c) => sum + c.currentBalance, 0);

  const columns: Column<CreditAccount>[] = [
    { key: 'customerName', header: 'Debtor Customer', sortable: true },
    { key: 'customerPhone', header: 'Contact Phone', sortable: true },
    { key: 'businessName', header: 'Creditor Shop', sortable: true },
    { key: 'currentBalance', header: 'Outstanding Dues (₹)', sortable: true, render: (val) => <span style={{ fontWeight: 700, color: '#f87171' }}>₹{val.toFixed(2)}</span> },
    { key: 'creditLimit', header: 'Credit Limit (₹)', render: (val) => `₹${val.toFixed(2)}` },
    {
      key: 'status',
      header: 'Ledger State',
      sortable: true,
      filterable: true,
      filterOptions: ['active', 'overdue', 'written_off'],
      render: (val) => {
        const map: Record<string, any> = { active: 'info', overdue: 'warning', written_off: 'danger' };
        return <Badge variant={map[val] || 'neutral'}>{val.toUpperCase()}</Badge>;
      },
    },
    { key: 'lastTransactionDate', header: 'Last Entry', sortable: true, render: (val) => new Date(val).toLocaleDateString() },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
        <StatCard title="Platform Outstanding Dues" value={`₹${totalReceivables.toLocaleString()}`} icon={<BookOpen size={20} />} accentColor="#f87171" />
        <StatCard title="Active Khata Ledgers" value={credits.length} icon={<DollarSign size={20} />} accentColor="#38bdf8" />
      </div>

      <DataTable
        title="Platform Credit Book (Khata) Audit"
        subtitle="Cross-tenant overview of customer credit balances and repayment logs. Write-offs must be recorded by the business owner from their Business App — this admin view is read-only."
        columns={columns}
        data={credits}
        keyExtractor={(item) => item.id}
        searchPlaceholder="Search customer, shop, phone..."
      />
    </div>
  );
};
