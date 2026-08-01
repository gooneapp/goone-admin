import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { RideFareConfig, RideFareSlab } from '../types';
import { toast } from '../store/toastStore';
import { Plus, Trash2, Save, Loader as LoaderIcon } from 'lucide-react';

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '0.5rem 0.65rem',
  background: '#1e293b',
  border: '1px solid #334155',
  borderRadius: '6px',
  color: '#f8fafc',
  fontSize: '0.85rem',
};

const labelStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  fontWeight: 600,
  color: '#94a3b8',
  marginBottom: '0.35rem',
  display: 'block',
};

/**
 * Admin editor for one vehicle type's fare rules: base fare, min/max
 * bookable KM, and an ordered list of per-KM pricing slabs. Empty slab
 * list = flat per-km rate (system default), matching the backend's
 * fallback behavior — so an admin who never touches this still gets the
 * exact fares the platform always charged.
 */
const VehicleFareEditor: React.FC<{ vehicleType: 'auto' | 'car' }> = ({ vehicleType }) => {
  const [config, setConfig] = useState<RideFareConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    api.getFareConfig(vehicleType)
      .then(setConfig)
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [vehicleType]); // eslint-disable-line react-hooks/exhaustive-deps

  if (loading || !config) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', color: '#64748b' }}>
        <LoaderIcon size={20} /> Loading fare rules…
      </div>
    );
  }

  const updateField = (field: keyof RideFareConfig, value: any) => {
    setConfig({ ...config, [field]: value });
  };

  const updateSlab = (idx: number, field: keyof RideFareSlab, value: any) => {
    const slabs = [...config.slabs];
    slabs[idx] = { ...slabs[idx], [field]: value };
    setConfig({ ...config, slabs });
  };

  const addSlab = () => {
    const last = config.slabs[config.slabs.length - 1];
    const nextMin = last ? (last.max_km ?? last.min_km + 5) : config.min_km;
    setConfig({ ...config, slabs: [...config.slabs, { min_km: nextMin, max_km: null, per_km_rate: config.default_per_km_rate }] });
  };

  const removeSlab = (idx: number) => {
    setConfig({ ...config, slabs: config.slabs.filter((_, i) => i !== idx) });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await api.saveFareConfig({
        vehicle_type: vehicleType,
        base_fare: Number(config.base_fare),
        min_km: Number(config.min_km),
        max_km: config.max_km !== null && config.max_km !== undefined ? Number(config.max_km) : null,
        slabs: config.slabs.map((s) => ({
          min_km: Number(s.min_km),
          max_km: s.max_km !== null && s.max_km !== undefined ? Number(s.max_km) : null,
          per_km_rate: Number(s.per_km_rate),
        })),
      });
      toast.success(`${vehicleType.toUpperCase()} fare rules saved.`);
      load();
    } catch {
      // Error toast already shown by the global API error interceptor.
    } finally {
      setSaving(false);
    }
  };

  return (
    <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '1.25rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginBottom: '1.25rem' }}>
        <div>
          <label style={labelStyle}>Base Fare (₹)</label>
          <input type="number" min="0" step="1" value={config.base_fare} onChange={(e) => updateField('base_fare', e.target.value)} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Minimum KM</label>
          <input type="number" min="0" step="0.5" value={config.min_km} onChange={(e) => updateField('min_km', e.target.value)} style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Maximum KM (blank = no cap)</label>
          <input
            type="number"
            min="0"
            step="0.5"
            value={config.max_km ?? ''}
            onChange={(e) => updateField('max_km', e.target.value === '' ? null : e.target.value)}
            style={inputStyle}
            placeholder="No cap"
          />
        </div>
      </div>

      <div style={{ marginBottom: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h4 style={{ margin: 0, fontSize: '0.95rem', color: '#f8fafc' }}>Per-KM Pricing Slabs</h4>
          <p style={{ margin: '0.15rem 0 0 0', fontSize: '0.75rem', color: '#64748b' }}>
            {config.slabs.length === 0
              ? `No slabs configured — flat ₹${config.default_per_km_rate}/km applies to the whole trip.`
              : 'Each slab bills only the portion of the trip inside its own range.'}
          </p>
        </div>
        <button
          onClick={addSlab}
          style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', background: '#0284c7', border: 'none', color: '#fff', padding: '0.4rem 0.75rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
        >
          <Plus size={14} /> Add Slab
        </button>
      </div>

      {config.slabs.length > 0 && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 32px', gap: '0.5rem', fontSize: '0.7rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', padding: '0 0.1rem' }}>
            <span>From (km)</span><span>To (km, blank = ∞)</span><span>Rate (₹/km)</span><span />
          </div>
          {config.slabs.map((slab, idx) => (
            <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 32px', gap: '0.5rem', alignItems: 'center' }}>
              <input type="number" min="0" step="0.5" value={slab.min_km} onChange={(e) => updateSlab(idx, 'min_km', e.target.value)} style={inputStyle} />
              <input
                type="number"
                min="0"
                step="0.5"
                value={slab.max_km ?? ''}
                onChange={(e) => updateSlab(idx, 'max_km', e.target.value === '' ? null : e.target.value)}
                style={inputStyle}
                placeholder="∞"
              />
              <input type="number" min="0" step="0.5" value={slab.per_km_rate} onChange={(e) => updateSlab(idx, 'per_km_rate', e.target.value)} style={inputStyle} />
              <button
                onClick={() => removeSlab(idx)}
                style={{ background: 'none', border: 'none', color: '#f87171', cursor: 'pointer', display: 'flex', justifyContent: 'center' }}
                title="Remove slab"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        onClick={handleSave}
        disabled={saving}
        style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: saving ? '#475569' : '#10b981', border: 'none', color: '#fff', padding: '0.6rem 1.25rem', borderRadius: '8px', cursor: saving ? 'not-allowed' : 'pointer', fontSize: '0.85rem', fontWeight: 700 }}
      >
        <Save size={15} /> {saving ? 'Saving…' : `Save ${vehicleType.toUpperCase()} Fare Rules`}
      </button>
    </div>
  );
};

export const FareRulesPanel: React.FC = () => {
  const [vehicleType, setVehicleType] = useState<'auto' | 'car'>('auto');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        {(['auto', 'car'] as const).map((vt) => (
          <button
            key={vt}
            onClick={() => setVehicleType(vt)}
            style={{
              background: vehicleType === vt ? '#0284c7' : '#1e293b',
              border: '1px solid #334155',
              color: vehicleType === vt ? '#fff' : '#94a3b8',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 600,
              fontSize: '0.85rem',
            }}
          >
            {vt.toUpperCase()}
          </button>
        ))}
      </div>
      <VehicleFareEditor key={vehicleType} vehicleType={vehicleType} />
    </div>
  );
};
