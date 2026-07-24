import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { SystemServiceStatus as SystemHealth } from '../types';
import { StatCard } from '../components/StatCard';
import { Badge } from '../components/Badge';
import { Activity, Database, Server, Cpu, HardDrive, Wifi, Radio } from 'lucide-react';

export const SystemMonitoring: React.FC = () => {
  const [health, setHealth] = useState<SystemHealth[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.getSystemHealth()
      .then(setHealth)
      .finally(() => setIsLoading(false));
  }, []);

  const avgLatency = health.length > 0 
    ? Math.round(health.reduce((acc, s) => acc + s.latencyMs, 0) / health.length)
    : 0;

  const avgUptime = health.length > 0 
    ? (health.reduce((acc, s) => acc + s.uptimePercentage, 0) / health.length).toFixed(2)
    : '0.00';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <StatCard title="API Response Latency" value={isLoading ? '-' : `${avgLatency} ms`} icon={<Activity size={20} />} accentColor="#38bdf8" />
        <StatCard title="PostgreSQL CPU Load" value={isLoading ? '-' : "18.4%"} icon={<Cpu size={20} />} accentColor="#34d399" />
        <StatCard title="Redis Memory Usage" value={isLoading ? '-' : "42.1%"} icon={<HardDrive size={20} />} accentColor="#a855f7" />
        <StatCard title="Global SLA Health" value={isLoading ? '-' : `${avgUptime}%`} icon={<Server size={20} />} accentColor="#fbbf24" />
      </div>

      <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '1.25rem', color: '#f8fafc' }}>
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: 600 }}>Backend Microservices & Gateway Health Monitor</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '1rem', height: '76px', display: 'flex', alignItems: 'center' }}>
                 <div style={{ width: '60%', height: '14px', background: '#334155', borderRadius: '4px' }} />
              </div>
            ))
          ) : (
            health.map((s) => (
              <div key={s.name} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#f8fafc' }}>{s.name}</div>
                  <div style={{ fontSize: '0.775rem', color: '#94a3b8', marginTop: '0.2rem' }}>Latency: {s.latencyMs}ms • Uptime: {s.uptimePercentage}%</div>
                </div>
                <Badge variant={s.status === 'healthy' ? 'success' : s.status === 'degraded' ? 'warning' : 'danger'}>
                  {s.status.toUpperCase()}
                </Badge>
              </div>
            ))
          )}
          {!isLoading && health.length === 0 && (
            <div style={{ color: '#94a3b8', padding: '1rem' }}>No health data available.</div>
          )}
        </div>
      </div>
    </div>
  );
};
