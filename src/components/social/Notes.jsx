import { memo, useState, useEffect, useCallback } from 'react';
import styles from './social.module.css';
import { supabase } from '../../lib/supabase';
import Swal from 'sweetalert2';
import PremiumUpgradeModal from '../PremiumUpgradeModal/PremiumUpgradeModal';

// ==================== PREMIUM CTA BANNER ====================
const PremiumBanner = memo(({ onUpgradeClick, onLoginClick }) => (
  <div className={styles.premiumBanner}>
    <div className={styles.bannerContent}>
      <div className={styles.bannerIcon}>⭐</div>
      <div className={styles.bannerText}>
        <h4 className={styles.bannerTitle}>Fitur Premium</h4>
        <p className={styles.bannerDesc}>
          Bagikan notes dengan member lain dan akses penuh semua fitur eksklusif
        </p>
      </div>
      <div className={styles.bannerActions}>
        <button 
          className={styles.bannerBtnPrimary}
          onClick={onUpgradeClick}
        >
          Upgrade Sekarang
        </button>
      </div>
    </div>
  </div>
));

PremiumBanner.displayName = 'PremiumBanner';

// ==================== NOTES MODAL ====================
const NotesModal = memo(({ open, onClose, onSubmit, loading }) => {
  const [content, setContent] = useState('');

  const handleSubmit = useCallback((e) => {
    e.preventDefault();
    if (!content.trim()) {
      Swal.fire({
        icon: 'warning',
        title: 'Konten tidak boleh kosong',
        confirmButtonColor: '#007bff'
      });
      return;
    }
    onSubmit(content.trim());
    setContent('');
  }, [content, onSubmit]);

  useEffect(() => {
    if (!open) setContent('');
  }, [open]);

  if (!open) return null;

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        <button className={styles.modalClose} onClick={onClose}>×</button>
        <h3 className={styles.modalTitle}>Bagikan Notes</h3>
        <p style={{ fontSize: '0.9rem', color: '#666', margin: '0 0 1rem 0' }}>
          Note ini akan hilang setelah 24 jam
        </p>
        
        <form onSubmit={handleSubmit} className={styles.modalForm}>
          <textarea
            className={styles.notesInput}
            placeholder="Apa yang ingin Anda bagikan?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            maxLength={280}
            rows={5}
            disabled={loading}
            required
          />
          
          <div className={styles.charCount}>
            {content.length}/280
          </div>

          <div className={styles.modalActions}>
            <button type="button" className={styles.btnCancel} onClick={onClose} disabled={loading}>
              Batal
            </button>
            <button type="submit" className={styles.btnSubmit} disabled={loading}>
              {loading ? 'Mengirim...' : 'Kirim'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
});

NotesModal.displayName = 'NotesModal';

// ==================== HELPER FUNCTIONS ====================
function getTimeRemaining(createdAt) {
  const now = new Date();
  const created = new Date(createdAt);
  const expiresAt = new Date(created.getTime() + 24 * 60 * 60 * 1000);
  const remaining = expiresAt - now;

  if (remaining <= 0) return null;

  const hours = Math.floor(remaining / (1000 * 60 * 60));
  const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));

  return { hours, minutes, expiresAt };
}

