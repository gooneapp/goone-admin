import React, { useState, useMemo } from 'react';
import { 
  Search, 
  ChevronDown, 
  ChevronUp, 
  Download, 
  Eye, 
  Filter, 
  ChevronLeft, 
  ChevronRight,
  MoreVertical,
  CheckSquare,
  Square,
  Printer
} from 'lucide-react';
import { Badge } from './Badge';

export interface Column<T> {
  key: string;
  header: string;
  accessor?: (row: T) => any;
  sortable?: boolean;
  filterable?: boolean;
  filterOptions?: string[];
  render?: (value: any, row: T) => React.ReactNode;
}

export interface RowAction<T> {
  label: string;
  icon?: React.ReactNode;
  variant?: 'normal' | 'danger' | 'success';
  onClick: (row: T) => void;
}

export interface DataTableProps<T> {
  title?: string;
  subtitle?: string;
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string;
  searchPlaceholder?: string;
  searchFields?: (keyof T | string)[];
  rowActions?: RowAction<T>[];
  bulkActions?: {
    label: string;
    onClick: (selectedRows: T[]) => void;
    variant?: 'normal' | 'danger' | 'success';
  }[];
  defaultPageSize?: number;
  onRowClick?: (row: T) => void;
}

export function DataTable<T extends Record<string, any>>({
  title,
  subtitle,
  columns,
  data,
  keyExtractor,
  searchPlaceholder = 'Search records...',
  searchFields,
  rowActions,
  bulkActions,
  defaultPageSize = 10,
  onRowClick,
}: DataTableProps<T>) {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [visibleColumns, setVisibleColumns] = useState<Set<string>>(new Set(columns.map(c => c.key)));
  const [columnFilter, setColumnFilter] = useState<{ [key: string]: string }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  const [showColMenu, setShowColMenu] = useState(false);
  const [activeMenuRowId, setActiveMenuRowId] = useState<string | null>(null);

  // 1. Search & Filtering
  const filteredData = useMemo(() => {
    return data.filter(row => {
      // Global Search
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const matchesSearch = searchFields 
          ? searchFields.some(field => {
              const val = row[field as string];
              return val !== undefined && val !== null && String(val).toLowerCase().includes(query);
            })
          : Object.values(row).some(val => {
              return val !== undefined && val !== null && String(val).toLowerCase().includes(query);
            });
        if (!matchesSearch) return false;
      }

      // Column level filter
      for (const [colKey, filterVal] of Object.entries(columnFilter)) {
        if (!filterVal || filterVal === 'ALL') continue;
        const col = columns.find(c => c.key === colKey);
        const cellVal = col?.accessor ? col.accessor(row) : row[colKey];
        if (String(cellVal).toLowerCase() !== filterVal.toLowerCase()) {
          return false;
        }
      }

      return true;
    });
  }, [data, searchTerm, columnFilter, searchFields, columns]);

  // 2. Sorting
  const sortedData = useMemo(() => {
    if (!sortKey) return filteredData;
    const col = columns.find(c => c.key === sortKey);
    return [...filteredData].sort((a, b) => {
      const valA = col?.accessor ? col.accessor(a) : a[sortKey];
      const valB = col?.accessor ? col.accessor(b) : b[sortKey];
      
      if (valA === valB) return 0;
      if (valA === null || valA === undefined) return 1;
      if (valB === null || valB === undefined) return -1;
      
      const comparison = String(valA).localeCompare(String(valB), undefined, { numeric: true });
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [filteredData, sortKey, sortOrder, columns]);

  // 3. Pagination
  const totalPages = Math.ceil(sortedData.length / pageSize) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return sortedData.slice(start, start + pageSize);
  }, [sortedData, currentPage, pageSize]);

  // Selection logic
  const handleSelectAll = () => {
    if (selectedIds.size === paginatedData.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(paginatedData.map(keyExtractor)));
    }
  };

  const handleSelectRow = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  // CSV Export
  const exportCSV = () => {
    const activeCols = columns.filter(c => visibleColumns.has(c.key));
    const headers = activeCols.map(c => c.header).join(',');
    const rows = sortedData.map(row => {
      return activeCols.map(c => {
        const raw = c.accessor ? c.accessor(row) : row[c.key];
        const str = String(raw ?? '').replace(/"/g, '""');
        return `"${str}"`;
      }).join(',');
    }).join('\n');

    const csvContent = `data:text/csv;charset=utf-8,${headers}\n${rows}`;
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `${title || 'export'}_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const printTable = () => {
    window.print();
  };

  const toggleSort = (key: string) => {
    if (sortKey === key) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  return (
    <div style={{ background: 'var(--card-bg, #0f172a)', border: '1px solid var(--border-color, #1e293b)', borderRadius: '12px', overflow: 'hidden', padding: '1.25rem', color: '#f8fafc', boxShadow: '0 4px 20px rgba(0,0,0,0.3)' }}>
      {/* Header section */}
      {(title || subtitle) && (
        <div style={{ marginBottom: '1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            {title && <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600, color: '#f8fafc' }}>{title}</h2>}
            {subtitle && <p style={{ margin: '0.25rem 0 0 0', fontSize: '0.875rem', color: '#94a3b8' }}>{subtitle}</p>}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <button 
              onClick={exportCSV}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#1e293b', border: '1px solid #334155', color: '#38bdf8', padding: '0.5rem 0.85rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500 }}
            >
              <Download size={15} /> Export CSV
            </button>
            <button 
              onClick={printTable}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#1e293b', border: '1px solid #334155', color: '#94a3b8', padding: '0.5rem 0.85rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 500 }}
            >
              <Printer size={15} /> Print
            </button>
          </div>
        </div>
      )}

      {/* Toolbar */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        {/* Search */}
        <div style={{ position: 'relative', minWidth: '280px', flex: 1 }}>
          <Search size={16} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }} />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            style={{ width: '100%', padding: '0.55rem 0.75rem 0.55rem 2.25rem', background: '#1e293b', border: '1px solid #334155', borderRadius: '8px', color: '#f8fafc', fontSize: '0.875rem', outline: 'none' }}
          />
        </div>

        {/* Filter options & Column menu */}
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          {columns.filter(c => c.filterable && c.filterOptions).map(col => (
            <select
              key={col.key}
              value={columnFilter[col.key] || 'ALL'}
              onChange={(e) => setColumnFilter({ ...columnFilter, [col.key]: e.target.value })}
              style={{ background: '#1e293b', border: '1px solid #334155', color: '#cbd5e1', padding: '0.5rem 0.75rem', borderRadius: '8px', fontSize: '0.85rem' }}
            >
              <option value="ALL">All {col.header}s</option>
              {col.filterOptions?.map(opt => (
                <option key={opt} value={opt}>{opt.replace('_', ' ')}</option>
              ))}
            </select>
          ))}

          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowColMenu(!showColMenu)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#1e293b', border: '1px solid #334155', color: '#94a3b8', padding: '0.5rem 0.75rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem' }}
            >
              <Eye size={15} /> Columns
            </button>
            {showColMenu && (
              <div style={{ position: 'absolute', right: 0, top: '100%', marginTop: '0.4rem', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '0.5rem', zIndex: 50, minWidth: '160px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
                {columns.map(col => (
                  <label key={col.key} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.35rem 0.5rem', cursor: 'pointer', fontSize: '0.85rem', color: '#cbd5e1' }}>
                    <input
                      type="checkbox"
                      checked={visibleColumns.has(col.key)}
                      onChange={() => {
                        const newCols = new Set(visibleColumns);
                        if (newCols.has(col.key)) newCols.delete(col.key);
                        else newCols.add(col.key);
                        setVisibleColumns(newCols);
                      }}
                    />
                    {col.header}
                  </label>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bulk actions bar */}
      {selectedIds.size > 0 && bulkActions && bulkActions.length > 0 && (
        <div style={{ background: '#1e293b', border: '1px solid #38bdf8', padding: '0.6rem 1rem', borderRadius: '8px', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '0.875rem', color: '#38bdf8', fontWeight: 500 }}>
            {selectedIds.size} row(s) selected
          </span>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            {bulkActions.map((action, idx) => (
              <button
                key={idx}
                onClick={() => {
                  const selectedRows = data.filter(r => selectedIds.has(keyExtractor(r)));
                  action.onClick(selectedRows);
                }}
                style={{
                  background: action.variant === 'danger' ? '#ef4444' : action.variant === 'success' ? '#10b981' : '#0284c7',
                  border: 'none',
                  color: '#ffffff',
                  padding: '0.4rem 0.85rem',
                  borderRadius: '6px',
                  cursor: 'pointer',
                  fontSize: '0.825rem',
                  fontWeight: 500
                }}
              >
                {action.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Table Container */}
      <div style={{ overflowX: 'auto', borderRadius: '8px', border: '1px solid #1e293b' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
          <thead>
            <tr style={{ background: '#1e293b', color: '#94a3b8', borderBottom: '1px solid #334155' }}>
              {bulkActions && (
                <th style={{ width: '40px', padding: '0.75rem 1rem' }}>
                  <button 
                    onClick={handleSelectAll} 
                    style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex' }}
                  >
                    {selectedIds.size === paginatedData.length && paginatedData.length > 0 ? (
                      <CheckSquare size={17} color="#38bdf8" />
                    ) : (
                      <Square size={17} />
                    )}
                  </button>
                </th>
              )}

              {columns.filter(c => visibleColumns.has(c.key)).map(col => (
                <th
                  key={col.key}
                  onClick={() => col.sortable !== false && toggleSort(col.key)}
                  style={{
                    padding: '0.75rem 1rem',
                    fontWeight: 600,
                    cursor: col.sortable !== false ? 'pointer' : 'default',
                    userSelect: 'none',
                    whiteSpace: 'nowrap'
                  }}
                >
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
                    {col.header}
                    {col.sortable !== false && sortKey === col.key && (
                      sortOrder === 'asc' ? <ChevronUp size={14} color="#38bdf8" /> : <ChevronDown size={14} color="#38bdf8" />
                    )}
                  </div>
                </th>
              ))}

              {rowActions && rowActions.length > 0 && (
                <th style={{ width: '80px', padding: '0.75rem 1rem', textAlign: 'right' }}>Actions</th>
              )}
            </tr>
          </thead>
          <tbody>
            {paginatedData.length === 0 ? (
              <tr>
                <td 
                  colSpan={columns.filter(c => visibleColumns.has(c.key)).length + (bulkActions ? 1 : 0) + (rowActions ? 1 : 0)}
                  style={{ padding: '3rem 1rem', textAlign: 'center', color: '#64748b' }}
                >
                  No records matching search or filter criteria.
                </td>
              </tr>
            ) : (
              paginatedData.map((row) => {
                const id = keyExtractor(row);
                const isSelected = selectedIds.has(id);
                return (
                  <tr
                    key={id}
                    onClick={() => onRowClick && onRowClick(row)}
                    style={{
                      borderBottom: '1px solid #1e293b',
                      background: isSelected ? 'rgba(56, 189, 248, 0.08)' : 'transparent',
                      cursor: onRowClick ? 'pointer' : 'default',
                      transition: 'background 0.15s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = isSelected ? 'rgba(56, 189, 248, 0.12)' : 'rgba(255,255,255,0.02)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = isSelected ? 'rgba(56, 189, 248, 0.08)' : 'transparent'}
                  >
                    {bulkActions && (
                      <td style={{ padding: '0.75rem 1rem' }} onClick={(e) => handleSelectRow(id, e)}>
                        {isSelected ? <CheckSquare size={17} color="#38bdf8" /> : <Square size={17} color="#64748b" />}
                      </td>
                    )}

                    {columns.filter(c => visibleColumns.has(c.key)).map(col => {
                      const val = col.accessor ? col.accessor(row) : row[col.key];
                      return (
                        <td key={col.key} style={{ padding: '0.75rem 1rem', color: '#e2e8f0', whiteSpace: 'nowrap' }}>
                          {col.render ? col.render(val, row) : (
                            typeof val === 'boolean' ? (
                              <Badge variant={val ? 'success' : 'neutral'}>{val ? 'Active' : 'Inactive'}</Badge>
                            ) : (
                              val ?? '-'
                            )
                          )}
                        </td>
                      );
                    })}

                    {rowActions && rowActions.length > 0 && (
                      <td style={{ padding: '0.75rem 1rem', textAlign: 'right', position: 'relative' }} onClick={(e) => e.stopPropagation()}>
                        <button
                          onClick={() => setActiveMenuRowId(activeMenuRowId === id ? null : id)}
                          style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', padding: '0.25rem' }}
                        >
                          <MoreVertical size={16} />
                        </button>

                        {activeMenuRowId === id && (
                          <div style={{ position: 'absolute', right: '1rem', top: '80%', background: '#0f172a', border: '1px solid #334155', borderRadius: '8px', padding: '0.4rem', zIndex: 60, minWidth: '140px', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
                            {rowActions.map((act, idx) => (
                              <button
                                key={idx}
                                onClick={() => {
                                  act.onClick(row);
                                  setActiveMenuRowId(null);
                                }}
                                style={{
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '0.5rem',
                                  width: '100%',
                                  padding: '0.45rem 0.65rem',
                                  background: 'none',
                                  border: 'none',
                                  color: act.variant === 'danger' ? '#f87171' : act.variant === 'success' ? '#34d399' : '#cbd5e1',
                                  textAlign: 'left',
                                  fontSize: '0.825rem',
                                  cursor: 'pointer',
                                  borderRadius: '4px'
                                }}
                                onMouseEnter={(e) => e.currentTarget.style.background = '#1e293b'}
                                onMouseLeave={(e) => e.currentTarget.style.background = 'none'}
                              >
                                {act.icon} {act.label}
                              </button>
                            ))}
                          </div>
                        )}
                      </td>
                    )}
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
          Showing {sortedData.length > 0 ? (currentPage - 1) * pageSize + 1 : 0} to {Math.min(currentPage * pageSize, sortedData.length)} of {sortedData.length} entries
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <select
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); setCurrentPage(1); }}
            style={{ background: '#1e293b', border: '1px solid #334155', color: '#cbd5e1', padding: '0.35rem 0.5rem', borderRadius: '6px', fontSize: '0.85rem' }}
          >
            <option value={5}>5 / page</option>
            <option value={10}>10 / page</option>
            <option value={25}>25 / page</option>
            <option value={50}>50 / page</option>
            <option value={100}>100 / page</option>
          </select>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              style={{ background: '#1e293b', border: '1px solid #334155', color: currentPage === 1 ? '#475569' : '#cbd5e1', padding: '0.35rem 0.5rem', borderRadius: '6px', cursor: currentPage === 1 ? 'default' : 'pointer' }}
            >
              <ChevronLeft size={16} />
            </button>
            <span style={{ fontSize: '0.85rem', color: '#cbd5e1', padding: '0 0.5rem' }}>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              style={{ background: '#1e293b', border: '1px solid #334155', color: currentPage === totalPages ? '#475569' : '#cbd5e1', padding: '0.35rem 0.5rem', borderRadius: '6px', cursor: currentPage === totalPages ? 'default' : 'pointer' }}
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
