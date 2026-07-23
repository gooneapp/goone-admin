import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { Category } from '../types';
import { DataTable, Column } from '../components/DataTable';
import { Badge } from '../components/Badge';
import { Modal } from '../components/Modal';
import { Layers, Plus, Edit, CircleAlert as AlertCircle, Globe } from 'lucide-react';

export const CategoryManager: React.FC = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newCatNameEn, setNewCatNameEn] = useState('');
  const [newCatNameTa, setNewCatNameTa] = useState('');
  const [newCatNameHi, setNewCatNameHi] = useState('');
  const [extensionMod, setExtensionMod] = useState<'Hospitality' | 'Medical' | 'MilkWater' | 'Farmer' | 'ServiceProvider' | 'None'>('None');

  useEffect(() => {
    api.getCategories().then(setCategories);
  }, []);

  const handleCreateCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const created: Category = {
      id: `c-${Date.now()}`,
      name: newCatNameEn,
      slug: newCatNameEn.toLowerCase().replace(/\s+/g, '-'),
      appliesTo: 'business_type',
      extensionModule: extensionMod,
      active: true,
      nameTranslations: {
        en: newCatNameEn,
        ta: newCatNameTa,
        hi: newCatNameHi,
      },
    };
    setCategories(prev => [...prev, created]);
    setIsAddModalOpen(false);
    setNewCatNameEn('');
    setNewCatNameTa('');
    setNewCatNameHi('');
    alert(`Business Type & Category '${created.name}' created! Propagated instantly to mobile app onboardings.`);
  };

  const columns: Column<Category>[] = [
    { key: 'name', header: 'Business Type / Category (EN)', sortable: true },
    {
      key: 'nameTa',
      header: 'Tamil (TA)',
      accessor: (row) => row.nameTranslations?.ta || '-',
      render: (val) => <span style={{ color: '#38bdf8' }}>{val}</span>,
    },
    {
      key: 'nameHi',
      header: 'Hindi (HI)',
      accessor: (row) => row.nameTranslations?.hi || '-',
      render: (val) => <span style={{ color: '#fbbf24' }}>{val}</span>,
    },
    {
      key: 'extensionModule',
      header: 'Mapped UI Extension Module',
      sortable: true,
      render: (val) => (
        <Badge variant={val === 'None' ? 'neutral' : 'purple'}>
          {val === 'None' ? 'Core Shared Module' : `${val} UI Extension`}
        </Badge>
      ),
    },
    {
      key: 'active',
      header: 'Status',
      render: (val) => <Badge variant={val ? 'success' : 'neutral'}>{val ? 'Active' : 'Disabled'}</Badge>,
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Disclaimer Alert Card */}
      <div style={{ background: 'rgba(2, 132, 199, 0.1)', border: '1px solid rgba(56, 189, 248, 0.3)', padding: '1rem 1.25rem', borderRadius: '12px', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
        <AlertCircle color="#38bdf8" size={22} style={{ flexShrink: 0, marginTop: '2px' }} />
        <div style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: '1.5' }}>
          <strong style={{ color: '#38bdf8' }}>Business Type & Category Propagation Disclaimer (FR-12.5):</strong>
          <br />
          Creating a new business type makes it immediately selectable during Business App onboarding and visible in Customer App discovery without requiring an app store release. Mapping to an existing extension module (e.g. Medical batch expiry, Hotel KOT) applies pre-built UI flows immediately.
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={() => setIsAddModalOpen(true)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'linear-gradient(135deg, #0284c7, #38bdf8)', border: 'none', color: '#fff', padding: '0.6rem 1.2rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
        >
          <Plus size={16} /> Add New Business Type / Category
        </button>
      </div>

      <DataTable
        title="Master Categories & Business Types"
        subtitle="Manage multi-lingual business categories, subcategories, and extension module mappings."
        columns={columns}
        data={categories}
        keyExtractor={(item) => item.id}
        searchPlaceholder="Search categories, translations..."
      />

      {/* Add Category Modal */}
      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Create New Business Type / Category"
        subtitle="Set multi-lingual names in Tamil, English, and Hindi."
      >
        <form onSubmit={handleCreateCategory} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.3rem' }}>English Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Organic Produce & Grains"
              value={newCatNameEn}
              onChange={(e) => setNewCatNameEn(e.target.value)}
              style={{ width: '100%', padding: '0.6rem', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.3rem' }}>Tamil Name (தமிழ்)</label>
              <input
                type="text"
                placeholder="உதாரணம்: இயற்கை விவசாயம்"
                value={newCatNameTa}
                onChange={(e) => setNewCatNameTa(e.target.value)}
                style={{ width: '100%', padding: '0.6rem', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.3rem' }}>Hindi Name (हिंदी)</label>
              <input
                type="text"
                placeholder="उदा. जैविक उत्पाद"
                value={newCatNameHi}
                onChange={(e) => setNewCatNameHi(e.target.value)}
                style={{ width: '100%', padding: '0.6rem', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.3rem' }}>Mapped UI Extension Module</label>
            <select
              value={extensionMod}
              onChange={(e) => setExtensionMod(e.target.value as any)}
              style={{ width: '100%', padding: '0.6rem', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#38bdf8', fontWeight: 600 }}
            >
              <option value="None">None (Standard Core Retail & Billing)</option>
              <option value="Medical">Medical (Batch Number & Expiry Tracking)</option>
              <option value="Hospitality">Hospitality (Table Management & KOT Tickets)</option>
              <option value="MilkWater">MilkWater (Daily Recurring Delivery Routes)</option>
              <option value="Farmer">Farmer (Direct Produce & Voice Notes)</option>
              <option value="ServiceProvider">ServiceProvider (Time-Slot Booking Calendar)</option>
            </select>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', borderTop: '1px solid #334155', paddingTop: '1rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={() => setIsAddModalOpen(false)} style={{ background: '#1e293b', border: '1px solid #334155', color: '#cbd5e1', padding: '0.55rem 1rem', borderRadius: '8px', cursor: 'pointer' }}>Cancel</button>
            <button type="submit" style={{ background: 'linear-gradient(135deg, #0284c7, #38bdf8)', border: 'none', color: '#fff', padding: '0.55rem 1.1rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}>Create Category</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