function getTimeAgo(date) {
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);
  
  if (diff < 60) return 'Baru saja';
  if (diff < 3600) return `${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  if (diff < 604800) return `${Math.floor(diff / 86400)}d`;
  return date.toLocaleDateString();
}

// ==================== NOTE ITEM COMPONENT ====================
const NoteItem = memo(({ note, onDelete, canDelete }) => {
  const createdAt = new Date(note.created_at);
  const timeAgo = getTimeAgo(createdAt);
  const remaining = getTimeRemaining(note.created_at);

  if (!remaining) return null;

  const { hours, minutes } = remaining;
  const expiresText = hours > 0 
    ? `Hilang dalam ${hours}h ${minutes}m` 
    : `Hilang dalam ${minutes}m`;

  return (
    <div className={styles.noteCard}>
      <div className={styles.noteHeader}>
        <div className={styles.noteUser}>
          <div className={styles.noteAvatar}>
            {note.username?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <div className={styles.noteUsername}>{note.username || 'Pengguna'}</div>
            <div className={styles.noteTime}>{timeAgo}</div>
          </div>
        </div>
        {canDelete && (
          <button
            className={styles.deleteBtn}
            onClick={() => onDelete(note.id)}
            title="Hapus note"
          >
            ×
          </button>
        )}
      </div>
      <p className={styles.noteContent}>{note.content}</p>
      <div className={styles.noteExpiry}>
        ⏱ {expiresText}
      </div>
    </div>
  );
});

NoteItem.displayName = 'NoteItem';

// ==================== MAIN NOTES COMPONENT ====================
export default memo(function Notes({ userId, canAdd, requiresLogin }) {
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataReady, setDataReady] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [premiumModalOpen, setPremiumModalOpen] = useState(false);

  // Get current user info
  useEffect(() => {
    let mounted = true;

    supabase.auth.getUser().then(({ data }) => {
      if (mounted) setCurrentUser(data?.user);
    });

    return () => { mounted = false; };
  }, []);

  // Fetch notes
  useEffect(() => {
    let mounted = true;

    const fetchNotes = async () => {
      try {
        const { data, error } = await supabase
          .from('notes')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);

        if (error) {
          console.error('Fetch error:', error);
          throw error;
        }

        if (mounted && data) {
          const notesWithUsername = await Promise.all(
            data.map(async (note) => {
              try {
                const { data: profile } = await supabase
                  .from('profiles')
                  .select('username')
                  .eq('id', note.user_id)
                  .single();

                return {
                  ...note,
                  username: profile?.username || 'Pengguna'
                };
              } catch {
                return {
                  ...note,
                  username: 'Pengguna'
                };
              }
            })
          );

          setNotes(
            notesWithUsername.filter(note => {
              const remaining = getTimeRemaining(note.created_at);
              return remaining !== null;
            })
          );
        }
        if (mounted) setDataReady(true);
      } catch (err) {
        console.error('Error fetching notes:', err);
        if (mounted) setDataReady(true);
      }
    };

    setLoading(true);
    fetchNotes().finally(() => setLoading(false));

    return () => { mounted = false; };
  }, []);

  // Auto-refresh setiap 1 menit
  useEffect(() => {
    const interval = setInterval(async () => {
      try {
        const { data, error } = await supabase
          .from('notes')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(10);

        if (!error && data) {
          const notesWithUsername = await Promise.all(
            data.map(async (note) => {
              try {
                const { data: profile } = await supabase
                  .from('profiles')
                  .select('username')
                  .eq('id', note.user_id)
                  .single();

                return {
                  ...note,
                  username: profile?.username || 'Pengguna'
                };
              } catch {
                return {
                  ...note,
                  username: 'Pengguna'
                };
              }
            })
          );

          setNotes(
            notesWithUsername.filter(note => {
              const remaining = getTimeRemaining(note.created_at);
              return remaining !== null;
            })
          );
        }
      } catch (err) {
        console.error('Auto-refresh error:', err);
      }
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  // ==================== EVENT HANDLERS ====================

  const handleAddNoteClick = useCallback(() => {
    if (requiresLogin) {
      Swal.fire({
        icon: 'info',
        title: 'Login Diperlukan',
        text: 'Silakan login terlebih dahulu untuk menambahkan notes',
        confirmButtonColor: '#007bff'
      });
      return;
    }

    if (!canAdd) {
      setPremiumModalOpen(true);
      return;
    }

    setModalOpen(true);
  }, [canAdd, requiresLogin]);

  const handleAddNote = useCallback(async (content) => {
    if (!userId || !currentUser) return;

    // Double-check role pada client-side
    if (!canAdd) {
      Swal.fire({
        icon: 'error',
        title: 'Akses Ditolak',
        text: 'Hanya member premium yang dapat menambahkan notes',
        confirmButtonColor: '#007bff'
      });
      return;
    }

    setSubmitting(true);

    try {
      const { error } = await supabase.from('notes').insert({
        user_id: userId,
        content
      });

      if (error) throw error;

      const username = 
        currentUser.user_metadata?.full_name || 
        currentUser.email?.split('@')[0] || 
        'Pengguna';

      const newNote = {
        id: Date.now(),
        user_id: userId,
        content,
        created_at: new Date().toISOString(),
        username
      };

      setNotes(prev => [newNote, ...prev]);
      setModalOpen(false);

      Swal.fire({
        icon: 'success',
        title: 'Notes berhasil dibagikan!',
        text: 'Note ini akan hilang setelah 24 jam',
        timer: 1500,
        showConfirmButton: false
      });
    } catch (err) {
      console.error('Add note error:', err);
      Swal.fire({
        icon: 'error',
        title: 'Gagal menambah notes',
        text: err.message || 'Silakan coba lagi',
        confirmButtonColor: '#007bff'
      });
    } finally {
      setSubmitting(false);
    }
  }, [userId, currentUser, canAdd]);

  const handleDeleteNote = useCallback(async (id) => {
    const result = await Swal.fire({
      title: 'Hapus notes?',
      text: 'Notes yang dihapus tidak dapat dikembalikan.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#e74c3c',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Ya, Hapus!',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      try {
        const { error } = await supabase.from('notes').delete().eq('id', id);
        if (error) throw error;

        setNotes(prev => prev.filter(n => n.id !== id));

        Swal.fire({
          icon: 'success',
          title: 'Notes terhapus',
          timer: 1200,
          showConfirmButton: false
        });
      } catch (err) {
        Swal.fire({
          icon: 'error',
          title: 'Gagal menghapus notes',
          confirmButtonColor: '#007bff'
        });
      }
    }
  }, []);

  return (
    <section className={styles.notesSection}>
      <div className={styles.notesSectionHeader}>
        <h3 className={styles.sectionTitle}>Notes</h3>
        <button
          className={`${styles.addNotesBtn} ${!canAdd && !requiresLogin ? styles.addNotesBtnDisabled : ''}`}
          onClick={handleAddNoteClick}
          disabled={!canAdd && !requiresLogin}
          title={!canAdd && !requiresLogin ? 'Hanya member premium yang dapat menambahkan notes' : undefined}
        >
          + Bagikan
        </button>
      </div>

      {/* Premium Banner untuk user biasa */}
      {!canAdd && !requiresLogin && (
        <PremiumBanner 
          onUpgradeClick={() => setPremiumModalOpen(true)}
          onLoginClick={() => window.location.href = '/login'}
        />
      )}

      {loading ? (
        <div className={styles.centered}>Memuat notes...</div>
      ) : notes.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Belum ada notes. Jadilah yang pertama!</p>
        </div>
      ) : (
        <div className={styles.notesGrid}>
          {notes.map(note => (
            <NoteItem
              key={note.id}
              note={note}
              onDelete={handleDeleteNote}
              canDelete={note.user_id === userId}
            />
          ))}
        </div>
      )}

      <NotesModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={handleAddNote}
        loading={submitting}
      />

      <PremiumUpgradeModal 
        open={premiumModalOpen}
        onClose={() => setPremiumModalOpen(false)}
      />
    </section>
  );
});
