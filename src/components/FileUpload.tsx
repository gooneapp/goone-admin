import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Upload,
  FileText,
  Image as ImageIcon,
  CheckCircle,
  AlertCircle,
  RotateCcw,
  X,
  Trash2,
} from 'lucide-react';
import { api } from '../api/client';
import { toast } from '../store/toastStore';

interface FileUploadProps {
  label?: string;
  accept?: string;
  maxSizeMb?: number;
  uploadType?: 'image' | 'document' | 'apk';
  appType?: 'customer' | 'business' | 'partner';
  currentUrl?: string;
  /** Filename/size/date of what is already live, shown alongside the dropzone. */
  currentMeta?: { name?: string; sizeBytes?: number; uploadedAt?: string };
  onUploadSuccess?: (url: string, responseData?: any) => void;
  onUploadError?: (errorMsg: string) => void;
  onRemove?: () => void;
}

type Status = 'idle' | 'uploading' | 'success' | 'error';

const ENDPOINTS = {
  image: { url: '/admin/upload/image', field: 'file' },
  document: { url: '/admin/upload/document', field: 'file' },
  apk: { url: '', field: 'apk' },
} as const;

function formatBytes(bytes?: number): string {
  if (!bytes && bytes !== 0) return '';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

/**
 * Checks a file against the `accept` attribute.
 *
 * The browser applies `accept` to the file picker, but NOT to drag-and-drop — a
 * dropped file previously bypassed the filter entirely and only failed server-side.
 */
function matchesAccept(file: File, accept: string): boolean {
  if (!accept.trim()) return true;
  const name = file.name.toLowerCase();
  const type = file.type.toLowerCase();

  return accept.split(',').some((raw) => {
    const rule = raw.trim().toLowerCase();
    if (!rule) return false;
    if (rule.startsWith('.')) return name.endsWith(rule);
    if (rule.endsWith('/*')) return type.startsWith(rule.slice(0, -1));
    return type === rule;
  });
}

export const FileUpload: React.FC<FileUploadProps> = ({
  label = 'Upload File',
  accept = 'image/*',
  maxSizeMb = 10,
  uploadType = 'image',
  appType = 'customer',
  currentUrl,
  currentMeta,
  onUploadSuccess,
  onUploadError,
  onRemove,
}) => {
  const [status, setStatus] = useState<Status>('idle');
  const [progress, setProgress] = useState(0);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentUrl || null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);
  // Object URLs must be revoked or every preview leaks a blob for the tab's lifetime.
  const objectUrlRef = useRef<string | null>(null);

  const isUploading = status === 'uploading';

  const releaseObjectUrl = useCallback(() => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
      objectUrlRef.current = null;
    }
  }, []);

  useEffect(() => {
    return () => {
      releaseObjectUrl();
      abortRef.current?.abort();
    };
  }, [releaseObjectUrl]);

  useEffect(() => {
    if (currentUrl !== undefined) setPreviewUrl(currentUrl || null);
  }, [currentUrl]);

  const getFullUrl = (path?: string | null) => {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('blob:')) {
      return path;
    }
    const backendOrigin = import.meta.env.VITE_API_URL
      ? new URL(import.meta.env.VITE_API_URL).origin
      : 'http://localhost:4000';
    return `${backendOrigin}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  const upload = useCallback(
    async (file: File) => {
      setStatus('uploading');
      setProgress(0);
      setErrorMsg(null);

      if (file.type.startsWith('image/')) {
        releaseObjectUrl();
        const objectUrl = URL.createObjectURL(file);
        objectUrlRef.current = objectUrl;
        setPreviewUrl(objectUrl);
      }

      const controller = new AbortController();
      abortRef.current = controller;

      const target = ENDPOINTS[uploadType];
      const endpoint = uploadType === 'apk' ? `/admin/configs/app-releases/${appType}` : target.url;

      const formData = new FormData();
      formData.append(target.field, file);

      try {
        const data = await api.uploadFile(endpoint, formData, {
          signal: controller.signal,
          onProgress: setProgress,
        });

        const payload = data?.data ?? data;
        const uploadedUrl = payload?.url ?? payload?.config?.value;
        if (!uploadedUrl) throw new Error('Upload succeeded but the server returned no URL.');

        releaseObjectUrl();
        setPreviewUrl(uploadedUrl);
        setStatus('success');
        toast.success(`${file.name} uploaded successfully.`);
        onUploadSuccess?.(uploadedUrl, payload);
      } catch (err: any) {
        releaseObjectUrl();
        setPreviewUrl(currentUrl || null);

        if (err?.code === 'ERR_CANCELED' || controller.signal.aborted) {
          setStatus('idle');
          setSelectedFile(null);
          return;
        }

        const msg =
          err?.response?.data?.error?.message ??
          err?.response?.data?.message ??
          (err?.code === 'ECONNABORTED' ? 'The upload timed out. Please try again.' : null) ??
          err?.message ??
          'File upload failed.';

        setErrorMsg(msg);
        setStatus('error');
        onUploadError?.(msg);
      } finally {
        abortRef.current = null;
      }
    },
    [appType, currentUrl, onUploadError, onUploadSuccess, releaseObjectUrl, uploadType],
  );

  const handleFile = useCallback(
    (file: File) => {
      setSelectedFile(file);

      if (!matchesAccept(file, accept)) {
        const msg = `"${file.name}" is not an accepted file type (${accept}).`;
        setErrorMsg(msg);
        setStatus('error');
        onUploadError?.(msg);
        return;
      }

      if (file.size > maxSizeMb * 1024 * 1024) {
        const msg = `"${file.name}" is ${formatBytes(file.size)} — the maximum is ${maxSizeMb} MB.`;
        setErrorMsg(msg);
        setStatus('error');
        onUploadError?.(msg);
        return;
      }

      void upload(file);
    },
    [accept, maxSizeMb, onUploadError, upload],
  );

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') setDragActive(true);
    else if (e.type === 'dragleave') setDragActive(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (isUploading) return;
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const showImagePreview = previewUrl && uploadType === 'image' && status !== 'error';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
      {label && (
        <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1' }}>{label}</label>
      )}

      {/* What is currently live — previously there was no way to tell. */}
      {currentMeta && (currentMeta.name || currentMeta.uploadedAt) && status === 'idle' && (
        <div
          style={{
            fontSize: '0.75rem',
            color: '#94a3b8',
            background: '#0b1220',
            border: '1px solid #1e293b',
            borderRadius: '8px',
            padding: '0.5rem 0.65rem',
            display: 'flex',
            gap: '0.5rem',
            alignItems: 'center',
          }}
        >
          <CheckCircle size={13} color="#22c55e" />
          <span style={{ color: '#e2e8f0', fontWeight: 600 }}>
            {currentMeta.name || 'Current file'}
          </span>
          {currentMeta.sizeBytes ? <span>· {formatBytes(currentMeta.sizeBytes)}</span> : null}
          {currentMeta.uploadedAt ? (
            <span>· {new Date(currentMeta.uploadedAt).toLocaleDateString()}</span>
          ) : null}
        </div>
      )}

      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => !isUploading && fileInputRef.current?.click()}
        style={{
          border: `2px dashed ${
            status === 'error' ? '#ef4444' : dragActive ? '#38bdf8' : '#334155'
          }`,
          background: dragActive ? 'rgba(56, 189, 248, 0.08)' : '#0f172a',
          borderRadius: '12px',
          padding: '1.25rem',
          textAlign: 'center',
          cursor: isUploading ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s ease-in-out',
          position: 'relative',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '120px',
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          disabled={isUploading}
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFile(file);
            // Reset so re-picking the same file after a failure still fires onChange.
            e.target.value = '';
          }}
          style={{ display: 'none' }}
        />

        {showImagePreview ? (
          <div
            style={{
              position: 'relative',
              width: '100%',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <img
              src={getFullUrl(previewUrl)}
              alt="Preview"
              style={{
                maxHeight: '100px',
                maxWidth: '100%',
                borderRadius: '8px',
                objectFit: 'contain',
                marginBottom: '0.5rem',
                opacity: isUploading ? 0.5 : 1,
              }}
            />
            {!isUploading && (
              <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 500 }}>
                Click or drag to replace image
              </span>
            )}
          </div>
        ) : (
          <>
            <div
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '10px',
                background: '#1e293b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: status === 'error' ? '#ef4444' : status === 'success' ? '#22c55e' : '#38bdf8',
                marginBottom: '0.5rem',
              }}
            >
              {status === 'error' ? (
                <AlertCircle size={20} />
              ) : status === 'success' ? (
                <CheckCircle size={20} />
              ) : uploadType === 'image' ? (
                <ImageIcon size={20} />
              ) : uploadType === 'document' ? (
                <FileText size={20} />
              ) : (
                <Upload size={20} />
              )}
            </div>

            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f8fafc' }}>
              {isUploading
                ? `Uploading ${selectedFile?.name ?? 'file'}…`
                : status === 'success'
                ? `${selectedFile?.name ?? 'File'} uploaded`
                : 'Choose a file or drag & drop'}
            </div>

            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>
              {status === 'success' && selectedFile
                ? formatBytes(selectedFile.size)
                : `${accept.replace(/\/\*/g, '')} (Max ${maxSizeMb}MB)`}
            </div>
          </>
        )}

        {/* Progress bar — the old component showed only a static "Uploading file..." */}
        {isUploading && (
          <div style={{ width: '100%', marginTop: '0.75rem' }}>
            <div
              style={{
                height: '6px',
                background: '#1e293b',
                borderRadius: '999px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  height: '100%',
                  width: progress < 0 ? '100%' : `${progress}%`,
                  background: '#38bdf8',
                  borderRadius: '999px',
                  transition: 'width 0.15s linear',
                  opacity: progress < 0 ? 0.5 : 1,
                }}
              />
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginTop: '0.4rem',
              }}
            >
              <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
                {progress < 0 ? 'Uploading…' : `${progress}%`}
                {selectedFile ? ` of ${formatBytes(selectedFile.size)}` : ''}
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  abortRef.current?.abort();
                }}
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: '#f87171',
                  fontSize: '0.7rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.2rem',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                <X size={11} /> Cancel
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Inline error + retry — neither existed before; failures were toast-only. */}
      {status === 'error' && errorMsg && (
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '0.75rem',
            background: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.35)',
            borderRadius: '8px',
            padding: '0.55rem 0.7rem',
          }}
        >
          <span style={{ fontSize: '0.75rem', color: '#fca5a5', lineHeight: 1.45 }}>{errorMsg}</span>
          {selectedFile && (
            <button
              type="button"
              onClick={() => selectedFile && handleFile(selectedFile)}
              style={{
                background: 'transparent',
                border: '1px solid rgba(239, 68, 68, 0.4)',
                borderRadius: '6px',
                color: '#fca5a5',
                fontSize: '0.7rem',
                padding: '0.2rem 0.5rem',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem',
                cursor: 'pointer',
                whiteSpace: 'nowrap',
              }}
            >
              <RotateCcw size={11} /> Retry
            </button>
          )}
        </div>
      )}

      {onRemove && previewUrl && !isUploading && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            releaseObjectUrl();
            setPreviewUrl(null);
            setSelectedFile(null);
            setStatus('idle');
            setErrorMsg(null);
            onRemove();
          }}
          style={{
            alignSelf: 'flex-end',
            background: 'transparent',
            border: 'none',
            color: '#ef4444',
            fontSize: '0.75rem',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.25rem',
            cursor: 'pointer',
            marginTop: '0.2rem',
          }}
        >
          <Trash2 size={12} /> Remove file
        </button>
      )}
    </div>
  );
};
