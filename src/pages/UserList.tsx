import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { SystemUser, UserDefaultRole } from '../types';
import { DataTable, Column } from '../components/DataTable';
import { Badge } from '../components/Badge';
import { Modal } from '../components/Modal';
import { UserCheck } from 'lucide-react';

function exportUsersToCsv(rows: SystemUser[]) {
  const headers = ['Name', 'Phone', 'Account Scope', 'Language', 'Verified', 'Signup Date'];
  const csvRows = rows.map((u) =>
    [u.name, u.phoneNumber, u.roleDefault, u.preferredLanguage, u.isVerified ? 'Verified' : 'Unverified', u.createdAt]
      .map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`)
      .join(','),
  );
  const csvContent = `data:text/csv;charset=utf-8,${headers.join(',')}\n${csvRows.join('\n')}`;
  const link = document.createElement('a');
  link.setAttribute('href', encodeURI(csvContent));
  link.setAttribute('download', `selected_users_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

export const UserList: React.FC = () => {
  const [users, setUsers] = useState<SystemUser[]>([]);
  const [selectedUser, setSelectedUser] = useState<SystemUser | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    api.getUsers().then(setUsers);
  }, []);

  const columns: Column<SystemUser>[] = [
    { key: 'name', header: 'Full Name', sortable: true, render: (val) => val || '-' },
    { key: 'phoneNumber', header: 'Phone Number', sortable: true },
    {
      key: 'roleDefault',
      header: 'Account Scope',
      sortable: true,
      filterable: true,
      filterOptions: ['customer', 'business', 'delivery'],
      render: (val: UserDefaultRole) => {
        const variants: Record<UserDefaultRole, any> = {
          customer: 'info',
          business: 'purple',
          delivery: 'warning',
        };
        return <Badge variant={variants[val] || 'neutral'}>{val}</Badge>;
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
        searchPlaceholder="Search by name, phone..."
        searchFields={['name', 'phoneNumber', 'roleDefault']}
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
        ]}
        bulkActions={[
          {
            label: 'Export Selected Users',
            onClick: (rows) => exportUsersToCsv(rows),
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
              <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>User Account Persona</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#38bdf8', marginTop: '0.2rem', textTransform: 'capitalize' }}>
                {selectedUser.roleDefault}
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
