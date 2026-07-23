import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { SystemUser, UserType } from '../types';
import { DataTable, Column } from '../components/DataTable';
import { Badge } from '../components/Badge';
import { Modal } from '../components/Modal';
import { Users, Shield, Phone, Mail, UserCheck, Lock } from 'lucide-react';

export const UserList: React.FC = () => {
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    api.getUsers().then(setUsers);
  }, []);

  const columns: Column<SystemUser>[] = [
    { key: 'name', header: 'Full Name', sortable: true },
    { key: 'phoneNumber', header: 'Phone Number', sortable: true },
    { key: 'email', header: 'Email Address', sortable: true, render: (val) => val || '-' },
    {
      key: 'userType',
      header: 'Account Scope',
      sortable: true,
      filterable: true,
      filterOptions: ['customer', 'business_owner', 'employee', 'delivery_partner', 'ride_driver'],
      render: (val: UserType) => {
        const variants: Record<UserType, any> = {
          customer: 'info',
          business_owner: 'purple',
          employee: 'neutral',
          delivery_partner: 'warning',
          ride_driver: 'success',
          admin: 'danger',
        };
        return <Badge variant={variants[val] || 'neutral'}>{val.replace('_', ' ')}</Badge>;
      },
    },
    {
      key: 'preferredLanguage',
      header: 'Language',
      render: (val) => <span style={{ textTransform: 'uppercase', fontWeight: 600, color: '#38bdf8' }}>{val}</span>,
    },
    {
      key: 'isVerified',
      header: 'OTP Verified',
      render: (val) => <Badge variant={val ? 'success' : 'warning'}>{val ? 'Verified' : 'Unverified'}</Badge>,
    },
    {
      key: 'createdAt',
      header: 'Signup Date',
      sortable: true,
      render: (val) => new Date(val).toLocaleDateString(),
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <DataTable
        title="Universal System Users Directory"
        subtitle="Manage end-customer accounts, business owners, delivery partners, and drivers across all GoOne apps."
        columns={columns}
        data={users}
        keyExtractor={(item) => item.id}
        searchPlaceholder="Search by name, phone, email..."
        searchFields={['name', 'phoneNumber', 'email', 'userType']}
        onRowClick={(row) => {
          setSelectedUser(row);
          setIsModalOpen(true);
        }}
        rowActions={[
          {
            label: 'View Account Details',
            icon: <UserCheck size={14} />,
            onClick: (row) => {
              setSelectedUser(row);
              setIsModalOpen(true);
            },
          },
          {
            label: 'Toggle Account Lock',
            icon: <Lock size={14} />,
            variant: 'danger',
            onClick: (row) => {
              alert(`Toggled lock status for ${row.name}`);
            },
          },
        ]}
        bulkActions={[
          {
            label: 'Export Selected Users',
            onClick: (rows) => alert(`Exporting ${rows.length} users...`),
          },
        ]}
      />

      {/* User Detail Inspection Modal */}
      {selectedUser && (
        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={`User Profile: ${selectedUser.name}`}
          subtitle={`Account ID: ${selectedUser.id}`}
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.25rem' }}>
            <div style={{ background: '#1e293b', padding: '0.85rem', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Phone Number</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#f8fafc', marginTop: '0.2rem' }}>{selectedUser.phoneNumber}</div>
            </div>

            <div style={{ background: '#1e293b', padding: '0.85rem', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Email Address</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#f8fafc', marginTop: '0.2rem' }}>{selectedUser.email || 'Not provided'}</div>
            </div>

            <div style={{ background: '#1e293b', padding: '0.85rem', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>User Account Persona</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#38bdf8', marginTop: '0.2rem', textTransform: 'capitalize' }}>
                {selectedUser.userType.replace('_', ' ')}
              </div>
            </div>

            <div style={{ background: '#1e293b', padding: '0.85rem', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Preferred Language</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#f8fafc', marginTop: '0.2rem', textTransform: 'uppercase' }}>
                {selectedUser.preferredLanguage}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid #334155', paddingTop: '1rem' }}>
            <button
              onClick={() => setIsModalOpen(false)}
              style={{ background: '#1e293b', border: '1px solid #334155', color: '#cbd5e1', padding: '0.5rem 1rem', borderRadius: '8px', cursor: 'pointer' }}
            >
              Close
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
};
