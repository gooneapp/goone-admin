import React, { useState } from 'react';
import { api } from '../api/client';
import { toast } from '../store/toastStore';
import { Upload } from 'lucide-react';

export const AppReleases: React.FC = () => {
  const [uploading, setUploading] = useState<string | null>(null);

  const handleFileChange = async (appType: 'customer' | 'business' | 'partner', e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.apk')) {
      toast.error('Only .apk files are allowed');
      return;
    }

    setUploading(appType);
    try {
      await api.uploadAppRelease(appType, file);
      toast.success(`${appType} app APK uploaded successfully!`);
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to upload APK');
    } finally {
      setUploading(null);
      // reset file input
      e.target.value = '';
    }
  };

  return (
    <div style={{ background: '#0f172a', borderRadius: '12px', padding: '1.5rem', border: '1px solid #1e293b' }}>
      <h2 style={{ margin: '0 0 0.5rem', color: '#f8fafc' }}>App Releases</h2>
      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
        Upload the latest .apk files for the GoOne mobile applications. These will immediately become available for download on the public website.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
        {['customer', 'business', 'partner'].map((type) => (
          <div key={type} style={{ background: '#1e293b', padding: '1.5rem', borderRadius: '8px', border: '1px dashed #334155', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
            <h3 style={{ margin: 0, textTransform: 'capitalize', color: '#38bdf8' }}>{type} App</h3>
            
            <label style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: uploading === type ? '#475569' : '#0ea5e9',
              color: '#fff',
              padding: '0.5rem 1rem',
              borderRadius: '6px',
              cursor: uploading === type ? 'not-allowed' : 'pointer',
              fontWeight: 600,
              fontSize: '0.9rem'
            }}>
              <Upload size={16} />
              {uploading === type ? 'Uploading...' : 'Upload .APK'}
              <input
                type="file"
                accept=".apk"
                style={{ display: 'none' }}
                disabled={uploading === type}
                onChange={(e) => handleFileChange(type as any, e)}
              />
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};
