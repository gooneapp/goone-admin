import React, { useState } from 'react';
import { Modal } from './Modal';
import { TriangleAlert as AlertTriangle } from 'lucide-react';

export interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
  title: string;
  message: string;
  confirmText?: string;
  variant?: 'danger' | 'warning' | 'info';
  requireReason?: boolean;
}

export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm Action',
  variant = 'danger',
  requireReason = true,
}) => {
  const [reason, setReason] = useState('');
  const [error, setError] = useState('');

  const handleConfirm = () => {
    if (requireReason && !reason.trim()) {
      setError('A mandatory reason must be provided for audit logging.');
      return;
    }
    setError('');
    onConfirm(reason);
    setReason('');
    onClose();
  };

  const btnBg = variant === 'danger' ? '#ef4444' : variant === 'warning' ? '#f59e0b' : '#0284c7';

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
        <div style={{ background: `${btnBg}20`, padding: '0.65rem', borderRadius: '12px', display: 'flex' }}>
          <AlertTriangle color={btnBg} size={28} />
        </div>
        <div>
          <p style={{ margin: 0, color: '#e2e8f0', fontSize: '0.95rem', lineHeight: '1.5' }}>{message}</p>
        </div>
      </div>

      {requireReason && (
        <div style={{ marginBottom: '1.25rem' }}>
          <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 500, color: '#cbd5e1', marginBottom: '0.4rem' }}>
            Audit Reason <span style={{ color: '#ef4444' }}>*</span>
          </label>
          <textarea
            placeholder="State the rationale for this administrative action (recorded to Platform Audit Log)..."
            value={reason}
            onChange={(e) => { setReason(e.target.value); setError(''); }}
            rows={3}
            style={{
              width: '100%',
              padding: '0.65rem',
              background: '#0f172a',
              border: `1px solid ${error ? '#ef4444' : '#334155'}`,
              borderRadius: '8px',
              color: '#f8fafc',
              fontSize: '0.875rem',
              outline: 'none',
              resize: 'vertical',
            }}
          />
          {error && <span style={{ color: '#ef4444', fontSize: '0.775rem', marginTop: '0.3rem', display: 'block' }}>{error}</span>}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid #334155' }}>
        <button
          onClick={onClose}
          style={{ background: '#1e293b', border: '1px solid #334155', color: '#94a3b8', padding: '0.55rem 1.1rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 500 }}
        >
          Cancel
        </button>
        <button
          onClick={handleConfirm}
          style={{ background: btnBg, border: 'none', color: '#ffffff', padding: '0.55rem 1.1rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.875rem', fontWeight: 600 }}
        >
          {confirmText}
        </button>
      </div>
    </Modal>
  );
};
