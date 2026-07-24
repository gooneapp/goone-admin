import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

export interface StatCardProps {
  title: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  subtitle?: string;
  badge?: React.ReactNode;
  accentColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  icon,
  trend,
  subtitle,
  badge,
  accentColor = '#38bdf8',
}) => {
  return (
    <div
      style={{
        background: 'linear-gradient(145deg, #0f172a 0%, #1e293b 100%)',
        border: '1px solid #1e293b',
        borderRadius: '12px',
        padding: '1.25rem',
        color: '#f8fafc',
        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.25)',
        position: 'relative',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div style={{ position: 'absolute', top: 0, right: 0, width: '80px', height: '80px', background: `radial-gradient(circle, ${accentColor}15 0%, transparent 70%)`, pointerEvents: 'none' }} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.75rem' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 500, color: '#94a3b8' }}>{title}</span>
        {icon && (
          <div style={{ background: `${accentColor}20`, padding: '0.5rem', borderRadius: '8px', color: accentColor, display: 'flex' }}>
            {icon}
          </div>
        )}
      </div>

      <div>
        <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#f8fafc', letterSpacing: '-0.5px' }}>
          {value}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.5rem' }}>
          {trend && (
            <span
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.2rem',
                fontSize: '0.775rem',
                fontWeight: 600,
                color: trend.isPositive ? '#34d399' : '#f87171',
              }}
            >
              {trend.isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
              {trend.value}
            </span>
          )}
          {subtitle && <span style={{ fontSize: '0.775rem', color: '#64748b' }}>{subtitle}</span>}
          {badge}
        </div>
      </div>
    </div>
  );
};
