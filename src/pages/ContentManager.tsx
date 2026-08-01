import React, { useEffect, useState } from 'react';
import { api } from '../api/client';
import { CmsContentItem } from '../types';
import { DataTable, Column, RowAction } from '../components/DataTable';
import { Badge } from '../components/Badge';
import { Plus, Edit, Trash } from 'lucide-react';
import { Modal } from '../components/Modal';
import { toast } from '../store/toastStore';

export const ContentManager: React.FC = () => {
  const [content, setContent] = useState<CmsContentItem[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingContent, setEditingContent] = useState<CmsContentItem | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const loadContent = () => {
    api.getCmsContent().then(setContent);
  };

  useEffect(() => {
    loadContent();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingContent) return;
    setIsSubmitting(true);
    try {
      await api.upsertContentItem({
        key: editingContent.key,
        content_type: editingContent.contentType,
        body_en: editingContent.bodyEn,
        body_ta: editingContent.bodyTa,
        body_hi: editingContent.bodyHi,
        published: editingContent.published,
      });
      toast.success(editingContent.id ? 'Content updated successfully' : 'Content created successfully');
      setIsModalOpen(false);
      loadContent();
    } catch {
      // Error toast already shown by the global API error interceptor.
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this content item?')) return;
    try {
      await api.deleteContentItem(id);
      setContent(prev => prev.filter(c => c.id !== id));
      toast.success('Content deleted');
    } catch {
      // Error toast already shown by the global API error interceptor.
    }
  };

  const columns: Column<CmsContentItem>[] = [
    { key: 'key', header: 'Content Key', sortable: true, render: (val) => <span style={{ fontWeight: 600, color: '#38bdf8' }}>{val}</span> },
    { key: 'contentType', header: 'Type', render: (val) => <Badge variant="info">{val.replace('_', ' ')}</Badge> },
    { key: 'bodyEn', header: 'English (EN)', render: (val) => val || '-' },
    { key: 'bodyTa', header: 'Tamil (TA)', render: (val) => <span style={{ color: '#38bdf8' }}>{val || '-'}</span> },
    { key: 'bodyHi', header: 'Hindi (HI)', render: (val) => <span style={{ color: '#fbbf24' }}>{val || '-'}</span> },
    { key: 'published', header: 'Status', render: (val) => <Badge variant={val ? 'success' : 'neutral'}>{val ? 'Published' : 'Draft'}</Badge> },
  ];

  const rowActions: RowAction<CmsContentItem>[] = [
    { label: 'Edit Content', icon: <Edit size={15} />, onClick: (row) => { setEditingContent(row); setIsModalOpen(true); } },
    { label: 'Delete Content', icon: <Trash size={15} />, variant: 'danger', onClick: (row) => handleDelete(row.id) }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <button
          onClick={() => {
            setEditingContent({ id: '', contentType: 'language_string', key: '', bodyEn: '', bodyTa: '', bodyHi: '', published: true, updatedAt: '' });
            setIsModalOpen(true);
          }}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#38bdf8', color: '#0f172a', border: 'none', padding: '0.6rem 1rem', borderRadius: '8px', fontWeight: 600, cursor: 'pointer' }}
        >
          <Plus size={18} /> New Content
        </button>
      </div>

      <DataTable
        title="CMS & Multi-Language String Translations"
        subtitle="Manage dynamic help articles, in-app announcements, and externalized i18n language string resources (FR-12.8)."
        columns={columns}
        data={content}
        keyExtractor={(item) => item.id}
        searchPlaceholder="Search key, translation text..."
        rowActions={rowActions}
      />

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingContent?.id ? 'Edit Content' : 'Create Content'}>
        <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.875rem' }}>Content Type</label>
            <select value={editingContent?.contentType || 'language_string'} onChange={(e) => setEditingContent(prev => prev ? { ...prev, contentType: e.target.value as any } : null)} style={{ width: '100%', padding: '0.6rem', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#f8fafc' }}>
              <option value="language_string">Language String</option>
              <option value="announcement">Announcement</option>
              <option value="help_article">Help Article</option>
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.875rem' }}>Key (Unique ID)</label>
            <input required disabled={!!editingContent?.id} value={editingContent?.key || ''} onChange={(e) => setEditingContent(prev => prev ? { ...prev, key: e.target.value } : null)} style={{ width: '100%', padding: '0.6rem', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#f8fafc' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.875rem' }}>English Translation (EN)</label>
            <textarea value={editingContent?.bodyEn || ''} onChange={(e) => setEditingContent(prev => prev ? { ...prev, bodyEn: e.target.value } : null)} rows={3} style={{ width: '100%', padding: '0.6rem', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#f8fafc', resize: 'vertical' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.875rem' }}>Tamil Translation (TA)</label>
            <textarea value={editingContent?.bodyTa || ''} onChange={(e) => setEditingContent(prev => prev ? { ...prev, bodyTa: e.target.value } : null)} rows={3} style={{ width: '100%', padding: '0.6rem', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#f8fafc', resize: 'vertical' }} />
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '0.4rem', fontSize: '0.875rem' }}>Hindi Translation (HI)</label>
            <textarea value={editingContent?.bodyHi || ''} onChange={(e) => setEditingContent(prev => prev ? { ...prev, bodyHi: e.target.value } : null)} rows={3} style={{ width: '100%', padding: '0.6rem', background: '#1e293b', border: '1px solid #334155', borderRadius: '6px', color: '#f8fafc', resize: 'vertical' }} />
          </div>

          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <input type="checkbox" checked={editingContent?.published || false} onChange={(e) => setEditingContent(prev => prev ? { ...prev, published: e.target.checked } : null)} />
            Published
          </label>
          <button type="submit" disabled={isSubmitting} style={{ marginTop: '1rem', background: '#38bdf8', color: '#0f172a', border: 'none', padding: '0.75rem', borderRadius: '8px', fontWeight: 600, cursor: isSubmitting ? 'not-allowed' : 'pointer', opacity: isSubmitting ? 0.7 : 1 }}>
            {isSubmitting ? 'Saving...' : 'Save Content'}
          </button>
        </form>
      </Modal>
    </div>
  );
};
