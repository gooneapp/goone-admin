import React, { useState, useRef } from 'react';
import { Upload, FileText, Image as ImageIcon, CheckCircle, AlertCircle, Trash2 } from 'lucide-react';
import { apiClient } from '../api/client';
import { toast } from '../store/toastStore';

interface FileUploadProps {
  label?: string;
  accept?: string;
  maxSizeMb?: number;
  uploadType?: 'image' | 'document' | 'apk';
  appType?: 'customer' | 'business' | 'partner';
  currentUrl?: string;
  onUploadSuccess?: (url: string, responseData?: any) => void;
  onUploadError?: (errorMsg: string) => void;
  onRemove?: () => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  label = 'Upload File',
  accept = 'image/*',
  maxSizeMb = 10,
  uploadType = 'image',
  appType = 'customer',
  currentUrl,
  onUploadSuccess,
  onUploadError,
  onRemove,
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentUrl || null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFullUrl = (path?: string | null) => {
    if (!path) return '';
    if (path.startsWith('http://') || path.startsWith('https://')) return path;
    const backendOrigin = import.meta.env.VITE_API_URL 
      ? new URL(import.meta.env.VITE_API_URL).origin 
      : 'http://localhost:4000';
    return `${backendOrigin}${path.startsWith('/') ? '' : '/'}${path}`;
  };

  const handleFile = async (file: File) => {
    // Validate file size
    const maxBytes = maxSizeMb * 1024 * 1024;
    if (file.size > maxBytes) {
      const err = `File size exceeds the maximum limit of ${maxSizeMb}MB`;
      toast.error(err);
      onUploadError?.(err);
      return;
    }

    setIsUploading(true);
    setFileName(file.name);

    // Create local object URL for instant preview if it's an image
    if (file.type.startsWith('image/')) {
      setPreviewUrl(URL.createObjectURL(file));
    }

    try {
      const formData = new FormData();

      let endpoint = '/admin/upload/image';
      if (uploadType === 'document') {
        endpoint = '/admin/upload/document';
        formData.append('file', file);
      } else if (uploadType === 'apk') {
        endpoint = `/admin/configs/app-releases/${appType}`;
        formData.append('apk', file);
      } else {
        formData.append('file', file);
      }

      const res = await apiClient.post(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      const data = res.data?.data || res.data;
      const uploadedUrl = data?.url || data?.config?.value;

      if (!uploadedUrl) {
        throw new Error('Upload succeeded but no URL was returned by server');
      }

      setPreviewUrl(uploadedUrl);
      toast.success('File uploaded successfully!');
      onUploadSuccess?.(uploadedUrl, data);
    } catch (err: any) {
      const msg = err.response?.data?.error?.message || err.response?.data?.message || err.message || 'File upload failed';
      toast.error(msg);
      onUploadError?.(msg);
      setPreviewUrl(currentUrl || null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', width: '100%' }}>
      {label && (
        <label style={{ fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1' }}>
          {label}
        </label>
      )}

      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: `2px dashed ${dragActive ? '#38bdf8' : '#334155'}`,
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
            if (e.target.files && e.target.files[0]) {
              handleFile(e.target.files[0]);
            }
          }}
          style={{ display: 'none' }}
        />

        {previewUrl && uploadType === 'image' ? (
          <div style={{ position: 'relative', width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <img
              src={getFullUrl(previewUrl)}
              alt="Preview"
              style={{ maxHeight: '100px', maxWidth: '100%', borderRadius: '8px', objectFit: 'contain', marginBottom: '0.5rem' }}
            />
            <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 500 }}>Click or Drag to replace image</span>
          </div>
        ) : (
          <>
            <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#1e293b', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#38bdf8', marginBottom: '0.5rem' }}>
              {uploadType === 'image' ? <ImageIcon size={20} /> : <Upload size={20} />}
            </div>

            <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f8fafc' }}>
              {isUploading ? 'Uploading file...' : 'Choose a file or drag & drop'}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.2rem' }}>
              {accept.replace(/\/\*/g, '')} (Max {maxSizeMb}MB)
            </div>
          </>
        )}
      </div>

      {onRemove && previewUrl && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            setPreviewUrl(null);
            setFileName(null);
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
