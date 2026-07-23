import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { SystemServiceStatus as SystemHealth } from '../types';
import { StatCard } from '../components/StatCard';
import { Badge } from '../components/Badge';
import { Activity, Database, Server, Cpu, HardDrive, Wifi, Radio } from 'lucide-react';

export const SystemMonitoring: React.FC = () => {
  const [health, setHealth] = useState<SystemHealth[] | null>(null);

  useEffect(() => {
    api.getSystemHealth().then(setHealth);
  }, []);

  const services = health || [
    { name: 'PostgreSQL Primary Database', status: 'healthy', latencyMs: 4, uptimePercentage: 99.99 },
    { name: 'Redis Cache Cluster & Sessions', status: 'healthy', latencyMs: 1, uptimePercentage: 100.0 },
    { name: 'Node.js Express API Cluster', status: 'healthy', latencyMs: 12, uptimePercentage: 99.95 },
    { name: 'MSG91 OTP & SMS Gateway', status: 'healthy', latencyMs: 140, uptimePercentage: 99.8 },
    { name: 'Exotel Voice Call Gateway', status: 'degraded', latencyMs: 450, uptimePercentage: 98.5 },
    { name: 'FCM Push Notification Gateway', status: 'healthy', latencyMs: 85, uptimePercentage: 99.9 },
  ] as SystemHealth[];

  const avgLatency = health 
    ? Math.round(health.reduce((acc, s) => acc + s.latencyMs, 0) / health.length)
    : 14;

  const avgUptime = health 
    ? (health.reduce((acc, s) => acc + s.uptimePercentage, 0) / health.length).toFixed(2)
    : '99.98';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <StatCard title="API Response Latency" value={`${avgLatency} ms`} icon={<Activity size={20} />} accentColor="#38bdf8" />
        <StatCard title="PostgreSQL CPU Load" value="18.4%" icon={<Cpu size={20} />} accentColor="#34d399" />
        <StatCard title="Redis Memory Usage" value="42.1%" icon={<HardDrive size={20} />} accentColor="#a855f7" />
        <StatCard title="Global SLA Health" value={`${avgUptime}%`} icon={<Server size={20} />} accentColor="#fbbf24" />
      </div>

      <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '1.25rem', color: '#f8fafc' }}>
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: 600 }}>Backend Microservices & Gateway Health Monitor</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {services.map((s) => (
            <div key={s.name} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#f8fafc' }}>{s.name}</div>
                <div style={{ fontSize: '0.775rem', color: '#94a3b8', marginTop: '0.2rem' }}>Latency: {s.latencyMs}ms • Uptime: {s.uptimePercentage}%</div>
              </div>
              <Badge variant={s.status === 'healthy' ? 'success' : s.status === 'degraded' ? 'warning' : 'danger'}>
                {s.status.toUpperCase()}
              </Badge>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
