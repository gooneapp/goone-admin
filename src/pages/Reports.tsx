import React, { useState } from 'react';
import { FileText, Download, Printer, Calendar } from 'lucide-react';

export const Reports: React.FC = () => {
  const [fromDate, setFromDate] = useState('2026-07-01');
  const [toDate, setToDate] = useState('2026-07-23');
  const [reportType, setReportType] = useState('sales_summary');

  const handleExport = (format: string) => {
    alert(`Generating & Downloading ${reportType.toUpperCase()} report in ${format.toUpperCase()} format for period ${fromDate} to ${toDate}`);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ background: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px', padding: '1.5rem', color: '#f8fafc' }}>
        <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.25rem', fontWeight: 600 }}>Reports & Business Intelligence</h2>
        <p style={{ margin: '0 0 1.5rem 0', fontSize: '0.875rem', color: '#94a3b8' }}>Generate aggregated platform reports with custom date ranges and export options.</p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.3rem' }}>Select Report Category</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              style={{ width: '100%', padding: '0.6rem', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#38bdf8', fontWeight: 600 }}
            >
              <option value="sales_summary">Gross Sales & Revenue Summary</option>
              <option value="credit_ledger">Outstanding Khata Credit Ledger</option>
              <option value="delivery_payouts">Delivery Partner Payouts & Earnings</option>
              <option value="inventory_expiry">Inventory Turnover & Expiry Audit</option>
              <option value="subscription_renewals">SaaS Subscription Renewals & Churn</option>
            </select>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.3rem' }}>From Date</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              style={{ width: '100%', padding: '0.6rem', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', color: '#cbd5e1', marginBottom: '0.3rem' }}>To Date</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              style={{ width: '100%', padding: '0.6rem', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#fff' }}
            />
          </div>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={() => handleExport('csv')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: 'linear-gradient(135deg, #0284c7, #38bdf8)', border: 'none', color: '#fff', padding: '0.6rem 1.2rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
          >
            <Download size={16} /> Export CSV Format
          </button>
          <button
            onClick={() => handleExport('excel')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#10b981', border: 'none', color: '#fff', padding: '0.6rem 1.2rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
          >
            <Download size={16} /> Export Excel (.xlsx)
          </button>
          <button
            onClick={() => handleExport('pdf')}
            style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#1e293b', border: '1px solid #334155', color: '#cbd5e1', padding: '0.6rem 1.2rem', borderRadius: '8px', cursor: 'pointer', fontWeight: 600 }}
          >
            <Printer size={16} /> Printable PDF Summary
          </button>
        </div>
      </div>
    </div>
  );
};
