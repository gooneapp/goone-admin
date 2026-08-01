import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { PartnerVehicle, DeliveryJob, VehicleServiceType, CustomerRideRequest } from '../types';
import { DataTable, Column } from '../components/DataTable';
import { Badge } from '../components/Badge';
import { Tabs } from '../components/Tabs';
import { Truck, CircleCheck as CheckCircle2, Navigation, TriangleAlert as AlertTriangle, ShieldCheck, Car, Check, Pencil, Wallet } from 'lucide-react';
import { FareRulesPanel } from '../components/FareRulesPanel';

// Inline-editable "km" cell for the Customer Rides tab — click to edit,
// Enter/blur to save. Shows the admin override when set, otherwise the
// system (Google Directions, falling back to haversine) calculated value.
const EditableKm: React.FC<{ row: CustomerRideRequest; onSave: (requestId: string, km: number) => Promise<void> }> = ({ row, onSave }) => {
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const currentKm = row.adminDistanceKm ?? row.estimatedDistanceKm;
  const [value, setValue] = useState(currentKm);

  const commit = async () => {
    const parsed = parseFloat(value);
    if (Number.isNaN(parsed) || parsed <= 0) { setValue(currentKm); setEditing(false); return; }
    setSaving(true);
    try {
      await onSave(row.id, parsed);
      setEditing(false);
    } finally {
      setSaving(false);
    }
  };

  if (!editing) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <span>{parseFloat(currentKm).toFixed(2)} km</span>
        {row.adminDistanceKm && <Badge variant="info">Edited</Badge>}
        <button
          onClick={() => { setValue(currentKm); setEditing(true); }}
          style={{ background: 'none', border: 'none', color: '#38bdf8', cursor: 'pointer', padding: '0.2rem', display: 'flex' }}
          title="Edit distance"
        >
          <Pencil size={13} />
        </button>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }} onClick={(e) => e.stopPropagation()}>
      <input
        type="number"
        step="0.1"
        min="0"
        autoFocus
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => { if (e.key === 'Enter') commit(); if (e.key === 'Escape') setEditing(false); }}
        disabled={saving}
        style={{ width: '70px', padding: '0.3rem 0.4rem', background: '#1e293b', border: '1px solid #38bdf8', borderRadius: '6px', color: '#f8fafc', fontSize: '0.85rem' }}
      />
      <button onClick={commit} disabled={saving} style={{ background: '#0284c7', border: 'none', borderRadius: '4px', color: '#fff', cursor: 'pointer', padding: '0.25rem' }}>
        <Check size={13} />
      </button>
    </div>
  );
};

export const DeliveryManagement: React.FC = () => {
  const [activeTab, setActiveTab] = useState('partners');
  const [partners, setPartners] = useState<PartnerVehicle[]>([]);
  const [jobs, setJobs] = useState<DeliveryJob[]>([]);
  const [rides, setRides] = useState<CustomerRideRequest[]>([]);

  useEffect(() => {
    api.getPartners().then(setPartners);
    api.getDeliveryJobs().then(setJobs);
    api.getCustomerRides().then(setRides);
  }, []);

  const handleSaveKm = async (requestId: string, km: number) => {
    await api.updateRideDistance(requestId, km);
    setRides((prev) => prev.map((r) => (r.id === requestId ? { ...r, adminDistanceKm: String(km) } : r)));
  };

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

  const rideColumns: Column<CustomerRideRequest>[] = [
    { key: 'customerName', header: 'Customer', accessor: (row) => row.customer?.name || '-' },
    { key: 'customerPhone', header: 'Phone', accessor: (row) => row.customer?.phoneNumber || '-' },
    {
      key: 'vehicleType',
      header: 'Vehicle',
      sortable: true,
      filterable: true,
      filterOptions: ['auto', 'car'],
      render: (val: VehicleServiceType) => <Badge variant={val === 'car' ? 'purple' : 'info'}>{val.toUpperCase()}</Badge>,
    },
    {
      key: 'bookingType',
      header: 'Booking',
      filterable: true,
      filterOptions: ['instant', 'scheduled'],
      render: (val: 'instant' | 'scheduled', row) => (
        <div>
          <Badge variant={val === 'scheduled' ? 'warning' : 'success'}>{val === 'scheduled' ? 'Scheduled' : 'Instant'}</Badge>
          {val === 'scheduled' && row.scheduledAt && (
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>
              {new Date(row.scheduledAt).toLocaleString()}
            </div>
          )}
        </div>
      ),
    },
    {
      key: 'distanceKm',
      header: 'Distance (Can Edit)',
      sortable: false,
      accessor: (row) => parseFloat(row.adminDistanceKm ?? row.estimatedDistanceKm),
      render: (_val, row) => <EditableKm row={row} onSave={handleSaveKm} />,
    },
    {
      key: 'fareAmount',
      header: 'Fare (₹)',
      accessor: (row) => row.ride?.fareAmount,
      render: (val) => (val ? `₹${parseFloat(val).toFixed(2)}` : 'Pending'),
    },
    {
      key: 'partnerName',
      header: 'Assigned Driver',
      accessor: (row) => row.ride?.partner?.name || (row.status === 'matched' ? '-' : 'Searching Proximity...'),
    },
    {
      key: 'status',
      header: 'Status',
      render: (val: CustomerRideRequest['status']) => (
        <Badge variant={val === 'matched' ? 'success' : val === 'cancelled' || val === 'expired' ? 'danger' : 'warning'}>
          {val.toUpperCase()}
        </Badge>
      ),
    },
    { key: 'createdAt', header: 'Requested At', render: (val) => new Date(val).toLocaleString(), sortable: true },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <Tabs
        tabs={[
          { id: 'partners', label: 'Registered Fleet & Drivers', count: partners.length, icon: <Truck size={16} /> },
          { id: 'jobs', label: 'Active Delivery Jobs', count: jobs.length, icon: <Navigation size={16} /> },
          { id: 'rides', label: 'Customer Rides (Auto/Car)', count: rides.length, icon: <Car size={16} /> },
          { id: 'fare-rules', label: 'Fare & KM Rules', icon: <Wallet size={16} /> },
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
      ) : activeTab === 'jobs' ? (
        <DataTable
          title="Live Logistics & Job Dispatch Queue"
          subtitle="Proximity matching overview and OTP confirmation state."
          columns={jobColumns}
          data={jobs}
          keyExtractor={(item) => item.id}
        />
      ) : activeTab === 'rides' ? (
        <DataTable
          title="Customer Ride Requests"
          subtitle="Instant & scheduled Auto/Car bookings — distance is Google-calculated (road distance) with a manual admin override."
          columns={rideColumns}
          data={rides}
          keyExtractor={(item) => item.id}
          searchPlaceholder="Search customer name, phone..."
        />
      ) : (
        <FareRulesPanel />
      )}
    </div>
  );
};
