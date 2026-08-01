import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { SystemHealth, SystemHealthService } from '../types';
import { StatCard } from '../components/StatCard';
import { Badge } from '../components/Badge';
import { Activity, Cpu, HardDrive, Database } from 'lucide-react';

const SERVICE_LABELS: Record<keyof SystemHealth['services'], string> = {
  database: 'PostgreSQL Database',
  redis: 'Redis Cache',
  storage: 'File Storage',
};

function statusVariant(status: SystemHealthService['status']) {
  if (status === 'down') return 'danger';
  if (status === 'configured') return 'info';
  return 'success';
}

export const SystemMonitoring: React.FC = () => {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    api.getSystemHealth()
      .then(setHealth)
      .finally(() => setIsLoading(false));
  }, []);

  const services = health
    ? (Object.entries(health.services) as [keyof SystemHealth['services'], SystemHealthService][])
    : [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
        <StatCard
          title="Overall Status"
          value={isLoading ? '-' : (health?.status ?? 'unknown').toUpperCase()}
          icon={<Activity size={20} />}
          accentColor={health?.status === 'healthy' ? '#34d399' : '#f87171'}
        />
        <StatCard
          title="Process Uptime"
          value={isLoading || !health ? '-' : `${Math.round(health.uptime / 60)} min`}
          icon={<Cpu size={20} />}
          accentColor="#38bdf8"
        />
        <StatCard
          title="Heap Memory Used"
          value={isLoading || !health ? '-' : `${health.metrics.memoryUsageMb} MB`}
          icon={<HardDrive size={20} />}
          accentColor="#a855f7"
        />
        <StatCard
          title="Load Average (1m)"
          value={isLoading || !health ? '-' : health.metrics.loadAverage[0].toFixed(2)}
          icon={<Database size={20} />}
          accentColor="#fbbf24"
        />
      </div>

      <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '1.25rem', color: '#f8fafc' }}>
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: 600 }}>Dependency Health</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '1rem', height: '76px', display: 'flex', alignItems: 'center' }}>
                 <div style={{ width: '60%', height: '14px', background: '#334155', borderRadius: '4px' }} />
              </div>
            ))
          ) : (
            services.map(([key, service]) => (
              <div key={key} style={{ background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#f8fafc' }}>{SERVICE_LABELS[key]}</div>
                  <div style={{ fontSize: '0.775rem', color: '#94a3b8', marginTop: '0.2rem' }}>
                    {service.latencyMs !== undefined ? `Latency: ${service.latencyMs}ms` : service.provider ?? 'unmonitored'}
                  </div>
                </div>
                <Badge variant={statusVariant(service.status)}>{service.status.toUpperCase()}</Badge>
              </div>
            ))
          )}
          {!isLoading && !health && (
            <div style={{ color: '#94a3b8', padding: '1rem' }}>No health data available.</div>
          )}
        </div>
      </div>
    </div>
  );
};
