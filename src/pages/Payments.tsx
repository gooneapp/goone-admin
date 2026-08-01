import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { Order } from '../types';
import { DataTable, Column } from '../components/DataTable';
import { Badge } from '../components/Badge';
import { StatCard } from '../components/StatCard';
import { DollarSign } from 'lucide-react';

export const Payments: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    api.getOrders().then(setOrders);
  }, []);

  const totalCollected = orders.reduce((sum, o) => sum + (o.paymentStatus === 'paid' ? Number(o.totalAmount) : 0), 0);
  const upiShare = orders.length ? (orders.filter(o => o.paymentMethod === 'upi').length / orders.length) * 100 : 0;
  const pendingCollection = orders.reduce((sum, o) => sum + (o.paymentStatus !== 'paid' ? Number(o.totalAmount) : 0), 0);

  const columns: Column<Order>[] = [
    { key: 'id', header: 'Transaction Order ID', accessor: (row) => `ORD-${row.id.slice(0, 8).toUpperCase()}`, render: (val) => <span style={{ fontWeight: 600, color: '#38bdf8' }}>{val}</span> },
    { key: 'business', header: 'Merchant', accessor: (row) => row.business?.name || '-' },
    { key: 'customer', header: 'Payer Customer', accessor: (row) => row.customer?.name || 'Walk-in' },
    { key: 'totalAmount', header: 'Amount (₹)', sortable: true, render: (val) => `₹${Number(val).toFixed(2)}` },
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
        <StatCard title="UPI Payment Share" value={`${upiShare.toFixed(1)}%`} icon={<DollarSign size={20} />} accentColor="#38bdf8" />
        <StatCard title="Pending Collections" value={`₹${pendingCollection.toLocaleString()}`} icon={<DollarSign size={20} />} accentColor="#fbbf24" />
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
