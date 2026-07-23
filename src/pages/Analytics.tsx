import React from 'react';
import { ChartColumn as BarChart3, TrendingUp, Users, ShoppingBag } from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';

export const Analytics: React.FC = () => {
  const wauData = [
    { week: 'W1 June', wau: 28000, mau: 82000 },
    { week: 'W2 June', wau: 31000, mau: 88000 },
    { week: 'W3 June', wau: 34500, mau: 95000 },
    { week: 'W4 June', wau: 39000, mau: 104000 },
    { week: 'W1 July', wau: 42000, mau: 112000 },
    { week: 'W2 July', wau: 46500, mau: 121000 },
    { week: 'W3 July', wau: 51000, mau: 125000 },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '1.25rem' }}>
        <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: 600, color: '#f8fafc' }}>Active Users Growth (WAU vs MAU)</h3>
        <div style={{ height: '300px' }}>
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={wauData}>
              <XAxis dataKey="week" stroke="#64748b" />
              <YAxis stroke="#64748b" />
              <Tooltip contentStyle={{ background: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }} />
              <Area type="monotone" dataKey="mau" stroke="#a855f7" fill="#a855f720" strokeWidth={2} />
              <Area type="monotone" dataKey="wau" stroke="#38bdf8" fill="#38bdf830" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
