import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { Business, BusinessStatus } from '../types';
import { DataTable, Column } from '../components/DataTable';
import { Badge } from '../components/Badge';
import { Modal } from '../components/Modal';
import { ConfirmationDialog } from '../components/ConfirmationDialog';
import { Building2, Eye, ShieldAlert, CircleCheck as CheckCircle2 } from 'lucide-react';

export const Businesses: React.FC = () => {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [selectedBusiness, setSelectedBusiness] = useState<Business | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isSuspendDialogOpen, setIsSuspendDialogOpen] = useState(false);

  useEffect(() => {
    api.getBusinesses().then(setBusinesses);
  }, []);

  const handleSuspend = (reason: string) => {
    if (!selectedBusiness) return;
    setBusinesses(prev => prev.map(b => b.id === selectedBusiness.id ? { ...b, status: 'suspended' as BusinessStatus } : b));
    alert(`Business '${selectedBusiness.name}' suspended. Reason: ${reason}`);
  };

  const handleReinstate = (b: Business) => {
    setBusinesses(prev => prev.map(item => item.id === b.id ? { ...item, status: 'active' as BusinessStatus } : item));
    alert(`Business '${b.name}' reinstated to Active status.`);
  };

  const columns: Column<Business>[] = [
    { key: 'name', header: 'Business Name', sortable: true },
    { key: 'category', header: 'Category', accessor: (row) => row.category?.name || 'General' },
    { key: 'owner', header: 'Owner Name', accessor: (row) => row.owner?.name || '-' },
    { key: 'ownerPhone', header: 'Owner Contact', accessor: (row) => row.owner?.phoneNumber || '-' },
    { key: 'city', header: 'Location / City', accessor: (row) => `${row.city || ''}, ${row.state || ''}` },
    {
      key: 'status',
      header: 'KYC & App Status',
      sortable: true,
      filterable: true,
      filterOptions: ['active', 'pending_verification', 'suspended'],
      render: (val: BusinessStatus) => {
        const map: Record<BusinessStatus, any> = {
          active: 'success',
          pending_verification: 'warning',
          suspended: 'danger',
        };
        return <Badge variant={map[val] || 'neutral'}>{val.replace('_', ' ')}</Badge>;
      },
    },
    { key: 'totalOrdersCount', header: 'Total Orders', sortable: true, render: (val) => val || 0 },
    { key: 'totalRevenue', header: 'Revenue (₹)', sortable: true, render: (val) => `₹${(val || 0).toLocaleString()}` },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <DataTable
        title="Registered Businesses & Shops"
        subtitle="Manage shop profiles, verify legal registration status, and control operational state."
        columns={columns}
        data={businesses}
        keyExtractor={(item) => item.id}
        searchPlaceholder="Search shop name, owner, city..."
        searchFields={['name', 'city', 'pincode']}
        onRowClick={(row) => {
          setSelectedBusiness(row);
          setIsDetailModalOpen(true);
        }}
        rowActions={[
          {
            label: 'View Shop Profile',
            icon: <Eye size={14} />,
            onClick: (row) => {
              setSelectedBusiness(row);
              setIsDetailModalOpen(true);
            },
          },
          {
            label: 'Reinstate Active Status',
            icon: <CheckCircle2 size={14} />,
            variant: 'success',
            onClick: (row) => handleReinstate(row),
          },
          {
            label: 'Suspend Business',
            icon: <ShieldAlert size={14} />,
            variant: 'danger',
            onClick: (row) => {
              setSelectedBusiness(row);
              setIsSuspendDialogOpen(true);
            },
          },
        ]}
      />

      {/* Business Profile Modal */}
      {selectedBusiness && (
        <Modal
          isOpen={isDetailModalOpen}
          onClose={() => setIsDetailModalOpen(false)}
          title={selectedBusiness.name}
          subtitle={`Business ID: ${selectedBusiness.id}`}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
            <div style={{ background: '#1e293b', padding: '0.85rem', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Category & Module</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#38bdf8' }}>{selectedBusiness.category?.name}</div>
            </div>
            <div style={{ background: '#1e293b', padding: '0.85rem', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Owner Info</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#f8fafc' }}>{selectedBusiness.owner?.name} ({selectedBusiness.owner?.phoneNumber})</div>
            </div>
            <div style={{ background: '#1e293b', padding: '0.85rem', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Address</div>
              <div style={{ fontSize: '0.95rem', color: '#cbd5e1' }}>{selectedBusiness.address}, {selectedBusiness.city}, {selectedBusiness.pincode}</div>
            </div>
            <div style={{ background: '#1e293b', padding: '0.85rem', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Sales Lifetime</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#34d399' }}>{selectedBusiness.totalOrdersCount} orders • ₹{selectedBusiness.totalRevenue?.toLocaleString()}</div>
            </div>
          </div>
          <div style={{ display: 'flex', justifyContent: 'flex-end', borderTop: '1px solid #334155', paddingTop: '1rem' }}>
            <button onClick={() => setIsDetailModalOpen(false)} style={{ background: '#1e293b', border: '1px solid #334155', color: '#cbd5e1', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer' }}>Close</button>
          </div>
        </Modal>
      )}

      {/* Mandatory Reason Confirmation Modal */}
      <ConfirmationDialog
        isOpen={isSuspendDialogOpen}
        onClose={() => setIsSuspendDialogOpen(false)}
        onConfirm={handleSuspend}
        title={`Suspend Business: ${selectedBusiness?.name}`}
        message="Suspending a business blocks all new order creation and billing operations immediately. A mandatory audit log reason is required."
        confirmText="Confirm Suspension"
        variant="danger"
        requireReason={true}
      />
    </div>
  );
};
