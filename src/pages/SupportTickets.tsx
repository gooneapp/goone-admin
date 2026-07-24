import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { SupportTicket } from '../types';
import { DataTable, Column } from '../components/DataTable';
import { Badge } from '../components/Badge';
import { Modal } from '../components/Modal';
import { LifeBuoy, Clock, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle2, UserCheck, ShieldAlert } from 'lucide-react';

export const SupportTickets: React.FC = () => {
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    api.getSupportTickets().then(setTickets);
  }, []);

  const handleUpdateTicketStatus = (ticket: SupportTicket, newStatus: string) => {
    setTickets(prev => prev.map(t => t.id === ticket.id ? { ...t, status: newStatus as any } : t));
    alert(`Ticket ${ticket.ticketNumber} updated to status: ${newStatus.toUpperCase()}`);
    setIsModalOpen(false);
  };

  const columns: Column<SupportTicket>[] = [
    { key: 'ticketNumber', header: 'Ticket Ref', sortable: true, render: (val, row) => (
      <span style={{ fontWeight: 600, color: row.isEmergencySos ? '#ef4444' : '#38bdf8' }}>
        {val} {row.isEmergencySos && '🚨 SOS'}
      </span>
    )},
    { key: 'raisedByName', header: 'Raised By Customer/Driver', sortable: true, render: (val, row) => `${val} (${row.raisedByPhone})` },
    { key: 'category', header: 'Category', sortable: true, render: (val) => <Badge variant="info">{val.toUpperCase()}</Badge> },
    { key: 'description', header: 'Issue Description' },
    {
      key: 'priority',
      header: 'Priority & Emergency',
      sortable: true,
      filterable: true,
      filterOptions: ['critical', 'high', 'medium', 'low'],
      render: (val, row) => (
        <Badge variant={val === 'critical' || row.isEmergencySos ? 'danger' : val === 'high' ? 'warning' : 'neutral'}>
          {row.isEmergencySos ? '🚨 EMERGENCY SOS' : val.toUpperCase()}
        </Badge>
      ),
    },
    {
      key: 'status',
      header: 'Resolution Status',
      sortable: true,
      filterable: true,
      filterOptions: ['open', 'in_progress', 'resolved', 'closed'],
      render: (val) => {
        const variants: Record<string, any> = { open: 'danger', in_progress: 'warning', resolved: 'success', closed: 'neutral' };
        return <Badge variant={variants[val] || 'neutral'}>{val.replace('_', ' ').toUpperCase()}</Badge>;
      },
    },
    { key: 'slaDueAt', header: 'SLA Timer Target', sortable: true, render: (val) => new Date(val).toLocaleTimeString() },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <DataTable
        title="Support Tickets Queue & Emergency SOS Center"
        subtitle="Manage customer, driver, and merchant tickets with SLA countdown tracking and emergency SOS escalation."
        columns={columns}
        data={tickets}
        keyExtractor={(item) => item.id}
        searchPlaceholder="Search ticket ID, description, name, phone..."
        onRowClick={(row) => {
          setSelectedTicket(row);
          setIsModalOpen(true);
        }}
        rowActions={[
          {
            label: 'Review & Resolve Ticket',
            icon: <LifeBuoy size={14} />,
            onClick: (row) => {
              setSelectedTicket(row);
              setIsModalOpen(true);
            },
          },
        ]}
      />

      {/* Ticket Modal */}
      {selectedTicket && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`Ticket Details: ${selectedTicket.ticketNumber}`}
          subtitle={`Priority: ${selectedTicket.priority.toUpperCase()}`}
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
            {selectedTicket.isEmergencySos && (
              <div style={{ background: 'rgba(239, 68, 68, 0.2)', border: '1px solid #ef4444', color: '#f87171', padding: '0.85rem', borderRadius: '8px', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <ShieldAlert size={20} /> Emergency SOS Triggered by Rider/Driver! Immediate Action Required.
              </div>
            )}

            <div style={{ background: '#1e293b', padding: '0.85rem', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>User Details</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#f8fafc', marginTop: '0.2rem' }}>{selectedTicket.raisedByName} ({selectedTicket.raisedByPhone})</div>
            </div>

            <div style={{ background: '#1e293b', padding: '0.85rem', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Description of Issue</div>
              <div style={{ fontSize: '0.9rem', color: '#cbd5e1', marginTop: '0.2rem', lineHeight: '1.4' }}>{selectedTicket.description}</div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid #334155', paddingTop: '1rem' }}>
            <button onClick={() => setIsModalOpen(false)} style={{ background: '#1e293b', border: '1px solid #334155', color: '#cbd5e1', padding: '0.55rem 1rem', borderRadius: '8px', cursor: 'pointer' }}>Close</button>
            <button onClick={() => handleUpdateTicketStatus(selectedTicket, 'in_progress')} style={{ background: '#f59e0b', border: 'none', color: '#fff', padding: '0.55rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Mark In Progress</button>
            <button onClick={() => handleUpdateTicketStatus(selectedTicket, 'resolved')} style={{ background: '#10b981', border: 'none', color: '#fff', padding: '0.55rem 1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Mark Resolved</button>
          </div>
        </Modal>
      )}
    </div>
  );
};
