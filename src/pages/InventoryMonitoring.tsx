import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { Product } from '../types';
import { DataTable, Column } from '../components/DataTable';
import { Badge } from '../components/Badge';
import { Modal } from '../components/Modal';
import { Package, TriangleAlert as AlertTriangle, Calendar, Plus } from 'lucide-react';

export const InventoryMonitoring: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    api.getProducts().then(setProducts);
  }, []);

  const columns: Column<Product>[] = [
    { key: 'name', header: 'Product Item Name', sortable: true },
    { key: 'businessName', header: 'Shop / Business', sortable: true },
    { key: 'categoryName', header: 'Category', sortable: true },
    { key: 'price', header: 'Selling Price (₹)', sortable: true, render: (val) => `₹${val.toFixed(2)}` },
    {
      key: 'stockQuantity',
      header: 'Stock Level',
      sortable: true,
      render: (val, row) => {
        const isLow = val <= row.lowStockThreshold;
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontWeight: 700, color: isLow ? '#f87171' : '#34d399' }}>{val} {row.unit}s</span>
            {isLow && <span title="Low stock threshold reached!"><AlertTriangle size={15} color="#ef4444" /></span>}
          </div>
        );
      },
    },
    {
      key: 'batchExpiry',
      header: 'Batch & Medical Expiry',
      render: (_, row) => {
        if (!row.expiryDate) return <span style={{ color: '#64748b' }}>N/A</span>;
        const isExpired = new Date(row.expiryDate) < new Date();
        return (
          <div style={{ fontSize: '0.8rem' }}>
            <div style={{ color: '#cbd5e1' }}>Batch: {row.batchNumber || '-'}</div>
            <Badge variant={isExpired ? 'danger' : 'success'}>
              {isExpired ? 'EXPIRED - SALE BLOCKED' : `Expires: ${row.expiryDate}`}
            </Badge>
          </div>
        );
      },
    },
    {
      key: 'isAvailableToday',
      header: 'Menu Toggle',
      render: (val) => <Badge variant={val ? 'success' : 'warning'}>{val ? 'Available Today' : 'Sold Out'}</Badge>,
    },
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <DataTable
        title="Cross-Tenant Inventory & Stock Monitoring"
        subtitle="Track stock levels, low-stock threshold alerts, and medical shop batch expiry dates."
        columns={columns}
        data={products}
        keyExtractor={(item) => item.id}
        searchPlaceholder="Search product name, shop, category, batch..."
      />
    </div>
  );
};
