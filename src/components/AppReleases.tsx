import React, { useCallback, useEffect, useState } from 'react';
import { ExternalLink } from 'lucide-react';
import { FileUpload } from './FileUpload';
import { api } from '../api/client';

const APP_TYPES = ['customer', 'business', 'partner'] as const;
type AppType = (typeof APP_TYPES)[number];

interface ReleaseInfo {
  url: string;
  updatedAt?: string;
}

/** Resolves a stored config value to something a browser can open. */
function toAbsoluteUrl(value: string): string {
  if (/^https?:\/\//i.test(value)) return value;
  const origin = import.meta.env.VITE_API_URL
    ? new URL(import.meta.env.VITE_API_URL).origin
    : 'http://localhost:4000';
  return `${origin}${value.startsWith('/') ? '' : '/'}${value}`;
}

export const AppReleases: React.FC = () => {
  const [releases, setReleases] = useState<Partial<Record<AppType, ReleaseInfo>>>({});

  // Shows which build is actually live. Previously there was no way to tell from
  // this page what had been published, or when.
  const loadReleases = useCallback(async () => {
    try {
      const configs = await api.getWebsiteConfigs();
      const rows: any[] = Array.isArray(configs) ? configs : (configs?.data ?? []);
      const next: Partial<Record<AppType, ReleaseInfo>> = {};

      for (const type of APP_TYPES) {
        const key = `WEBSITE_${type.toUpperCase()}_APP_APK`;
        const row = rows.find((r) => r?.key === key || r?.configKey === key);
        const value = row?.value ?? row?.configValue;
        if (value) next[type] = { url: value, updatedAt: row?.updatedAt };
      }
      setReleases(next);
    } catch {
      // Non-fatal: the uploader still works without the "currently live" panel.
    }
  }, []);

  useEffect(() => {
    void loadReleases();
  }, [loadReleases]);

  return (
    <div style={{ background: '#0f172a', borderRadius: '12px', padding: '1.5rem', border: '1px solid #1e293b' }}>
      <h2 style={{ margin: '0 0 0.5rem', color: '#f8fafc' }}>App Release Management</h2>
      <p style={{ color: '#94a3b8', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
        Upload the latest Android .APK packages for the GoOne Mobile Application Suite.
        Publishing here immediately updates the download links on the public website.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
        {APP_TYPES.map((type) => {
          const live = releases[type];
          return (
            <div
              key={type}
              style={{ background: '#1e293b', padding: '1.25rem', borderRadius: '10px', border: '1px solid #334155', display: 'flex', flexDirection: 'column', gap: '1rem' }}
            >
              <h3 style={{ margin: 0, textTransform: 'capitalize', color: '#38bdf8', fontSize: '1.1rem', fontWeight: 700 }}>
                {type} Application (.APK)
              </h3>

              {live ? (
                <a
                  href={toAbsoluteUrl(live.url)}
                  target="_blank"
                  rel="noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.75rem', color: '#38bdf8', textDecoration: 'none' }}
                >
                  <ExternalLink size={12} /> Download the currently live build
                </a>
              ) : (
                <span style={{ fontSize: '0.75rem', color: '#f59e0b' }}>
                  No build published yet — the website shows &ldquo;Coming Soon&rdquo;.
                </span>
              )}

              <FileUpload
                label={`Upload ${type.toUpperCase()} App APK`}
                accept=".apk"
                maxSizeMb={100}
                uploadType="apk"
                appType={type}
                {...(live
                  ? {
                      currentMeta: {
                        name: live.url.split('/').pop() ?? undefined,
                        uploadedAt: live.updatedAt,
                      },
                    }
                  : {})}
                onUploadSuccess={() => void loadReleases()}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
};
