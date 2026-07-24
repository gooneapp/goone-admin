import React, { useState } from 'react';
import { Bell, Send, MessageSquare, PhoneCall, Smartphone } from 'lucide-react';

export const NotificationCenter: React.FC = () => {
  const [targetAudience, setTargetAudience] = useState('all_merchants');
  const [channel, setChannel] = useState('push');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');

  const handleBroadcast = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Broadcast Notification dispatched via ${channel.toUpperCase()} to ${targetAudience}. Title: ${title}`);
    setTitle('');
    setMessage('');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '1.5rem', color: '#f8fafc' }}>
        <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', fontWeight: 600 }}>Notification & Broadcast Alert Center</h2>
        <p style={{ margin: '0 0 1.5rem 0', fontSize: '0.875rem', color: '#94a3b8' }}>Dispatch in-app push notifications, SMS alerts (MSG91), or Exotel voice reminders.</p>

        <form onSubmit={handleBroadcast} style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: '600px' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.3rem' }}>Target User Audience</label>
            <select
              value={targetAudience}
              onChange={(e) => setTargetAudience(e.target.value)}
              style={{ width: '100%', padding: '0.6rem', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#38bdf8', fontWeight: 600 }}
            >
              <option value="all_merchants">All Onboarded Business Owners</option>
              <option value="all_customers">All End Customers</option>
              <option value="delivery_partners">Active Delivery Partners & Drivers</option>
              <option value="expiring_subs">Businesses with Expiring Subscriptions</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.3rem' }}>Dispatch Channel</label>
            <div style={{ display: 'flex', gap: '1rem' }}>
              {['push', 'sms', 'voice_call'].map(ch => (
                <label key={ch} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.85rem' }}>
                  <input type="radio" name="channel" value={ch} checked={channel === ch} onChange={(e) => setChannel(e.target.value)} />
                  {ch.replace('_', ' ').toUpperCase()}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.3rem' }}>Notification Title</label>
            <input
              type="text"
              required
              placeholder="e.g. Special Pongal Festival Business Grant"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={{ width: '100%', padding: '0.6rem', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.3rem' }}>Message Body (Multi-lingual Template Supported)</label>
            <textarea
              required
              rows={4}
              placeholder="Enter message text in English, Tamil, or Hindi..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              style={{ width: '100%', padding: '0.6rem', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff', outline: 'none' }}
            />
          </div>

          <button
            type="submit"
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', background: 'linear-gradient(135deg, #0284c7, #38bdf8)', border: 'none', color: '#fff', padding: '0.75rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 700 }}
          >
            <Send size={16} /> Broadcast Notification Now
          </button>
        </form>
      </div>
    </div>
  );
};
