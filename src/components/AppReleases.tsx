import React from 'react';
import { FileUpload } from './FileUpload';

export const AppReleases: React.FC = () => {
  return (
    <div style={{ background: '#0f172a', borderRadius: '12px', padding: '1.5rem', border: '1px solid #1e293b' }}>
      <h2 style={{ margin: '0 0 0.5rem', color: '#f8fafc' }}>App Release Management</h2>
      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
        Upload the latest Android .APK packages for the GoOne Mobile Application Suite. Files are stored securely and made available for public download.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {(['customer', 'business', 'partner'] as const).map((type) => (
          <div key={type} style={{ background: '#1e293b', padding: '1.25rem', borderRadius: '10px', border: '1px solid #334155', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <h3 style={{ margin: 0, textTransform: 'capitalize', color: '#38bdf8', fontSize: '1.1rem', fontWeight: 700 }}>
              {type} Application (.APK)
            </h3>
            
            <FileUpload
              label={`Upload ${type.toUpperCase()} App APK`}
              accept=".apk"
              maxSizeMb={100}
              uploadType="apk"
              appType={type}
            />
          </div>
        ))}
      </div>
    </div>
  );
};
