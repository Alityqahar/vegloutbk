// src/components/admin/ContentManagement.jsx - WITH DELETE FEATURE
import { memo, useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import Swal from 'sweetalert2';
import styles from './AdminComponents.module.css';

const CONTENT_TYPES = {
  materi: [
    { table: 'materi_lbe', label: 'LBE' },
    { table: 'materi_lbi', label: 'LBI' },
    { table: 'materi_pk', label: 'PK' },
    { table: 'materi_pm', label: 'PM' },
    { table: 'materi_ppu', label: 'PPU' },
    { table: 'materi_pu', label: 'PU' },
    { table: 'materi_pbm', label: 'PBM' }
  ],
  latsol: [
    { table: 'latsol_lbe', label: 'LBE' },
    { table: 'latsol_lbi', label: 'LBI' },
    { table: 'latsol_pk', label: 'PK' },
    { table: 'latsol_pm', label: 'PM' },
    { table: 'latsol_ppu', label: 'PPU' },
    { table: 'latsol_pu', label: 'PU' },
    { table: 'latsol_pbm', label: 'PBM' }
  ]
};

/* ================= HELPER FUNCTIONS ================= */
function getDisplayUploader(uploader, isAdminContent) {
  if (isAdminContent) return 'Admin';
  return uploader || 'Pengguna';
}

// Component for Notes with Delete
const NoteItem = memo(({ note, uploader, onDelete }) => {
  const timeAgo = (date) => {
    const now = new Date();
    const diff = Math.floor((now - new Date(date)) / 1000);
    if (diff < 60) return 'Baru saja';
    if (diff < 3600) return `${Math.floor(diff / 60)}m yang lalu`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h yang lalu`;
    return new Date(date).toLocaleDateString('id-ID');
  };

  // Fallback ke "User" jika uploader tidak tersedia
  const displayUploader = uploader || 'User';

  return (
    <div className={styles.contentCard}>
      <div className={styles.contentHeader}>
        <div className={styles.contentInfo}>
          <p className={styles.contentDesc} style={{ 
            WebkitLineClamp: 'unset',
            display: 'block',
            whiteSpace: 'pre-wrap',
            marginBottom: 'var(--spacing-sm)'
          }}>
            {note.content}
          </p>
          <div className={styles.contentMeta}>
            <span className={styles.metaBadge}>
              👤 {displayUploader}
            </span>
            <span className={styles.metaBadge}>
              ⏱ {timeAgo(note.created_at)}
            </span>
          </div>
        </div>
        <button
          className={styles.deleteBtn}
          onClick={() => onDelete(note.id, note.content)}
          title="Hapus note"
        >
          🗑
        </button>
      </div>
    </div>
  );
});

NoteItem.displayName = 'NoteItem';

// Component for Materi/Latsol with Delete
const ContentItem = memo(({ item, tableName, uploader, userRole, onDelete }) => {
  const isAdminContent = userRole === 'admin';
  const displayUploader = getDisplayUploader(uploader, isAdminContent);

  return (
    <div className={styles.contentCard}>
      <div className={styles.contentHeader}>
        <div className={styles.contentInfo}>
          <h4 className={styles.contentTitle}>{item.title}</h4>
          <p className={styles.contentDesc}>{item.description}</p>
          <div className={styles.contentMeta}>
            <span className={styles.metaBadge}>
              📁 {tableName}
            </span>
            <span className={styles.metaBadge}>
              👤 {displayUploader}
            </span>
            <span className={styles.metaBadge}>
              📅 {new Date(item.created_at).toLocaleDateString('id-ID')}
            </span>
          </div>
        </div>
        <button
          className={styles.deleteBtn}
          onClick={() => onDelete(item.id, item.title, item.file_path)}
          title="Hapus konten"
        >
          🗑
        </button>
      </div>
    </div>
  );
});

ContentItem.displayName = 'ContentItem';

export default memo(function ContentManagement() {
  const [activeType, setActiveType] = useState('materi');
  const [activeTable, setActiveTable] = useState('materi_lbe');
  const [contents, setContents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ total: 0 });

  // Fetch function for Notes
  const fetchNotes = useCallback(async () => {
    setLoading(true);
    try {
      const { data: notesData, error: notesError } = await supabase
        .from('notes')
        .select('*')
        .order('created_at', { ascending: false });

      if (notesError) throw notesError;

      const notesWithUsernames = await Promise.all(
        (notesData || []).map(async (note) => {
          try {
            const { data: profile } = await supabase
              .from('profiles')
              .select('username')
              .eq('id', note.user_id)
              .single();

            return {
              ...note,
              uploader: profile?.username || 'Pengguna'
            };
          } catch {
            return {
              ...note,
              uploader: 'Pengguna'
            };
          }
        })
      );

      setContents(notesWithUsernames);
      setStats({ total: notesWithUsernames.length });
    } catch (err) {
      console.error('Error fetching notes:', err);
      setContents([]);
      setStats({ total: 0 });
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch function for Materi/Latsol
  const fetchContents = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from(activeTable)
        .select(`
          *,
          profiles(username, role)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const processedData = data.map(item => ({
        ...item,
        uploader: item.profiles?.username || 'Pengguna',
        userRole: item.profiles?.role || 'user'
      }));

      setContents(processedData);
      setStats({ total: processedData.length });
    } catch (err) {
      console.error('Error fetching contents:', err);
      setContents([]);
      setStats({ total: 0 });
    } finally {
      setLoading(false);
    }
  }, [activeTable]);

  // Conditional fetching based on type
  useEffect(() => {
    if (activeType === 'notes') {
      fetchNotes();
    } else {
      fetchContents();
    }
  }, [activeType, activeTable, fetchContents, fetchNotes]);

  // Delete function for Notes
  const handleDeleteNote = async (id, content) => {
    const result = await Swal.fire({
      title: 'Hapus Note?',
      html: `Apakah Anda yakin ingin menghapus note ini?<br/><br/><em>"${content.substring(0, 50)}${content.length > 50 ? '...' : ''}"</em>`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e74c3c',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      try {
        const { error } = await supabase
          .from('notes')
          .delete()
          .eq('id', id);

        if (error) throw error;

        await fetchNotes();

        Swal.fire({
          icon: 'success',
          title: 'Terhapus!',
          text: 'Note berhasil dihapus',
          timer: 1500,
          showConfirmButton: false
        });
      } catch (err) {
        console.error('Error deleting note:', err);
        Swal.fire({
          icon: 'error',
          title: 'Gagal Menghapus',
          text: err.message,
          confirmButtonColor: '#007bff'
        });
      }
    }
  };

  // Delete function for Materi/Latsol
  const handleDeleteContent = async (id, title, filePath) => {
    const result = await Swal.fire({
      title: 'Hapus Konten?',
      html: `Apakah Anda yakin ingin menghapus:<br/><strong>${title}</strong>?<br/><br/>File PDF juga akan dihapus dari storage.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e74c3c',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal',
      reverseButtons: true
    });

    if (result.isConfirmed) {
      try {
        // Delete file from storage if exists
        if (filePath) {
          const { error: storageError } = await supabase.storage
            .from('documents')
            .remove([filePath]);

          if (storageError) {
            console.warn('Storage deletion warning:', storageError);
          }
        }

        // Delete from database
        const { error: dbError } = await supabase
          .from(activeTable)
          .delete()
          .eq('id', id);

        if (dbError) throw dbError;

        await fetchContents();

        Swal.fire({
          icon: 'success',
          title: 'Terhapus!',
          text: 'Konten berhasil dihapus',
          timer: 1500,
          showConfirmButton: false
        });
      } catch (err) {
        console.error('Error deleting content:', err);
        Swal.fire({
          icon: 'error',
          title: 'Gagal Menghapus',
          text: err.message,
          confirmButtonColor: '#007bff'
        });
      }
    }
  };

  const handleTypeChange = (type) => {
    setActiveType(type);
    if (type !== 'notes') {
      setActiveTable(CONTENT_TYPES[type][0].table);
    }
  };

  const handleTableChange = (table) => {
    setActiveTable(table);
  };

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h3 className={styles.sectionTitle}>Manajemen Konten</h3>
      </div>

      <div className={styles.contentTypeNav}>
        <button
          className={`${styles.typeBtn} ${activeType === 'materi' ? styles.typeBtnActive : ''}`}
          onClick={() => handleTypeChange('materi')}
        >
          📚 Materi
        </button>
        <button
          className={`${styles.typeBtn} ${activeType === 'latsol' ? styles.typeBtnActive : ''}`}
          onClick={() => handleTypeChange('latsol')}
        >
          📝 Latihan Soal
        </button>
        <button
          className={`${styles.typeBtn} ${activeType === 'notes' ? styles.typeBtnActive : ''}`}
          onClick={() => handleTypeChange('notes')}
        >
          📋 Notes
        </button>
      </div>

      {activeType !== 'notes' && (
        <div className={styles.subtypeNav}>
          {CONTENT_TYPES[activeType].map(({ table, label }) => (
            <button
              key={table}
              className={`${styles.subtypeBtn} ${activeTable === table ? styles.subtypeBtnActive : ''}`}
              onClick={() => handleTableChange(table)}
            >
              {label}
            </button>
          ))}
        </div>
      )}

      <div className={styles.statsBar}>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Total Konten</span>
          <span className={styles.statValue}>{stats.total}</span>
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>Memuat konten...</div>
      ) : contents.length === 0 ? (
        <div className={styles.empty}>Belum ada konten</div>
      ) : (
        <div className={styles.contentGrid}>
          {activeType === 'notes' ? (
            contents.map(note => (
              <NoteItem
                key={note.id}
                note={note}
                uploader={note.uploader}
                onDelete={handleDeleteNote}
              />
            ))
          ) : (
            contents.map(item => (
              <ContentItem
                key={item.id}
                item={item}
                tableName={activeTable}
                uploader={item.uploader}
                userRole={item.userRole}
                onDelete={handleDeleteContent}
              />
            ))
          )}
        </div>
      )}
    </div>
  );
});