// src/components/admin/FeedbackManagement.jsx
import { memo, useState, useEffect, useCallback } from 'react';
import { supabase } from '../../lib/supabase';
import Swal from 'sweetalert2';
import styles from './AdminComponents.module.css';

const FeedbackItem = memo(({ feedback, onDelete }) => {
  const formattedDate = new Date(feedback.created_at).toLocaleString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <div className={styles.feedbackCard}>
      <div className={styles.feedbackHeader}>
        <div className={styles.feedbackUser}>
          <div className={styles.feedbackAvatar}>
            {feedback.username?.charAt(0).toUpperCase() || feedback.email?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div>
            <div className={styles.feedbackUsername}>
              {feedback.username || 'Pengguna'}
            </div>
            <div className={styles.feedbackEmail}>{feedback.email}</div>
            <div className={styles.feedbackDate}>{formattedDate}</div>
          </div>
        </div>
        <button
          className={styles.deleteBtnSmall}
          onClick={() => onDelete(feedback.id, feedback.username)}
          title="Hapus feedback"
        >
          🗑
        </button>
      </div>
      <div className={styles.feedbackContent}>
        <p>{feedback.message}</p>
      </div>
    </div>
  );
});

FeedbackItem.displayName = 'FeedbackItem';

export default memo(function FeedbackManagement() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, recent, older
  const [searchQuery, setSearchQuery] = useState('');

  const fetchFeedbacks = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('feedback')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setFeedbacks(data || []);
    } catch (err) {
      console.error('Error fetching feedbacks:', err);
      Swal.fire({
        icon: 'error',
        title: 'Gagal Memuat Feedback',
        text: err.message,
        confirmButtonColor: '#007bff'
      });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchFeedbacks();
  }, [fetchFeedbacks]);

  const handleDelete = async (id, username) => {
    const result = await Swal.fire({
      title: 'Hapus Feedback?',
      html: `Apakah Anda yakin ingin menghapus feedback dari <strong>${username || 'pengguna ini'}</strong>?`,
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
          .from('feedback')
          .delete()
          .eq('id', id);

        if (error) throw error;

        await fetchFeedbacks();

        Swal.fire({
          icon: 'success',
          title: 'Terhapus!',
          text: 'Feedback berhasil dihapus',
          timer: 1500,
          showConfirmButton: false
        });
      } catch (err) {
        console.error('Error deleting feedback:', err);
        Swal.fire({
          icon: 'error',
          title: 'Gagal Menghapus',
          text: err.message,
          confirmButtonColor: '#007bff'
        });
      }
    }
  };

  // Filter and search
  const filteredFeedbacks = feedbacks.filter(feedback => {
    // Time filter
    if (filter === 'recent') {
      const dayAgo = new Date();
      dayAgo.setDate(dayAgo.getDate() - 7);
      if (new Date(feedback.created_at) < dayAgo) return false;
    } else if (filter === 'older') {
      const dayAgo = new Date();
      dayAgo.setDate(dayAgo.getDate() - 7);
      if (new Date(feedback.created_at) >= dayAgo) return false;
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      return (
        feedback.message?.toLowerCase().includes(query) ||
        feedback.username?.toLowerCase().includes(query) ||
        feedback.email?.toLowerCase().includes(query)
      );
    }

    return true;
  });

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h3 className={styles.sectionTitle}>Kelola Feedback</h3>
        <div className={styles.headerActions}>
          <input
            type="text"
            className={styles.searchInput}
            placeholder="Cari feedback..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <select
            className={styles.filterSelect}
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="all">Semua Waktu</option>
            <option value="recent">7 Hari Terakhir</option>
            <option value="older">Lebih dari 7 Hari</option>
          </select>
        </div>
      </div>

      <div className={styles.statsBar}>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Total Feedback</span>
          <span className={styles.statValue}>{filteredFeedbacks.length}</span>
        </div>
        <div className={styles.statItem}>
          <span className={styles.statLabel}>Minggu Ini</span>
          <span className={styles.statValue}>
            {feedbacks.filter(f => {
              const weekAgo = new Date();
              weekAgo.setDate(weekAgo.getDate() - 7);
              return new Date(f.created_at) >= weekAgo;
            }).length}
          </span>
        </div>
      </div>

      {loading ? (
        <div className={styles.loading}>Memuat feedback...</div>
      ) : filteredFeedbacks.length === 0 ? (
        <div className={styles.empty}>
          {searchQuery ? 'Tidak ada feedback yang sesuai pencarian' : 'Belum ada feedback'}
        </div>
      ) : (
        <div className={styles.feedbackList}>
          {filteredFeedbacks.map(feedback => (
            <FeedbackItem
              key={feedback.id}
              feedback={feedback}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
});