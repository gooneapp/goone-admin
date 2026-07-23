import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { Advertisement } from '../types';
import { DataTable, Column } from '../components/DataTable';
import { Badge } from '../components/Badge';
import { Image, Plus } from 'lucide-react';

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
    { key: 'impressionsCount', header: 'Impressions', sortable: true, render: (val) => val.toLocaleString() },
    { key: 'clicksCount', header: 'Clicks', sortable: true, render: (val) => val.toLocaleString() },
    {
      key: 'ctr',
      header: 'Click-Through Rate (CTR)',
      accessor: (row) => `${((row.clicksCount / (row.impressionsCount || 1)) * 100).toFixed(1)}%`,
      render: (val) => <span style={{ fontWeight: 700, color: '#34d399' }}>{val}</span>,
    },
    { key: 'active', header: 'Status', render: (val) => <Badge variant={val ? 'success' : 'neutral'}>{val ? 'Active' : 'Ended'}</Badge> },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <DataTable
        title="Advertisements & Promotional Banners"
        subtitle="Manage home banner ad campaigns, targeted placement zones, and click-through analytics."
        columns={columns}
        data={ads}
        keyExtractor={(item) => item.id}
      />
    </div>
  );
};
