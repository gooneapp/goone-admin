import React, { useState } from 'react';
import { Database, Plus, MapPin, Percent, Truck } from 'lucide-react';
import { Tabs } from '../components/Tabs';
import { DataTable, Column } from '../components/DataTable';
import { Badge } from '../components/Badge';

export const MasterData: React.FC = () => {
  const [activeTab, setActiveTab] = useState('cities');

  const citiesData = [
    { id: '1', name: 'Madurai', state: 'Tamil Nadu', tier: 'Tier 2', active: true, pincodesCount: 42 },
    { id: '2', name: 'Coimbatore', state: 'Tamil Nadu', tier: 'Tier 2', active: true, pincodesCount: 58 },
    { id: '3', name: 'Chennai', state: 'Tamil Nadu', tier: 'Metro', active: true, pincodesCount: 120 },
    { id: '4', name: 'Trichy', state: 'Tamil Nadu', tier: 'Tier 2', active: true, pincodesCount: 34 },
    { id: '5', name: 'Salem', state: 'Tamil Nadu', tier: 'Tier 3', active: true, pincodesCount: 28 },
  ];

  const gstData = [
    { id: '1', hsnCode: '0401', description: 'Fresh Milk & Dairy', ratePercent: 0, category: 'Milk & Water' },
    { id: '2', hsnCode: '1001', description: 'Grains & Food Staples', ratePercent: 5, category: 'Grocery' },
    { id: '3', hsnCode: '3004', description: 'Essential Medicines', ratePercent: 12, category: 'Medical' },
    { id: '4', hsnCode: '2106', description: 'Restaurant Food Serving', ratePercent: 5, category: 'Hospitality' },
  ];

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

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <Tabs
        tabs={[
          { id: 'cities', label: 'Serviceable Cities & Pincodes', count: citiesData.length, icon: <MapPin size={16} /> },
          { id: 'gst', label: 'GST Tax Slabs & HSN Codes', count: gstData.length, icon: <Percent size={16} /> },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === 'cities' ? (
        <DataTable
          title="Master Cities & Regional Zones"
          subtitle="Manage operating cities, delivery radius constraints, and pincode mapping."
          columns={cityColumns}
          data={citiesData}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <DataTable
          title="Master GST Tax Rates & HSN Codes"
          subtitle="Tax slab rules for invoice computation across retail, pharmacy, and food billing."
          columns={gstColumns}
          data={gstData}
          keyExtractor={(item) => item.id}
        />
      )}
    </div>
  );
};
