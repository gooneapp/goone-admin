import React, { useState } from 'react';
import { Plus, MapPin, Percent, Edit, Trash, TriangleAlert as AlertTriangle } from 'lucide-react';
import { Tabs } from '../components/Tabs';
import { DataTable, Column, RowAction } from '../components/DataTable';
import { Badge } from '../components/Badge';
import { Modal } from '../components/Modal';
import { toast } from '../store/toastStore';

export const MasterData: React.FC = () => {
  const [activeTab, setActiveTab] = useState('cities');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);

  const [citiesData, setCitiesData] = useState([
    { id: '1', name: 'Madurai', state: 'Tamil Nadu', tier: 'Tier 2', active: true, pincodesCount: 42 },
    { id: '2', name: 'Coimbatore', state: 'Tamil Nadu', tier: 'Tier 2', active: true, pincodesCount: 58 },
    { id: '3', name: 'Chennai', state: 'Tamil Nadu', tier: 'Metro', active: true, pincodesCount: 120 },
    { id: '4', name: 'Trichy', state: 'Tamil Nadu', tier: 'Tier 2', active: true, pincodesCount: 34 },
    { id: '5', name: 'Salem', state: 'Tamil Nadu', tier: 'Tier 3', active: true, pincodesCount: 28 },
  ]);

  const [gstData, setGstData] = useState([
    { id: '1', hsnCode: '0401', description: 'Fresh Milk & Dairy', ratePercent: 0, category: 'Milk & Water' },
    { id: '2', hsnCode: '1001', description: 'Grains & Food Staples', ratePercent: 5, category: 'Grocery' },
    { id: '3', hsnCode: '3004', description: 'Essential Medicines', ratePercent: 12, category: 'Medical' },
    { id: '4', hsnCode: '2106', description: 'Restaurant Food Serving', ratePercent: 5, category: 'Hospitality' },
  ]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'cities') {
      if (editingItem.id) {
        setCitiesData(citiesData.map(c => c.id === editingItem.id ? editingItem : c));
      } else {
        setCitiesData([...citiesData, { ...editingItem, id: `city-${Date.now()}` }]);
      }
    } else {
      if (editingItem.id) {
        setGstData(gstData.map(g => g.id === editingItem.id ? editingItem : g));
      } else {
        setGstData([...gstData, { ...editingItem, id: `gst-${Date.now()}` }]);
      }
    }
    toast.info('Saved in this browser tab only — no backend endpoint exists yet, so this will not persist after refresh.');
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to remove this record? (This only affects this browser tab — nothing is deleted server-side.)')) {
      if (activeTab === 'cities') {
        setCitiesData(citiesData.filter(c => c.id !== id));
      } else {
        setGstData(gstData.filter(g => g.id !== id));
      }
    }
  };

  const cityColumns: Column<any>[] = [
    { key: 'name', header: 'City Name', sortable: true },
    { key: 'state', header: 'State' },
    { key: 'tier', header: 'Classification', render: (val) => <Badge variant="info">{val}</Badge> },
    { key: 'pincodesCount', header: 'Serviceable Pincodes', render: (val) => `${val} pincodes` },
    { key: 'active', header: 'Status', render: (val) => <Badge variant={val ? 'success' : 'neutral'}>{val ? 'Active' : 'Disabled'}</Badge> },
  ];

  const gstColumns: Column<any>[] = [
    { key: 'hsnCode', header: 'HSN / SAC Code', sortable: true, render: (val) => <span style={{ fontWeight: 600, color: '#38bdf8' }}>{val}</span> },
    { key: 'description', header: 'Item Description' },
    { key: 'category', header: 'Category' },
    { key: 'ratePercent', header: 'GST Tax Rate', sortable: true, render: (val) => <Badge variant="purple">{val}% GST</Badge> },
  ];

  const rowActions: RowAction<any>[] = [
    { label: 'Edit Record', icon: <Edit size={15} />, onClick: (row) => { setEditingItem(row); setIsModalOpen(true); } },
    { label: 'Delete Record', icon: <Trash size={15} />, variant: 'danger', onClick: (row) => handleDelete(row.id) }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.35)', borderRadius: '12px', padding: '1rem 1.25rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
        <AlertTriangle color="#f59e0b" size={20} style={{ flexShrink: 0, marginTop: '2px' }} />
        <div style={{ fontSize: '0.85rem', color: '#fde68a', lineHeight: '1.5' }}>
          <strong>No backend endpoint exists for cities/GST slabs yet.</strong> Edits below only change what you see in this browser tab and are lost on refresh — they are not saved to the database.
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Tabs
          tabs={[
            { id: 'cities', label: 'Serviceable Cities', count: citiesData.length, icon: <MapPin size={16} /> },
            { id: 'gst', label: 'GST Tax Slabs', count: gstData.length, icon: <Percent size={16} /> },
          ]}
          activeTab={activeTab}
          onChange={setActiveTab}
        />
        <button
          onClick={() => { 
            setEditingItem(activeTab === 'cities' ? { id: '', name: '', state: 'Tamil Nadu', tier: 'Tier 2', active: true, pincodesCount: 0 } : { id: '', hsnCode: '', description: '', ratePercent: 5, category: 'Grocery' });
            setIsModalOpen(true);
          }}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#38bdf8', color: '#0f172a', border: 'none', padding: '0.6rem 1rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
        >
          <Plus size={18} /> Add {activeTab === 'cities' ? 'City' : 'GST Slab'}
        </button>
      </div>

      {activeTab === 'cities' ? (
        <DataTable
          title="Master Cities & Regional Zones"
          subtitle="Manage operating cities, delivery radius constraints, and pincode mapping."
          columns={cityColumns}
          data={citiesData}
          keyExtractor={(item) => item.id}
          rowActions={rowActions}
        />
      ) : (
        <DataTable
          title="Master GST Tax Rates & HSN Codes"
          subtitle="Tax slab rules for invoice computation across retail, pharmacy, and food billing."
          columns={gstColumns}
          data={gstData}
          keyExtractor={(item) => item.id}
          rowActions={rowActions}
        />
      )}

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingItem?.id ? `Edit ${activeTab === 'cities' ? 'City' : 'GST Slab'}` : `Add ${activeTab === 'cities' ? 'City' : 'GST Slab'}`}>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {activeTab === 'cities' ? (
            <>
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.875rem' }}>City Name</label>
                <input required value={editingItem?.name || ''} onChange={(e) => setEditingItem(prev => ({ ...prev, name: e.target.value }))} style={{ width: '100%', padding: '0.6rem', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#f8fafc' }} />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.875rem' }}>State</label>
                  <input required value={editingItem?.state || ''} onChange={(e) => setEditingItem(prev => ({ ...prev, state: e.target.value }))} style={{ width: '100%', padding: '0.6rem', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#f8fafc' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.875rem' }}>Tier</label>
                  <select value={editingItem?.tier || 'Tier 2'} onChange={(e) => setEditingItem(prev => ({ ...prev, tier: e.target.value }))} style={{ width: '100%', padding: '0.6rem', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#f8fafc' }}>
                    <option value="Metro">Metro</option>
                    <option value="Tier 2">Tier 2</option>
                    <option value="Tier 3">Tier 3</option>
                  </select>
                </div>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.875rem' }}>Serviceable Pincodes Count</label>
                <input type="number" required value={editingItem?.pincodesCount || 0} onChange={(e) => setEditingItem(prev => ({ ...prev, pincodesCount: parseInt(e.target.value) }))} style={{ width: '100%', padding: '0.6rem', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#f8fafc' }} />
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={editingItem?.active || false} onChange={(e) => setEditingItem(prev => ({ ...prev, active: e.target.checked }))} />
                Active
              </label>
            </>
          ) : (
            <>
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.875rem' }}>HSN Code</label>
                <input required value={editingItem?.hsnCode || ''} onChange={(e) => setEditingItem(prev => ({ ...prev, hsnCode: e.target.value }))} style={{ width: '100%', padding: '0.6rem', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#f8fafc' }} />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.875rem' }}>Description</label>
                <input required value={editingItem?.description || ''} onChange={(e) => setEditingItem(prev => ({ ...prev, description: e.target.value }))} style={{ width: '100%', padding: '0.6rem', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#f8fafc' }} />
              </div>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.875rem' }}>Rate Percent (%)</label>
                  <input type="number" required value={editingItem?.ratePercent || 0} onChange={(e) => setEditingItem(prev => ({ ...prev, ratePercent: parseFloat(e.target.value) }))} style={{ width: '100%', padding: '0.6rem', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#f8fafc' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.875rem' }}>Category</label>
                  <input required value={editingItem?.category || ''} onChange={(e) => setEditingItem(prev => ({ ...prev, category: e.target.value }))} style={{ width: '100%', padding: '0.6rem', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#f8fafc' }} />
                </div>
              </div>
            </>
          )}
          <button type="submit" style={{ marginTop: '1rem', background: '#38bdf8', color: '#0f172a', border: 'none', padding: '0.75rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}>
            Save {activeTab === 'cities' ? 'City' : 'GST Slab'}
          </button>
        </form>
      </Modal>
    </div>
  );
};
