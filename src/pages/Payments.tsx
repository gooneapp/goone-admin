import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { Order } from '../types';
import { DataTable, Column } from '../components/DataTable';
import { Badge } from '../components/Badge';
import { StatCard } from '../components/StatCard';
import { DollarSign, CreditCard, ArrowUpRight, ShieldCheck } from 'lucide-react';

export const Payments: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    api.getOrders().then(setOrders);
  }, []);

  const totalCollected = orders.reduce((sum, o) => sum + (o.paymentStatus === 'paid' ? o.totalAmount : 0), 0);

  const columns: Column<Order>[] = [
    { key: 'orderNumber', header: 'Transaction Order ID', sortable: true, render: (val) => <span style={{ fontWeight: 600, color: '#38bdf8' }}>{val}</span> },
    { key: 'businessName', header: 'Merchant', sortable: true },
    { key: 'customerName', header: 'Payer Customer', sortable: true },
    { key: 'totalAmount', header: 'Amount (₹)', sortable: true, render: (val) => `₹${val.toFixed(2)}` },
    {
      key: 'paymentMethod',
      header: 'Settlement Method',
      sortable: true,
      filterable: true,
      filterOptions: ['cash', 'upi', 'credit'],
      render: (val) => <Badge variant={val === 'upi' ? 'info' : val === 'credit' ? 'purple' : 'warning'}>{val.toUpperCase()}</Badge>,
    },
    {
      key: 'paymentStatus',
      header: 'Status',
      sortable: true,
      render: (val) => <Badge variant={val === 'paid' ? 'success' : 'danger'}>{val.toUpperCase()}</Badge>,
    },
    { key: 'createdAt', header: 'Settlement Timestamp', sortable: true, render: (val) => new Date(val).toLocaleString() },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
        <StatCard title="Total Cash & UPI Collections" value={`₹${totalCollected.toLocaleString()}`} icon={<DollarSign size={20} />} accentColor="#34d399" />
        <StatCard title="UPI Instant Settlements" value="84.2%" icon={<CreditCard size={20} />} accentColor="#38bdf8" />
        <StatCard title="Pending Cash Reconciliation" value="₹14,250" icon={<ArrowUpRight size={20} />} accentColor="#fbbf24" />
      </div>

      <DataTable
        title="Financial Transactions & Payment Logs"
        subtitle="Audited Cash, UPI Deep-Link, and Khata credit settlements."
        columns={columns}
        data={orders}
        keyExtractor={(item) => item.id}
        searchPlaceholder="Search order ID, shop, customer..."
      />
    </div>
  );
};
