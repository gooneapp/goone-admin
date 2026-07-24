import React, { useEffect, useState } from 'react';
import { apiClient } from '../api/client';
import type { PartnerVehicle } from '../types';
import { CheckCircle2, XCircle, ShieldCheck, Car, Bike } from '../components/icons';

export const Partners: React.FC = () => {
  const [vehicles, setVehicles] = useState<PartnerVehicle[]>([]);
  const [loading, setLoading] = useState(true);
  const [serviceTypeFilter, setServiceTypeFilter] = useState('');
  const [selectedVehicle, setSelectedVehicle] = useState<PartnerVehicle | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');

  const fetchPartners = async () => {
    setLoading(true);
    try {
      const q = serviceTypeFilter ? `?service_type=${serviceTypeFilter}` : '';
      const res: any = await apiClient.get(`/admin/partners${q}`);
      setVehicles(res.data || []);
    } catch (err) {
      setVehicles([
        {
          id: 'v-101',
          partnerUserId: 'u-201',
          serviceType: 'delivery',
          vehicleRegistrationNumber: 'TN 33 AB 1234',
          vehicleModel: 'TVS XL 100',
          verified: false,
          partner: { name: 'Kannan K', phoneNumber: '+919812345670' },
          createdAt: new Date().toISOString(),
        },
        {
          id: 'v-102',
          partnerUserId: 'u-202',
          serviceType: 'auto',
          vehicleRegistrationNumber: 'TN 38 CD 5678',
          vehicleModel: 'Bajaj RE Auto',
          verified: false,
          partner: { name: 'Senthil Kumar', phoneNumber: '+919812345671' },
          createdAt: new Date().toISOString(),
        },
        {
          id: 'v-103',
          partnerUserId: 'u-203',
          serviceType: 'car',
          vehicleRegistrationNumber: 'TN 37 EF 9012',
          vehicleModel: 'Maruti Suzuki Dzire',
          verified: true,
          partner: { name: 'Raju V', phoneNumber: '+919812345672' },
          createdAt: new Date().toISOString(),
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPartners();
  }, [serviceTypeFilter]);

  const handleVerify = async (verified: boolean) => {
    if (!selectedVehicle) return;
    try {
      await apiClient.patch(`/admin/partners/${selectedVehicle.id}/verify`, {
        verified,
        rejection_reason: verified ? undefined : rejectionReason,
      });
      setSelectedVehicle(null);
      setRejectionReason('');
      fetchPartners();
    } catch (err) {
      alert('Failed to submit verification status');
    }
  };

  const getServiceIcon = (type: string) => {
    if (type === 'auto' || type === 'car') return <Car size={18} color="#60a5fa" />;
    return <Bike size={18} color="#34d399" />;
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white' }}>
            Partner Driver & Delivery Verification Queue
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Unified verification for Auto Drivers, Car Drivers & Delivery Partners
          </p>
        </div>

        <select
          className="input-field"
          style={{ width: '200px' }}
          value={serviceTypeFilter}
          onChange={(e) => setServiceTypeFilter(e.target.value)}
        >
          <option value="">All Vehicle Types</option>
          <option value="delivery">Delivery Bikes Only</option>
          <option value="auto">Auto Rickshaw Only</option>
          <option value="car">Car / Taxi Only</option>
        </select>
      </div>

      <div className="glass-panel" style={{ padding: '0.5rem' }}>
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Partner Name</th>
                <th>Phone Number</th>
                <th>Service Mode</th>
                <th>Vehicle Plate #</th>
                <th>Vehicle Model</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '2rem' }}>
                    Loading partner vehicles...
                  </td>
                </tr>
              ) : vehicles.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                    No vehicle registrations found.
                  </td>
                </tr>
              ) : (
                vehicles.map((v) => (
                  <tr key={v.id}>
                    <td>
                      <div style={{ fontWeight: 600, color: 'white' }}>{v.partner?.name || 'Driver'}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>ID: {v.partnerUserId}</div>
                    </td>
                    <td>{v.partner?.phoneNumber || 'N/A'}</td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textTransform: 'capitalize' }}>
                        {getServiceIcon(v.serviceType)}
                        <span>{v.serviceType}</span>
                      </div>
                    </td>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, color: '#38bdf8' }}>
                      {v.vehicleRegistrationNumber}
                    </td>
                    <td>{v.vehicleModel || 'Standard'}</td>
                    <td>
                      <span className={`badge ${v.verified ? 'badge-approved' : 'badge-pending'}`}>
                        {v.verified ? 'Verified & Active' : 'Pending Review'}
                      </span>
                    </td>
                    <td>
                      <button
                        className="btn btn-secondary btn-sm"
                        onClick={() => setSelectedVehicle(v)}
                      >
                        <ShieldCheck size={14} /> Review Registration
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedVehicle && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.75)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
          }}
        >
          <div className="glass-panel" style={{ width: '100%', maxWidth: '480px', padding: '1.75rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'white', marginBottom: '1rem' }}>
              Verify Vehicle: {selectedVehicle.vehicleRegistrationNumber}
            </h3>

            <div style={{ background: 'rgba(0, 0, 0, 0.2)', padding: '1rem', borderRadius: '8px', marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.875rem', color: 'white', fontWeight: 600, marginBottom: '0.25rem' }}>
                Driver: {selectedVehicle.partner?.name} ({selectedVehicle.partner?.phoneNumber})
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
                Service Type: <strong style={{ textTransform: 'capitalize', color: '#38bdf8' }}>{selectedVehicle.serviceType}</strong>
              </div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.125rem' }}>
                Model: {selectedVehicle.vehicleModel || 'Standard'}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Rejection Reason (If rejecting)</label>
              <textarea
                className="input-field"
                rows={2}
                placeholder="Specify reason for vehicle registration rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
              <button
                className="btn btn-secondary"
                onClick={() => {
                  setSelectedVehicle(null);
                  setRejectionReason('');
                }}
              >
                Cancel
              </button>
              <button
                className="btn btn-danger"
                disabled={!rejectionReason}
                onClick={() => handleVerify(false)}
              >
                <XCircle size={16} /> Reject Vehicle
              </button>
              <button
                className="btn btn-success"
                onClick={() => handleVerify(true)}
              >
                <CheckCircle2 size={16} /> Approve & Activate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
