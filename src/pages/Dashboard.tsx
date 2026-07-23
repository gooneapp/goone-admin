import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { AnalyticsSummary, SupportTicket, Order } from '../types';
import { StatCard } from '../components/StatCard';
import { Badge } from '../components/Badge';
import { 
  Building2, 
  ShoppingCart, 
  DollarSign, 
  Truck, 
  LifeBuoy, 
  TriangleAlert as AlertTriangle,
  Users,
  CircleCheck as CheckCircle2,
  Clock
} from 'lucide-react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell 
} from 'recharts';

export const Dashboard: React.FC = () => {
  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    api.getAnalytics().then(setSummary);
    api.getSupportTickets().then(setTickets);
    api.getOrders().then(setOrders);
  }, []);

  const chartData = [
    { day: 'Mon', orders: 1240, revenue: 195000 },
    { day: 'Tue', orders: 1450, revenue: 220000 },
    { day: 'Wed', orders: 1320, revenue: 205000 },
    { day: 'Thu', orders: 1680, revenue: 270000 },
    { day: 'Fri', orders: 1900, revenue: 310000 },
    { day: 'Sat', orders: 2400, revenue: 410000 },
    { day: 'Sun', orders: 2150, revenue: 360000 },
  ];

  const categoryShare = [
    { name: 'Grocery', value: 45, color: '#38bdf8' },
    { name: 'Hotel & Restaurant', value: 25, color: '#fbbf24' },
    { name: 'Pharmacy', value: 15, color: '#34d399' },
    { name: 'Farmer Direct', value: 10, color: '#a855f7' },
    { name: 'Milk/Water', value: 5, color: '#f43f5e' },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Top Banner & Alert */}
      <div style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', border: '1px solid #334155', borderRadius: '12px', padding: '1.25rem 1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: '#f8fafc' }}>GoOne Executive Dashboard</h1>
          <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#94a3b8' }}>Real-time overview of business operations, sales performance, and SLA monitoring.</p>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <Badge variant="success" size="md">System 100% Operational</Badge>
          <Badge variant="warning" size="md">SLA Alert: 1 SOS Active</Badge>
        </div>
      </div>

      {/* KPI Metrics Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem' }}>
        <StatCard
          title="Active Businesses"
          value={summary?.active_businesses.toLocaleString() || '4,120'}
          icon={<Building2 size={20} />}
          trend={{ value: '+34 today', isPositive: true }}
          subtitle={`out of ${summary?.total_businesses || 4850} total`}
          accentColor="#38bdf8"
        />
        <StatCard
          title="Daily Orders Volume"
          value={summary?.today_orders.toLocaleString() || '14,200'}
          icon={<ShoppingCart size={20} />}
          trend={{ value: '+14.2%', isPositive: true }}
          subtitle="vs previous 7-day avg"
          accentColor="#fbbf24"
        />
        <StatCard
          title="Today Gross Revenue"
          value={`₹${((summary?.today_revenue || 2350000) / 100000).toFixed(2)}L`}
          icon={<DollarSign size={20} />}
          trend={{ value: '+18.5%', isPositive: true }}
          subtitle="Cash & UPI settlement"
          accentColor="#34d399"
        />
        <StatCard
          title="Verified Delivery Fleet"
          value={summary?.total_verified_partners || '890'}
          icon={<Truck size={20} />}
          trend={{ value: '145 active now', isPositive: true }}
          subtitle="Auto & Car drivers included"
          accentColor="#a855f7"
        />
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
        {/* Sales Trend Line Chart */}
        <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: '#f8fafc' }}>Weekly Order Volume & Revenue Trend</h3>
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Last 7 Days</span>
          </div>
          <div style={{ height: '260px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <XAxis dataKey="day" stroke="#64748b" />
                <YAxis stroke="#64748b" />
                <Tooltip contentStyle={{ background: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }} />
                <Line type="monotone" dataKey="orders" stroke="#38bdf8" strokeWidth={3} dot={{ r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown Pie Chart */}
        <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '1.25rem' }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem', fontWeight: 600, color: '#f8fafc' }}>Revenue Share by Category</h3>
          <div style={{ height: '190px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryShare} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={4}>
                  {categoryShare.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#0f172a', borderColor: '#334155', borderRadius: '8px', color: '#f8fafc' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'center', marginTop: '0.5rem' }}>
            {categoryShare.map((cat) => (
              <span key={cat.name} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.75rem', color: '#cbd5e1' }}>
                <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: cat.color }} />
                {cat.name} ({cat.value}%)
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Grid: Emergency Tickets & Recent Orders */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        {/* Support Alerts */}
        <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <LifeBuoy color="#ef4444" size={18} /> High Priority & Emergency Tickets
            </h3>
            <Badge variant="danger">{tickets.length} Open</Badge>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {tickets.map((t) => (
              <div key={t.id} style={{ background: '#1e293b', border: `1px solid ${t.isEmergencySos ? '#ef4444' : '#334155'}`, padding: '0.85rem', borderRadius: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.875rem', color: t.isEmergencySos ? '#ef4444' : '#38bdf8' }}>
                    {t.ticketNumber} {t.isEmergencySos && '🚨 SOS'}
                  </span>
                  <Badge variant={t.priority === 'critical' ? 'danger' : 'warning'}>{t.priority}</Badge>
                </div>
                <div style={{ fontSize: '0.825rem', color: '#e2e8f0', marginBottom: '0.4rem' }}>{t.description}</div>
                <div style={{ fontSize: '0.75rem', color: '#94a3b8', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Raised by: {t.raisedByName} ({t.raisedByPhone})</span>
                  <span>SLA: {new Date(t.slaDueAt).toLocaleTimeString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Live Orders Feed */}
        <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock color="#38bdf8" size={18} /> Live Orders & KOT Stream
            </h3>
            <Badge variant="info">Realtime Feed</Badge>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {orders.map((o) => (
              <div key={o.id} style={{ background: '#1e293b', border: '1px solid #334155', padding: '0.85rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#f8fafc' }}>{o.orderNumber} • {o.businessName}</div>
                  <div style={{ fontSize: '0.775rem', color: '#94a3b8' }}>Customer: {o.customerName} | {o.itemsCount} items</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontWeight: 700, color: '#34d399', fontSize: '0.9rem' }}>₹{o.totalAmount.toFixed(2)}</div>
                  <Badge variant={o.status === 'completed' ? 'success' : o.status === 'out_for_delivery' ? 'info' : 'warning'}>
                    {o.status.replace('_', ' ')}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
