import React, { useState } from 'react';
import { Languages, Megaphone, Plus, Save } from '../components/icons';

interface ContentItem {
  id: string;
  key: string;
  ta: string;
  en: string;
  hi: string;
}

export const ContentManager: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'i18n' | 'announcements'>('i18n');

  const [i18nStrings, setI18nStrings] = useState<ContentItem[]>([
    { id: '1', key: 'btn_place_order', en: 'Place Order', ta: 'ஆர்டர் செய்', hi: 'ऑर्डर दें' },
    { id: '2', key: 'label_total_amount', en: 'Total Amount', ta: 'மொத்த தொகை', hi: 'कुल राशि' },
    { id: '3', key: 'msg_credit_added', en: 'Credit Added to Book', ta: 'கடன் சேர்க்கப்பட்டது', hi: 'उधार जोड़ा गया' },
    { id: '4', key: 'btn_book_ride', en: 'Book Ride', ta: 'பயணம் பதிவு செய்', hi: 'राइड बुक करें' },
  ]);

  const [announcements] = useState([
    { id: 'a-1', title: 'Monsoon Delivery Advisory', body: 'Expect slight delays during heavy rain in Erode region.', active: true },
    { id: 'a-2', title: 'New Bluetooth Printing Support', body: 'All shops can now pair 58mm/80mm thermal receipt printers.', active: true },
  ]);

  const handleUpdateI18n = (id: string, field: 'en' | 'ta' | 'hi', val: string) => {
    setI18nStrings((prev) =>
      prev.map((item) => (item.id === id ? { ...item, [field]: val } : item)),
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'white' }}>
            Content & Multilingual Management
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>
            Edit app language translations (Tamil/English/Hindi) & push platform-wide announcements
          </p>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            className={`btn ${activeTab === 'i18n' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('i18n')}
          >
            <Languages size={16} /> Language Strings (i18n)
          </button>
          <button
            className={`btn ${activeTab === 'announcements' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('announcements')}
          >
            <Megaphone size={16} /> Broadcast Announcements
          </button>
        </div>
      </div>

      {activeTab === 'i18n' ? (
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'white' }}>
              App UI Language Dictionary (Hot-reloaded in Mobile Apps)
            </h3>
            <button className="btn btn-success btn-sm" onClick={() => alert('Translations published to API cache!')}>
              <Save size={14} /> Publish Changes
            </button>
          </div>

          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>String Key</th>
                  <th>English Label</th>
                  <th>Tamil Label (தமிழ்)</th>
                  <th>Hindi Label (हिंदी)</th>
                </tr>
              </thead>
              <tbody>
                {i18nStrings.map((item) => (
                  <tr key={item.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8125rem', color: '#60a5fa' }}>
                      {item.key}
                    </td>
                    <td>
                      <input
                        type="text"
                        className="input-field"
                        value={item.en}
                        onChange={(e) => handleUpdateI18n(item.id, 'en', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="input-field"
                        value={item.ta}
                        onChange={(e) => handleUpdateI18n(item.id, 'ta', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        className="input-field"
                        value={item.hi}
                        onChange={(e) => handleUpdateI18n(item.id, 'hi', e.target.value)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'white' }}>
              Active Mobile Banners & Announcements
            </h3>
            <button className="btn btn-primary btn-sm">
              <Plus size={14} /> New Announcement
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {announcements.map((anc) => (
              <div key={anc.id} className="glass-card" style={{ padding: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontWeight: 600, color: 'white', fontSize: '1rem' }}>{anc.title}</div>
                  <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>{anc.body}</div>
                </div>
                <span className="badge badge-active">Live Banner</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
