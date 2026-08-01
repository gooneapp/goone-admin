import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { toast } from '../store/toastStore';
import { useAuthStore } from '../store/authStore';
import { FeatureToggle, WebsiteConfig } from '../types';
import { DataTable, Column } from '../components/DataTable';
import { Badge } from '../components/Badge';
import { Tabs } from '../components/Tabs';
import { AppReleases } from '../components/AppReleases';
import { Settings, Sliders, Smartphone } from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState('toggles');
  const [toggles, setToggles] = useState<FeatureToggle[]>([]);
  const [configs, setConfigs] = useState<WebsiteConfig[]>([]);
  const isSuperAdmin = useAuthStore((s) => s.user?.role === 'super_admin');

  useEffect(() => {
    api.getFeatureToggles().then(setToggles);
    api.getWebsiteConfigs().then(setConfigs);
  }, []);

  const handleToggleFeature = async (row: FeatureToggle) => {
    if (!isSuperAdmin) {
      toast.error('Only Super Admins can change feature toggles.');
      return;
    }
    const nextValue = !row.isEnabled;
    try {
      await api.updateFeatureToggle(row.featureKey, nextValue);
      setToggles(prev => prev.map(t => t.id === row.id ? { ...t, isEnabled: nextValue } : t));
      toast.success(`${row.featureKey} ${nextValue ? 'enabled' : 'disabled'}.`);
    } catch {
      // Error toast already shown by the global API error interceptor.
    }
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
          onClick={() => handleToggleFeature(row)}
          disabled={!isSuperAdmin}
          title={isSuperAdmin ? undefined : 'Only Super Admins can change feature toggles'}
          style={{
            background: val ? '#10b981' : '#334155',
            border: 'none',
            color: '#fff',
            padding: '0.35rem 0.85rem',
            borderRadius: '20px',
            cursor: isSuperAdmin ? 'pointer' : 'not-allowed',
            opacity: isSuperAdmin ? 1 : 0.6,
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
          { id: 'releases', label: 'App Releases (APKs)', count: 3, icon: <Smartphone size={16} /> },
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
      ) : activeTab === 'configs' ? (
        <DataTable
          title="Runtime App Configuration Variables"
          subtitle="Configure ride minimum distances (Auto 5km / Car 15km), trial days, grace periods, and OTP timeouts."
          columns={configColumns}
          data={configs}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <AppReleases />
      )}
    </div>
  );
};
