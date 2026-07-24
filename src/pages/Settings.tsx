import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { FeatureToggle, WebsiteConfig } from '../types';
import { DataTable, Column } from '../components/DataTable';
import { Badge } from '../components/Badge';
import { Tabs } from '../components/Tabs';
import { Settings, Sliders, ShieldCheck } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('toggles');
  const [toggles, setToggles] = useState<FeatureToggle[]>([]);
  const [configs, setConfigs] = useState<WebsiteConfig[]>([]);

  useEffect(() => {
    api.getFeatureToggles().then(setToggles);
    api.getWebsiteConfigs().then(setConfigs);
  }, []);

  const handleToggleFeature = (id: string) => {
    setToggles(prev => prev.map(t => t.id === id ? { ...t, isEnabled: !t.isEnabled } : t));
  };

  const toggleColumns: Column<FeatureToggle>[] = [
    { key: 'featureKey', header: 'Feature Key Identifier', sortable: true, render: (val) => <span style={{ fontWeight: 600, color: '#38bdf8' }}>{val}</span> },
    { key: 'description', header: 'Description' },
    { key: 'scopeType', header: 'Scope', render: (val, row) => <Badge variant="purple">{val || 'Global'} {row.scopeValue ? `(${row.scopeValue})` : ''}</Badge> },
    {
      key: 'isEnabled',
      header: 'Toggle State',
      render: (val, row) => (
        <button
          onClick={() => handleToggleFeature(row.id)}
          style={{
            background: val ? '#10b981' : '#334155',
            border: 'none',
            color: '#fff',
            padding: '0.35rem 0.85rem',
            borderRadius: '20px',
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: '0.8rem',
          }}
        >
          {val ? 'ENABLED' : 'DISABLED'}
        </button>
      ),
    },
  ];

  const configColumns: Column<WebsiteConfig>[] = [
    { key: 'key', header: 'Configuration Key', sortable: true, render: (val) => <span style={{ fontWeight: 600, color: '#fbbf24' }}>{val}</span> },
    { key: 'value', header: 'Runtime Value', render: (val) => <span style={{ fontFamily: 'monospace', background: '#1e293b', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>{val}</span> },
    { key: 'category', header: 'Category', render: (val) => <Badge variant="info">{val}</Badge> },
    { key: 'description', header: 'Description' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <Tabs
        tabs={[
          { id: 'toggles', label: 'Regional & Category Feature Matrix', count: toggles.length, icon: <Sliders size={16} /> },
          { id: 'configs', label: 'System Configuration Variables', count: configs.length, icon: <Settings size={16} /> },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === 'toggles' ? (
        <DataTable
          title="Dynamic Feature Toggles"
          subtitle="Hot-reload feature flags globally or scoped by region/business type without deploying backend releases."
          columns={toggleColumns}
          data={toggles}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <DataTable
          title="Runtime App Configuration Variables"
          subtitle="Configure ride minimum distances (Auto 5km / Car 15km), trial days, grace periods, and OTP timeouts."
          columns={configColumns}
          data={configs}
          keyExtractor={(item) => item.id}
        />
      )}
    </div>
  );
};
