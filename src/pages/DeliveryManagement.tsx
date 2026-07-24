import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { PartnerVehicle, DeliveryJob, VehicleServiceType } from '../types';
import { DataTable, Column } from '../components/DataTable';
import { Badge } from '../components/Badge';
import { Tabs } from '../components/Tabs';
import { Truck, CircleCheck as CheckCircle2, Navigation, TriangleAlert as AlertTriangle, ShieldCheck } from 'lucide-react';

export const DeliveryManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('partners');
  const [partners, setPartners] = useState<PartnerVehicle[]>([]);
  const [jobs, setJobs] = useState<DeliveryJob[]>([]);

  useEffect(() => {
    api.getPartners().then(setPartners);
    api.getDeliveryJobs().then(setJobs);
  }, []);

  const partnerColumns: Column<PartnerVehicle>[] = [
    { key: 'partnerName', header: 'Partner / Driver Name', accessor: (row) => row.partner?.name || 'Senthil' },
    { key: 'phone', header: 'Phone Number', accessor: (row) => row.partner?.phoneNumber || '-' },
    {
      key: 'serviceType',
      header: 'Vehicle Class',
      sortable: true,
      filterable: true,
      filterOptions: ['delivery', 'auto', 'car'],
      render: (val: VehicleServiceType) => <Badge variant={val === 'car' ? 'purple' : val === 'auto' ? 'info' : 'warning'}>{val.toUpperCase()}</Badge>,
    },
    { key: 'vehicleRegistrationNumber', header: 'RC / Plate Number', sortable: true },
    { key: 'vehicleModel', header: 'Model Details', render: (val) => val || '-' },
    {
      key: 'verified',
      header: 'Document Verification',
      render: (val) => <Badge variant={val ? 'success' : 'danger'}>{val ? 'Verified Partner' : 'Unverified'}</Badge>,
    },
    {
      key: 'isAvailable',
      header: 'Fleet Duty Status',
      render: (val) => <Badge variant={val ? 'success' : 'neutral'}>{val ? 'Online & Ready' : 'Offline'}</Badge>,
    },
  ];

  const jobColumns: Column<DeliveryJob>[] = [
    { key: 'orderNumber', header: 'Order Ref', sortable: true },
    { key: 'businessName', header: 'Pickup Merchant', sortable: true },
    { key: 'deliveryPartnerName', header: 'Assigned Partner', render: (val) => val || 'Searching Proximity...' },
    { key: 'pickupAddress', header: 'Pickup Address' },
    { key: 'dropAddress', header: 'Drop Address' },
    { key: 'deliveryFee', header: 'Payout (₹)', render: (val) => `₹${val.toFixed(2)}` },
    {
      key: 'status',
      header: 'Job State',
      render: (val) => <Badge variant={val === 'delivered' ? 'success' : 'warning'}>{val.replace('_', ' ')}</Badge>,
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <Tabs
        tabs={[
          { id: 'partners', label: 'Registered Fleet & Drivers', count: partners.length, icon: <Truck size={16} /> },
          { id: 'jobs', label: 'Active Delivery Jobs', count: jobs.length, icon: <Navigation size={16} /> },
        ]}
        activeTab={activeTab}
        onChange={setActiveTab}
      />

      {activeTab === 'partners' ? (
        <DataTable
          title="Fleet Partners & Ride Drivers"
          subtitle="Manage delivery boys, Auto drivers (min 5km), and Car drivers (min 15km)."
          columns={partnerColumns}
          data={partners}
          keyExtractor={(item) => item.id}
          searchPlaceholder="Search driver name, plate number, vehicle..."
        />
      ) : (
        <DataTable
          title="Live Logistics & Job Dispatch Queue"
          subtitle="Proximity matching overview and OTP confirmation state."
          columns={jobColumns}
          data={jobs}
          keyExtractor={(item) => item.id}
        />
      )}
    </div>
  );
};
