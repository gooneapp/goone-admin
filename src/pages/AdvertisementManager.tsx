import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { Advertisement } from '../types';
import { DataTable, Column } from '../components/DataTable';
import { Badge } from '../components/Badge';
import { TriangleAlert as AlertTriangle } from 'lucide-react';

export const AdvertisementManager: React.FC = () => {
  const [ads, setAds] = useState<Advertisement[]>([]);

  useEffect(() => {
    api.getAdvertisements().then(setAds);
  }, []);

  const columns: Column<Advertisement>[] = [
    { key: 'title', header: 'Campaign Banner Title', sortable: true },
    { key: 'businessName', header: 'Promoted Merchant', accessor: (row) => row.businessName || 'Platform Promo' },
    {
      key: 'placement',
      header: 'Placement Zone',
      render: (val) => <Badge variant="purple">{val.replace('_', ' ').toUpperCase()}</Badge>,
    },
    { key: 'impressionsCount', header: 'Impressions', sortable: true, render: (val) => val?.toLocaleString() || '0' },
    { key: 'clicksCount', header: 'Clicks', sortable: true, render: (val) => val?.toLocaleString() || '0' },
    {
      key: 'ctr',
      header: 'Click-Through Rate (CTR)',
      accessor: (row) => `${(((row.clicksCount || 0) / (row.impressionsCount || 1)) * 100).toFixed(1)}%`,
      render: (val) => <span style={{ fontWeight: 700, color: '#34d399' }}>{val}</span>,
    },
    { key: 'active', header: 'Status', render: (val) => <Badge variant={val ? 'success' : 'neutral'}>{val ? 'Active' : 'Ended'}</Badge> },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.35)', borderRadius: '12px', padding: '1rem 1.25rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
        <AlertTriangle color="#f59e0b" size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
        <div style={{ fontSize: '0.85rem', color: '#fde68a', lineHeight: '1.5' }}>
          <strong>Campaign management isn't wired up yet.</strong> The backend only exposes a read-only advertisements listing — there's no create/update/delete endpoint yet, so this view is reporting-only for now.
        </div>
      </div>

      <DataTable
        title="Advertisements & Promotional Banners"
        subtitle="Read-only view of home banner ad campaigns, placement zones, and click-through analytics."
        columns={columns}
        data={ads}
        keyExtractor={(item) => item.id}
      />
    </div>
  );
};
