import React from 'react';
import { useToastStore } from '../store/toastStore';
import { CheckCircle2, XCircle, Info, X } from 'lucide-react';

export function ToastContainer() {
  const { toasts, removeToast } = useToastStore();

  return (
    <div style={{
      position: 'fixed',
      top: '1rem',
      right: '1rem',
      zIndex: 9999,
      display: 'flex',
      flexDirection: 'column',
      gap: '0.5rem',
      pointerEvents: 'none'
    }}>
      {toasts.map((toast) => (
        <div
          key={toast.id}
          style={{
            background: '#1e293b',
            color: '#f8fafc',
            padding: '1rem',
            borderRadius: '0.5rem',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            gap: '0.75rem',
            pointerEvents: 'auto',
            borderLeft: `4px solid ${
              toast.type === 'success' ? '#22c55e' : toast.type === 'error' ? '#ef4444' : '#3b82f6'
            }`,
            minWidth: '300px'
          }}
        >
          {toast.type === 'success' && <CheckCircle2 color="#22c55e" size={20} />}
          {toast.type === 'error' && <XCircle color="#ef4444" size={20} />}
          {toast.type === 'info' && <Info color="#3b82f6" size={20} />}
          
          <span style={{ flex: 1, fontSize: '0.875rem', fontWeight: 500 }}>
            {toast.message}
          </span>
          
          <button
            onClick={() => removeToast(toast.id)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#94a3b8',
              cursor: 'pointer',
              display: 'flex',
              padding: '0.25rem'
            }}
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  );
}
