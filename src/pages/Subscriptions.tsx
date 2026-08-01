import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { toast } from '../store/toastStore';
import { Subscription, SubscriptionPlan, SubscriptionStatus } from '../types';
import { DataTable, Column } from '../components/DataTable';
import { Badge } from '../components/Badge';
import { Modal } from '../components/Modal';
import { ConfirmationDialog } from '../components/ConfirmationDialog';
import { Tabs } from '../components/Tabs';
import { CreditCard, Edit, Plus, TriangleAlert as AlertTriangle, ShieldCheck } from 'lucide-react';

export const Subscriptions: React.FC = () => {
  const [activeTab, setActiveTab] = useState('subscriptions');
  const [subs, setSubs] = useState<Subscription[]>([]);
  const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
  const [selectedSub, setSelectedSub] = useState<Subscription | null>(null);
  const [isOverrideOpen, setIsOverrideOpen] = useState(false);

  useEffect(() => {
    api.getSubscriptions().then(setSubs);
    api.getSubscriptionPlans().then(setPlans);
  }, []);

  const handleOverride = async (reason: string) => {
    if (!selectedSub) return;
    try {
      await api.overrideSubscription(selectedSub.businessId, {
        plan_id: selectedSub.planId,
        reason,
        extend_days: 30,
      });
      setSubs(prev => prev.map(s => s.id === selectedSub.id ? { ...s, status: 'active' as SubscriptionStatus } : s));
      toast.success(`Subscription for ${selectedSub.business?.name} manually extended. Reason: ${reason}`);
    } catch {
      // Error toast already shown by the global API error interceptor.
    }
  };

  const subColumns: Column<Subscription>[] = [
    { key: 'business', header: 'Shop Business', accessor: (row) => row.business?.name || '-' },
    { key: 'owner', header: 'Owner Name', accessor: (row) => `${row.business?.owner?.name || '-'} (${row.business?.owner?.phoneNumber || '-'})` },
    { key: 'plan', header: 'Subscribed Tier', accessor: (row) => row.plan?.name || '-', render: (val) => <span style={{ fontWeight: 600, color: '#38bdf8' }}>{val}</span> },
    {
      key: 'status',
      header: 'Billing Status',
      sortable: true,
      filterable: true,
      filterOptions: ['trial', 'active', 'grace', 'locked'],
      render: (val: SubscriptionStatus) => {
        const map: Record<SubscriptionStatus, any> = { trial: 'info', active: 'success', grace: 'warning', locked: 'danger' };
        return <Badge variant={map[val] || 'neutral'}>{val.toUpperCase()}</Badge>;
      },
    },
    { key: 'endDate', header: 'Expiry Date', sortable: true, render: (val) => new Date(val).toLocaleDateString() },
    { key: 'paymentRef', header: 'Payment Ref', render: (val) => val || '-' },
  ];

  const planColumns: Column<SubscriptionPlan>[] = [
    { key: 'name', header: 'Plan Name', sortable: true },
    { key: 'description', header: 'Description', render: (val) => val || '-' },
    { key: 'priceMonthly', header: 'Monthly Fee (₹)', render: (val) => `₹${val}` },
    {
      key: 'features',
      header: 'Included Features',
      render: (val: Record<string, boolean>) => (
        <div style={{ display: 'flex', gap: '0.3rem', flexWrap: 'wrap' }}>
          {Object.entries(val || {})
            .filter(([, enabled]) => enabled)
            .map(([feature]) => (
              <span key={feature} style={{ background: '#1e293b', padding: '0.15rem 0.45rem', borderRadius: '4px', fontSize: '0.75rem', color: '#cbd5e1' }}>{feature.replace(/_/g, ' ')}</span>
            ))}
        </div>
      ),
    },
    { key: 'isActive', header: 'Status', render: (val) => <Badge variant={val ? 'success' : 'neutral'}>{val ? 'Active' : 'Inactive'}</Badge> },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <Tabs
        tabs={[
          { id: 'subscriptions', label: 'Active Business Subscriptions', count: subs.length, icon: <CreditCard size={16} /> },
          { id: 'plans', label: 'Subscription Plan Tiers', count: plans.length, icon: <Edit size={16} /> },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === 'subscriptions' ? (
        <DataTable
          title="SaaS Subscriptions & Billing Status"
          subtitle="Monitor trial periods, active subscriptions, grace periods, and locked shops."
          columns={subColumns}
          data={subs}
          keyExtractor={(item) => item.id}
          searchPlaceholder="Search shop, owner, plan..."
          rowActions={[
            {
              label: 'Manual Override (Audit Logged)',
              icon: <ShieldCheck size={14} />,
              variant: 'success',
              onClick: (row) => {
                setSelectedSub(row);
                setIsOverrideOpen(true);
              },
            },
          ]}
        />
      ) : (
        <DataTable
          title="Subscription Pricing Tiers"
          subtitle="Configure plan fees, max employee seats, and feature bitmask permissions."
          columns={planColumns}
          data={plans}
          keyExtractor={(item) => item.id}
        />
      )}

      {/* Audited Manual Subscription Override Modal */}
      <ConfirmationDialog
        isOpen={isOverrideOpen}
        onClose={() => setIsOverrideOpen(false)}
        onConfirm={handleOverride}
        title={`Manual Subscription Override: ${selectedSub?.business?.name}`}
        message="Manually granting plan access or waiving payment requires a mandatory audit log entry."
        confirmText="Grant & Extend Access"
        variant="warning"
        requireReason={true}
      />
    </div>
  );
};
