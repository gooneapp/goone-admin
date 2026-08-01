import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { Order, OrderStatus } from '../types';
import { DataTable, Column } from '../components/DataTable';
import { Badge } from '../components/Badge';
import { Modal } from '../components/Modal';
import { ShoppingCart, Eye, Receipt, Printer, Truck, CircleCheck as CheckCircle } from 'lucide-react';

export const Orders: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isReceiptOpen, setIsReceiptOpen] = useState(false);

  useEffect(() => {
    api.getOrders().then(setOrders);
  }, []);

  const columns: Column<Order>[] = [
    { key: 'id', header: 'Order Ref Number', accessor: (row) => `ORD-${row.id.slice(0, 8).toUpperCase()}`, render: (val) => <span style={{ fontWeight: 600, color: '#38bdf8' }}>{val}</span> },
    { key: 'business', header: 'Shop / Restaurant', accessor: (row) => row.business?.name || '-' },
    { key: 'customer', header: 'Customer', accessor: (row) => row.customer?.name || 'Walk-in' },
    { key: 'totalAmount', header: 'Total (₹)', sortable: true, render: (val) => `₹${Number(val).toFixed(2)}` },
    {
      key: 'status',
      header: 'Order Lifecycle State',
      sortable: true,
      filterable: true,
      filterOptions: ['placed', 'accepted', 'preparing', 'out_for_delivery', 'completed', 'cancelled'],
      render: (val: OrderStatus) => {
        const variants: Record<OrderStatus, any> = {
          placed: 'warning',
          accepted: 'info',
          preparing: 'purple',
          out_for_delivery: 'info',
          ready_for_pickup: 'info',
          completed: 'success',
          cancelled: 'danger',
        };
        return <Badge variant={variants[val] || 'neutral'}>{val.replace('_', ' ')}</Badge>;
      },
    },
    {
      key: 'paymentStatus',
      header: 'Payment Status',
      render: (val, row) => <Badge variant={val === 'paid' ? 'success' : val === 'credit' ? 'purple' : 'warning'}>{val.toUpperCase()} ({row.paymentMethod})</Badge>,
    },
    {
      key: 'channel',
      header: 'Channel & KOT',
      render: (_, row) => (
        <div style={{ fontSize: '0.8rem' }}>
          <div>{row.delivery ? '🚚 Delivery' : '🏪 Counter / Pickup'}</div>
          {row.kot && <div style={{ color: '#fbbf24', fontWeight: 600 }}>KOT: {row.kot.status} ({row.kot.table?.tableNumber || 'Takeaway'})</div>}
        </div>
      ),
    },
    { key: 'createdAt', header: 'Timestamp', sortable: true, render: (val) => new Date(val).toLocaleTimeString() },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <DataTable
        title="Live Orders & KOT Invoice Receipts"
        subtitle="Monitor system-wide retail orders, restaurant KOT kitchen tickets, and delivery dispatch statuses."
        columns={columns}
        data={orders}
        keyExtractor={(item) => item.id}
        searchPlaceholder="Search order number, shop, customer..."
        onRowClick={(row) => {
          setSelectedOrder(row);
          setIsReceiptOpen(true);
        }}
        rowActions={[
          {
            label: 'View Invoice & ESC/POS Bill',
            icon: <Receipt size={14} />,
            onClick: (row) => {
              setSelectedOrder(row);
              setIsReceiptOpen(true);
            },
          },
        ]}
      />

      {/* Invoice Receipt Modal */}
      {selectedOrder && (
        <Modal
          isOpen={isReceiptOpen}
          onClose={() => setIsReceiptOpen(false)}
          title={`Order Receipt: ORD-${selectedOrder.id.slice(0, 8).toUpperCase()}`}
          subtitle={`Fulfilled by ${selectedOrder.business?.name || '-'}`}
        >
          <div style={{ background: '#090d16', border: '1px dashed #334155', borderRadius: '12px', padding: '1.5rem', fontFamily: 'monospace', color: '#f8fafc', marginBottom: '1rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '1rem', borderBottom: '1px dashed #334155', paddingBottom: '0.75rem' }}>
              <h3 style={{ margin: 0, fontSize: '1.2rem', textTransform: 'uppercase' }}>{selectedOrder.business?.name || '-'}</h3>
              <p style={{ margin: '0.2rem 0 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>Order #ORD-{selectedOrder.id.slice(0, 8).toUpperCase()} • {new Date(selectedOrder.createdAt).toLocaleString()}</p>
            </div>

            <div style={{ fontSize: '0.85rem', marginBottom: '1rem' }}>
              <div>Customer: {selectedOrder.customer?.name || 'Walk-in'} ({selectedOrder.customer?.phoneNumber || '-'})</div>
              <div>Channel: {selectedOrder.delivery ? 'Home Delivery' : 'Store Pickup / Dine-in'}</div>
              {selectedOrder.kot?.table?.tableNumber && <div>Table No: {selectedOrder.kot.table.tableNumber} (KOT Ticket)</div>}
            </div>

            <table style={{ width: '100%', fontSize: '0.85rem', borderCollapse: 'collapse', marginBottom: '1rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #334155', textAlign: 'left', color: '#94a3b8' }}>
                  <th style={{ paddingBottom: '0.4rem' }}>Item</th>
                  <th style={{ paddingBottom: '0.4rem', textAlign: 'center' }}>Qty</th>
                  <th style={{ paddingBottom: '0.4rem', textAlign: 'right' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {selectedOrder.items && selectedOrder.items.length > 0 ? (
                  selectedOrder.items.map((item) => (
                    <tr key={item.id} style={{ borderBottom: '1px solid #1e293b' }}>
                      <td style={{ padding: '0.4rem 0' }}>{item.name}</td>
                      <td style={{ padding: '0.4rem 0', textAlign: 'center' }}>{item.quantity}</td>
                      <td style={{ padding: '0.4rem 0', textAlign: 'right' }}>₹{Number(item.subtotal).toFixed(2)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} style={{ padding: '0.4rem 0' }}>No line items recorded for this order.</td>
                  </tr>
                )}
              </tbody>
            </table>

            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.1rem', fontWeight: 700, borderTop: '1px dashed #334155', paddingTop: '0.75rem', color: '#34d399' }}>
              <span>Grand Total</span>
              <span>₹{Number(selectedOrder.totalAmount).toFixed(2)}</span>
            </div>
            <div style={{ fontSize: '0.775rem', color: '#94a3b8', textAlign: 'center', marginTop: '0.75rem' }}>
              Payment Mode: {selectedOrder.paymentMethod.toUpperCase()} • Status: {selectedOrder.paymentStatus.toUpperCase()}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button onClick={() => window.print()} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#1e293b', border: '1px solid #334155', color: '#38bdf8', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer' }}>
              <Printer size={16} /> Print ESC/POS Bill
            </button>
            <button onClick={() => setIsReceiptOpen(false)} style={{ background: '#1e293b', border: '1px solid #334155', color: '#cbd5e1', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer' }}>
              Close
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};
