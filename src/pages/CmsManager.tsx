import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { CmsContentItem } from '../types';
import { DataTable, Column } from '../components/DataTable';
import { Badge } from '../components/Badge';
import { Globe, Plus, FileText, Download, Upload } from 'lucide-react';

export const CmsManager: React.FC = () => {
  const [content, setContent] = useState<CmsContentItem[]>([]);

  useEffect(() => {
    api.getCmsContent().then(setContent);
  }, []);

  const columns: Column<CmsContentItem>[] = [
    { key: 'key', header: 'Content Translation Key', sortable: true, render: (val) => <span style={{ fontWeight: 600, color: '#38bdf8' }}>{val}</span> },
    { key: 'contentType', header: 'Type', render: (val) => <Badge variant="info">{val.replace('_', ' ')}</Badge> },
    { key: 'bodyEn', header: 'English (EN)', render: (val) => val || '-' },
    { key: 'bodyTa', header: 'Tamil (TA)', render: (val) => <span style={{ color: '#38bdf8' }}>{val || '-'}</span> },
    { key: 'bodyHi', header: 'Hindi (HI)', render: (val) => <span style={{ color: '#fbbf24' }}>{val || '-'}</span> },
    { key: 'published', header: 'Status', render: (val) => <Badge variant={val ? 'success' : 'neutral'}>{val ? 'Published' : 'Draft'}</Badge> },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <DataTable
        title="CMS & Multi-Language String Translations (TA, EN, HI)"
        subtitle="Manage dynamic help articles, in-app announcements, and externalized i18n language string resources (FR-12.8)."
        columns={columns}
        data={content}
        keyExtractor={(item) => item.id}
        searchPlaceholder="Search key, translation text..."
      />
    </div>
  );
};
