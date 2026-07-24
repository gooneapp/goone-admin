import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { CreditAccount } from '../types';
import { DataTable, Column } from '../components/DataTable';
import { Badge } from '../components/Badge';
import { StatCard } from '../components/StatCard';
import { ConfirmationDialog } from '../components/ConfirmationDialog';
import { BookOpen, TriangleAlert as AlertTriangle, ShieldCheck, DollarSign } from 'lucide-react';

export const CreditManagement: React.FC = () => {
  const [credits, setCredits] = useState<CreditAccount[]>([]);
  const [selectedCredit, setSelectedCredit] = useState<CreditAccount | null>(null);
  const [isWriteOffOpen, setIsWriteOffOpen] = useState(false);

  useEffect(() => {
    api.getCreditAccounts().then(setCredits);
  }, []);

  const totalReceivables = credits.reduce((sum, c) => sum + c.currentBalance, 0);

  const handleWriteOff = (reason: string) => {
    if (!selectedCredit) return;
    setCredits(prev => prev.map(c => c.id === selectedCredit.id ? { ...c, status: 'written_off' as any, currentBalance: 0 } : c));
    alert(`Credit debt for ${selectedCredit.customerName} written off. Reason: ${reason}`);
  };

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
        <StatCard title="SMS Reminders Sent Today" value="1,420" icon={<ShieldCheck size={20} />} accentColor="#34d399" />
      </div>

      <DataTable
        title="Platform Credit Book (Khata) Audit"
        subtitle="Cross-tenant overview of customer credit balances, repayment logs, and write-off reviews."
        columns={columns}
        data={credits}
        keyExtractor={(item) => item.id}
        searchPlaceholder="Search customer, shop, phone..."
        rowActions={[
          {
            label: 'Review Debt Write-Off',
            icon: <AlertTriangle size={14} />,
            variant: 'danger',
            onClick: (row) => {
              setSelectedCredit(row);
              setIsWriteOffOpen(true);
            },
          },
        ]}
      />

      <ConfirmationDialog
        isOpen={isWriteOffOpen}
        onClose={() => setIsWriteOffOpen(false)}
        onConfirm={handleWriteOff}
        title={`Approve Debt Write-Off: ${selectedCredit?.customerName}`}
        message="Writing off a credit entry removes the debt from active ledger totals. A mandatory audit log reason must be recorded."
        confirmText="Confirm Write-Off"
        variant="danger"
        requireReason={true}
      />
    </div>
  );
};
