// src/components/admin/AnnouncementManagement.jsx
import { memo, useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import Swal from 'sweetalert2';
import styles from './AdminComponents.module.css';

const AnnouncementModal = memo(({ open, onClose, onSubmit, initialData, loading }) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  useEffect(() => {
    if (open) {
      setTitle(initialData?.title || '');
      setContent(initialData?.content || '');
    }
  }, [open, initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Data tidak lengkap',
        text: 'Judul dan konten harus diisi',
        confirmButtonColor: '#007bff'
      });
      return;
    }
    onSubmit({ id: initialData?.id, title: title.trim(), content: content.trim() });
  };

  if (!open) return null;

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.modalClose} onClick={onClose}>×</button>
        <h3 className={styles.modalTitle}>
          {initialData ? 'Edit Pengumuman' : 'Tambah Pengumuman'}
        </h3>

        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Judul Pengumuman</label>
            <input
              className={styles.input}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Pembaruan Sistem"
              required
              disabled={loading}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Konten</label>
            <textarea
              className={styles.textarea}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Isi pengumuman..."
              required
              disabled={loading}
              rows={6}
            />
          </div>

          <div className={styles.modalActions}>
            <button
              type="button"
              className={styles.btnCancel}
              onClick={onClose}
              disabled={loading}
            >
              Batal
            </button>
            <button
              type="submit"
              className={styles.btnSubmit}
              disabled={loading}
            >
              {loading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

AnnouncementModal.displayName = 'AnnouncementModal';

const AnnouncementItem = memo(({ announcement, onEdit, onDelete }) => {
  return (
    <div className={styles.announcementCard}>
      <div className={styles.announcementHeader}>
        <h4 className={styles.announcementTitle}>{announcement.title}</h4>
        <div className={styles.announcementActions}>
          <button
            className={styles.iconBtn}
            onClick={() => onEdit(announcement)}
            title="Edit"
          >
            ✎
          </button>
          <button
            className={styles.iconBtnDel}
            onClick={() => onDelete(announcement.id)}
            title="Hapus"
          >
            🗑
          </button>
        </div>
      </div>
      <p className={styles.announcementContent}>{announcement.content}</p>
      <div className={styles.announcementFooter}>
        <span className={styles.announcementDate}>
          {new Date(announcement.created_at).toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })}
        </span>
      </div>
    </div>
  );
});

AnnouncementItem.displayName = 'AnnouncementItem';

export default memo(function AnnouncementManagement() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [saving, setSaving] = useState(false);

  const fetchAnnouncements = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setAnnouncements(data || []);
    } catch (err) {
      console.error('Error fetching announcements:', err);
      Swal.fire({
        icon: 'error',
        title: 'Gagal Memuat Pengumuman',
        text: err.message,
        confirmButtonColor: '#007bff'
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAnnouncements();
  }, [fetchAnnouncements]);

  const handleSubmit = async (payload) => {
    setSaving(true);
    try {
      if (payload.id) {
        // Update
        const { error } = await supabase
          .from('announcements')
          .update({ title: payload.title, content: payload.content })
          .eq('id', payload.id);

        if (error) throw error;
      } else {
        // Insert
        const { error } = await supabase
          .from('announcements')
          .insert({ title: payload.title, content: payload.content });

        if (error) throw error;
      }

      await fetchAnnouncements();
      setModalOpen(false);
      setEditData(null);

      Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: payload.id ? 'Pengumuman berhasil diperbarui' : 'Pengumuman berhasil ditambahkan',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (err) {
      console.error('Error saving announcement:', err);
      Swal.fire({
        icon: 'error',
        title: 'Gagal Menyimpan',
        text: err.message,
        confirmButtonColor: '#007bff'
      });
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Hapus Pengumuman?',
      text: 'Pengumuman yang dihapus tidak dapat dikembalikan',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e74c3c',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      try {
        const { error } = await supabase
          .from('announcements')
          .delete()
          .eq('id', id);

        if (error) throw error;

        await fetchAnnouncements();

        Swal.fire({
          icon: 'success',
          title: 'Terhapus!',
          text: 'Pengumuman berhasil dihapus',
          timer: 1500,
          showConfirmButton: false
        });
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Gagal Menghapus',
          text: err.message,
          confirmButtonColor: '#007bff'
        });
      }
    }
  };

  const handleEdit = (announcement) => {
    setEditData(announcement);
    setModalOpen(true);
  };

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h3 className={styles.sectionTitle}>Kelola Pengumuman</h3>
        <button
          className={styles.addBtn}
          onClick={() => {
            setEditData(null);
            setModalOpen(true);
          }}
        >
          + Tambah Pengumuman
        </button>
      </div>

      {loading ? (
        <div className={styles.loading}>Memuat pengumuman...</div>
      ) : announcements.length === 0 ? (
        <div className={styles.empty}>Belum ada pengumuman</div>
      ) : (
        <div className={styles.announcementList}>
          {announcements.map(announcement => (
            <AnnouncementItem
              key={announcement.id}
              announcement={announcement}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <AnnouncementModal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditData(null);
        }}
        onSubmit={handleSubmit}
        initialData={editData}
        loading={saving}
      />
    </div>
  );
});