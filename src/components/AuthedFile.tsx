import React, { useEffect, useState } from 'react';
import { AlertCircle, Download, FileText, Loader2 } from 'lucide-react';
import { api } from '../api/client';

/**
 * Renders a private file served by GET /api/v1/files/:id.
 *
 * That endpoint requires an Authorization header, so `<img src=...>` cannot be used —
 * the browser will not attach the bearer token and the request 401s. The bytes are
 * fetched through the API client instead and shown from an object URL, which is
 * revoked on unmount so previews do not leak for the lifetime of the tab.
 */
interface AuthedFileProps {
  fileId: string;
  /** Used to pick the viewer before the blob's own type is known. */
  mimeType?: string | null;
  fileName?: string | null;
  maxHeight?: number;
  alt?: string;
}

export const AuthedFile: React.FC<AuthedFileProps> = ({
  fileId,
  mimeType,
  fileName,
  maxHeight = 420,
  alt = 'Document',
}) => {
  const [objectUrl, setObjectUrl] = useState<string | null>(null);
  const [resolvedType, setResolvedType] = useState<string | null>(mimeType ?? null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let url: string | null = null;
    let cancelled = false;
    const controller = new AbortController();

    setObjectUrl(null);
    setError(null);

    api
      .fetchFileBlob(fileId, controller.signal)
      .then((blob) => {
        if (cancelled) return;
        url = URL.createObjectURL(blob);
        setObjectUrl(url);
        if (blob.type) setResolvedType(blob.type);
      })
      .catch((err: any) => {
        if (cancelled || err?.code === 'ERR_CANCELED') return;
        setError(
          err?.response?.status === 403
            ? 'You do not have permission to view this document.'
            : err?.response?.status === 404
            ? 'This document is no longer available.'
            : 'Could not load this document.',
        );
      });

    return () => {
      cancelled = true;
      controller.abort();
      if (url) URL.revokeObjectURL(url);
    };
  }, [fileId]);

  if (error) {
    return (
      <div style={centeredBox}>
        <AlertCircle size={28} color="#ef4444" />
        <span style={{ color: '#fca5a5', fontSize: '0.85rem' }}>{error}</span>
      </div>
    );
  }

  if (!objectUrl) {
    return (
      <div style={centeredBox}>
        <Loader2 size={26} color="#38bdf8" style={{ animation: 'spin 1s linear infinite' }} />
        <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Loading document…</span>
      </div>
    );
  }

  const isPdf = resolvedType === 'application/pdf' || fileName?.toLowerCase().endsWith('.pdf');
  const isImage = resolvedType?.startsWith('image/');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', width: '100%' }}>
      {isPdf ? (
        // PDFs previously rendered as <img> and simply showed a broken image,
        // even though the backend has always accepted them for KYC.
        <object
          data={objectUrl}
          type="application/pdf"
          style={{ width: '100%', height: `${maxHeight}px`, borderRadius: '8px', border: '1px solid #1e293b' }}
        >
          <div style={centeredBox}>
            <FileText size={28} color="#38bdf8" />
            <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
              This browser cannot display PDFs inline.
            </span>
          </div>
        </object>
      ) : isImage ? (
        <img
          src={objectUrl}
          alt={alt}
          style={{
            width: '100%',
            maxHeight: `${maxHeight}px`,
            objectFit: 'contain',
            borderRadius: '8px',
            background: '#0b1220',
          }}
        />
      ) : (
        <div style={centeredBox}>
          <FileText size={28} color="#38bdf8" />
          <span style={{ color: '#94a3b8', fontSize: '0.8rem' }}>
            {fileName || 'File'} — preview not supported
          </span>
        </div>
      )}

      <a
        href={objectUrl}
        download={fileName || 'document'}
        style={{
          alignSelf: 'flex-start',
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.35rem',
          fontSize: '0.78rem',
          color: '#38bdf8',
          textDecoration: 'none',
          border: '1px solid #1e293b',
          borderRadius: '6px',
          padding: '0.3rem 0.6rem',
        }}
      >
        <Download size={13} /> Download
      </a>
    </div>
  );
};

const centeredBox: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '0.5rem',
  minHeight: '160px',
  background: '#0b1220',
  border: '1px solid #1e293b',
  borderRadius: '8px',
  padding: '1rem',
  textAlign: 'center',
};
