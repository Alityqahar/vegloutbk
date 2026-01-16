import { memo, useState, useEffect } from 'react';
import styles from './social.module.css';
import { supabase } from '../../lib/supabase';

const AnnouncementItem = memo(({ announcement }) => {
  const createdAt = new Date(announcement.created_at);
  const formattedDate = createdAt.toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  return (
    <div className={styles.announcementCard}>
      <div className={styles.announcementBadge}>
        📢 Pengumuman
      </div>
      <h4 className={styles.announcementTitle}>{announcement.title}</h4>
      <p className={styles.announcementContent}>{announcement.content}</p>
      <div className={styles.announcementFooter}>
        <span className={styles.announcementDate}>{formattedDate}</span>
      </div>
    </div>
  );
});

AnnouncementItem.displayName = 'AnnouncementItem';

export default memo(function Announcements() {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let mounted = true;

    const fetchAnnouncements = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from('announcements')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(20);

      if (mounted && !error) {
        setAnnouncements(data || []);
      }
      if (mounted) setLoading(false);
    };

    fetchAnnouncements();

    return () => { mounted = false; };
  }, []);

  return (
    <section className={styles.announcementsSection}>
      <h3 className={styles.sectionTitle}>Pengumuman</h3>

      {loading ? (
        <div className={styles.centered}>Memuat pengumuman...</div>
      ) : announcements.length === 0 ? (
        <div className={styles.emptyState}>
          <p>Belum ada pengumuman</p>
        </div>
      ) : (
        <div className={styles.announcementsList}>
          {announcements.map(announcement => (
            <AnnouncementItem
              key={announcement.id}
              announcement={announcement}
            />
          ))}
        </div>
      )}
    </section>
  );
});
