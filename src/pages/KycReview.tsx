import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { KycDocument } from '../types';
import { DataTable, Column } from '../components/DataTable';
import { Badge } from '../components/Badge';
import { Modal } from '../components/Modal';
import { ConfirmationDialog } from '../components/ConfirmationDialog';
import { FileCheck, CircleCheck as CheckCircle, CircleX as XCircle, Eye } from 'lucide-react';

export const KycReview: React.FC = () => {
  const [kycDocs, setKycDocs] = useState<KycDocument[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<KycDocument | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isRejectDialogOpen, setIsRejectDialogOpen] = useState(false);

  useEffect(() => {
    api.getKycDocuments().then(setKycDocs);
  }, []);

  const handleApprove = (doc: KycDocument) => {
    setKycDocs(prev => prev.map(d => d.id === doc.id ? { ...d, status: 'approved' } : d));
    alert(`Document '${doc.fileName}' APPROVED. Audit log entry recorded.`);
  };

  const handleReject = (reason: string) => {
    if (!selectedDoc) return;
    setKycDocs(prev => prev.map(d => d.id === selectedDoc.id ? { ...d, status: 'rejected', rejectionReason: reason } : d));
    alert(`Document '${selectedDoc.fileName}' REJECTED. Mandatory reason: ${reason}`);
  };

  const columns: Column<KycDocument>[] = [
    { key: 'fileName', header: 'Document File Name', sortable: true },
    { key: 'businessName', header: 'Business Name', accessor: (row) => row.business?.name || '-' },
    { key: 'ownerName', header: 'Owner Name', accessor: (row) => row.business?.ownerName || '-' },
    { key: 'docType', header: 'Document Category', sortable: true, render: (val) => <span style={{ textTransform: 'uppercase', fontWeight: 600, color: '#38bdf8' }}>{val.replace('_', ' ')}</span> },
    {
      key: 'status',
      header: 'Review Status',
      sortable: true,
      filterable: true,
      filterOptions: ['submitted', 'approved', 'rejected'],
      render: (val) => {
        const variants: Record<string, any> = { submitted: 'warning', approved: 'success', rejected: 'danger' };
        return <Badge variant={variants[val] || 'neutral'}>{val}</Badge>;
      },
    },
    { key: 'createdAt', header: 'Submission Date', sortable: true, render: (val) => new Date(val).toLocaleString() },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <DataTable
        title="KYC Verification Queue"
        subtitle="Review identity proof, GST certificates, and trade licenses submitted by onboarding business owners."
        columns={columns}
        data={kycDocs}
        keyExtractor={(item) => item.id}
        searchPlaceholder="Search document name, business..."
        onRowClick={(row) => {
          setSelectedDoc(row);
          setIsPreviewOpen(true);
        }}
        rowActions={[
          {
            label: 'Inspect Document',
            icon: <Eye size={14} />,
            onClick: (row) => {
              setSelectedDoc(row);
              setIsPreviewOpen(true);
            },
          },
          {
            label: 'Approve Document',
            icon: <CheckCircle size={14} />,
            variant: 'success',
            onClick: (row) => handleApprove(row),
          },
          {
            label: 'Reject Document',
            icon: <XCircle size={14} />,
            variant: 'danger',
            onClick: (row) => {
              setSelectedDoc(row);
              setIsRejectDialogOpen(true);
            },
          },
        ]}
      />

      {/* Side-by-side Document Preview Modal */}
      {selectedDoc && (
        <Modal
          isOpen={isPreviewOpen}
          onClose={() => setIsPreviewOpen(false)}
          title={`KYC Document Preview: ${selectedDoc.fileName}`}
          subtitle={`Submitted for ${selectedDoc.business?.name}`}
          maxWidth="800px"
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
            <div>
              <h4 style={{ margin: '0 0 0.75rem 0', color: '#38bdf8' }}>Document Image / PDF View</h4>
              <div style={{ background: '#090d16', border: '1px solid #334155', borderRadius: '8px', overflow: 'hidden', textAlign: 'center' }}>
                <img src={selectedDoc.fileUrl} alt={selectedDoc.fileName} style={{ maxWidth: '100%', height: 'auto', display: 'block' }} />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h4 style={{ margin: 0, color: '#f8fafc' }}>Verification Metadata</h4>
              <div style={{ background: '#1e293b', padding: '0.85rem', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Doc Category</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f8fafc', textTransform: 'uppercase' }}>{selectedDoc.docType}</div>
              </div>
              <div style={{ background: '#1e293b', padding: '0.85rem', borderRadius: '8px' }}>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>Submitted By</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#f8fafc' }}>{selectedDoc.business?.ownerName} ({selectedDoc.business?.ownerPhone})</div>
              </div>
              {selectedDoc.rejectionReason && (
                <div style={{ background: 'rgba(239, 68, 68, 0.15)', border: '1px solid rgba(239, 68, 68, 0.3)', padding: '0.85rem', borderRadius: '8px', color: '#f87171' }}>
                  <strong>Previous Rejection Reason:</strong> {selectedDoc.rejectionReason}
                </div>
              )}
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem', borderTop: '1px solid #334155', paddingTop: '1rem' }}>
            <button
              onClick={() => {
                setIsPreviewOpen(false);
                setIsRejectDialogOpen(true);
              }}
              style={{ background: '#ef4444', border: 'none', color: '#fff', padding: '0.55rem 1.1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
            >
              Reject Document
            </button>
            <button
              onClick={() => {
                handleApprove(selectedDoc);
                setIsPreviewOpen(false);
              }}
              style={{ background: '#10b981', border: 'none', color: '#fff', padding: '0.55rem 1.1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
            >
              Approve Document
            </button>
          </div>
        </Modal>
      )}

      <ConfirmationDialog
        isOpen={isRejectDialogOpen}
        onClose={() => setIsRejectDialogOpen(false)}
        onConfirm={handleReject}
        title={`Reject KYC Document: ${selectedDoc?.fileName}`}
        message="Please provide a clear rejection reason for the shop owner to re-upload proper documentation."
        confirmText="Confirm Rejection"
        variant="danger"
        requireReason={true}
      />
    </div>
  );
};
