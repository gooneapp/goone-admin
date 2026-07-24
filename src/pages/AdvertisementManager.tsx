import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { Advertisement } from '../types';
import { DataTable, Column, RowAction } from '../components/DataTable';
import { Badge } from '../components/Badge';
import { Edit, Trash, Plus } from 'lucide-react';
import { Modal } from '../components/Modal';
import { toast } from '../store/toastStore';

export const AdvertisementManager: React.FC = () => {
  const [ads, setAds] = useState<Advertisement[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAd, setEditingAd] = useState<Advertisement | null>(null);

  useEffect(() => {
    api.getAdvertisements().then(setAds);
  }, []);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingAd?.id) {
      setAds(ads.map(ad => ad.id === editingAd.id ? editingAd : ad));
      toast.success('Advertisement updated successfully');
    } else if (editingAd) {
      const newAd = { ...editingAd, id: `ad-${Date.now()}` };
      setAds([...ads, newAd]);
      toast.success('Advertisement created successfully');
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this advertisement?')) {
      setAds(ads.filter(ad => ad.id !== id));
      toast.success('Advertisement deleted');
    }
  };

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

  const rowActions: RowAction<Advertisement>[] = [
    {
      label: 'Edit Campaign',
      icon: <Edit size={15} />,
      onClick: (row) => { setEditingAd(row); setIsModalOpen(true); }
    },
    {
      label: 'Delete Campaign',
      icon: <Trash size={15} />,
      variant: 'danger',
      onClick: (row) => handleDelete(row.id)
    }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={() => { setEditingAd({ id: '', title: '', imageUrl: '', placement: 'home_banner', businessId: '', businessName: '', startDate: '', endDate: '', impressionsCount: 0, clicksCount: 0, active: true }); setIsModalOpen(true); }}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#38bdf8', color: '#0f172a', border: 'none', padding: '0.6rem 1rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
        >
          <Plus size={18} /> Create Campaign
        </button>
      </div>

      <DataTable
        title="Advertisements & Promotional Banners"
        subtitle="Manage home banner ad campaigns, targeted placement zones, and click-through analytics."
        columns={columns}
        data={ads}
        keyExtractor={(item) => item.id}
        rowActions={rowActions}
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingAd?.id ? 'Edit Campaign' : 'Create Campaign'}>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.875rem' }}>Title</label>
            <input required value={editingAd?.title || ''} onChange={(e) => setEditingAd(prev => prev ? { ...prev, title: e.target.value } : null)} style={{ width: '100%', padding: '0.6rem', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#f8fafc' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.875rem' }}>Image URL</label>
            <input required type="url" value={editingAd?.imageUrl || ''} onChange={(e) => setEditingAd(prev => prev ? { ...prev, imageUrl: e.target.value } : null)} style={{ width: '100%', padding: '0.6rem', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#f8fafc' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.875rem' }}>Placement</label>
            <select value={editingAd?.placement || 'home_banner'} onChange={(e) => setEditingAd(prev => prev ? { ...prev, placement: e.target.value as any } : null)} style={{ width: '100%', padding: '0.6rem', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#f8fafc' }}>
              <option value="home_banner">Home Banner</option>
              <option value="category_banner">Category Banner</option>
              <option value="search_result">Search Result</option>
            </select>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.875rem' }}>Start Date</label>
              <input type="date" required value={editingAd?.startDate || ''} onChange={(e) => setEditingAd(prev => prev ? { ...prev, startDate: e.target.value } : null)} style={{ width: '100%', padding: '0.6rem', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#f8fafc' }} />
            </div>
            <div style={{ flex: 1 }}>
              <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.875rem' }}>End Date</label>
              <input type="date" required value={editingAd?.endDate || ''} onChange={(e) => setEditingAd(prev => prev ? { ...prev, endDate: e.target.value } : null)} style={{ width: '100%', padding: '0.6rem', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#f8fafc' }} />
            </div>
          </div>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input type="checkbox" checked={editingAd?.active || false} onChange={(e) => setEditingAd(prev => prev ? { ...prev, active: e.target.checked } : null)} />
            Active
          </label>
          <button type="submit" style={{ marginTop: '1rem', background: '#38bdf8', color: '#0f172a', border: 'none', padding: '0.75rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
            Save Campaign
          </button>
        </form>
      </Modal>
    </div>
  );
};
