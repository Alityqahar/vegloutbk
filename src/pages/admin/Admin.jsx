// src/pages/admin/Admin.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar, { LoadingScreen } from '../../components/Navbar/Navbar';
import { supabase } from '../../lib/supabase';
import { useLoadingDelay } from '../../lib/useLoadingDelay';
import UserManagement from '../../components/admin/UserManagement';
import ContentManagement from '../../components/admin/ContentManagement';
import AnnouncementManagement from '../../components/admin/AnnouncementManagement';
import FeedbackManagement from '../../components/admin/FeedbackManagement';
import styles from './Admin.module.css';
import Swal from 'sweetalert2';

export default function AdminPage() {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [checking, setChecking] = useState(true);
  const [activeTab, setActiveTab] = useState('users');
  const navigate = useNavigate();
  const showLoading = useLoadingDelay(!checking, 1500);

  useEffect(() => {
    let mounted = true;

    const checkAdminAccess = async () => {
      try {
        const { data: { user: currentUser }, error: userError } = await supabase.auth.getUser();
        
        if (userError || !currentUser) {
          if (mounted) {
            navigate('/need-login', { replace: true });
          }
          return;
        }

        // Fetch role from profiles table
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', currentUser.id)
          .single();

        if (profileError || !profile) {
          console.error('Error fetching profile:', profileError);
          if (mounted) {
            Swal.fire({
              icon: 'error',
              title: 'Akses Ditolak',
              text: 'Tidak dapat memverifikasi role Anda.',
              confirmButtonColor: '#007bff'
            }).then(() => {
              navigate('/', { replace: true });
            });
          }
          return;
        }

        if (profile.role !== 'admin') {
          if (mounted) {
            Swal.fire({
              icon: 'error',
              title: 'Akses Ditolak',
              text: 'Anda tidak memiliki akses ke halaman ini.',
              confirmButtonColor: '#007bff'
            }).then(() => {
              navigate('/', { replace: true });
            });
          }
          return;
        }

        if (mounted) {
          setUser(currentUser);
          setRole(profile.role);
          setChecking(false);
        }
      } catch (err) {
        console.error('Admin access check error:', err);
        if (mounted) {
          navigate('/', { replace: true });
        }
      }
    };

    checkAdminAccess();

    return () => { mounted = false; };
  }, [navigate]);

  if (checking || showLoading) return <LoadingScreen show={true} />;
  if (!user || role !== 'admin') return null;

  return (
    <>
      <Navbar />
      <div className={styles.adminPage}>
        <div className={styles.adminContainer}>
          <header className={styles.adminHeader}>
            <div>
              <h1 className={styles.adminTitle}>Admin Dashboard</h1>
              <p className={styles.adminSubtitle}>Kelola user, konten, dan pengumuman</p>
            </div>
          </header>

          <div className={styles.tabNav}>
            <button
              className={`${styles.tabBtn} ${activeTab === 'users' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('users')}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M13.3333 5.83333C13.3333 7.67428 11.841 9.16667 10 9.16667C8.15905 9.16667 6.66667 7.67428 6.66667 5.83333C6.66667 3.99238 8.15905 2.5 10 2.5C11.841 2.5 13.3333 3.99238 13.3333 5.83333Z" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M10 11.6667C6.77834 11.6667 4.16667 14.2783 4.16667 17.5H15.8333C15.8333 14.2783 13.2217 11.6667 10 11.6667Z" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
              Manajemen User
            </button>
            <button
              className={`${styles.tabBtn} ${activeTab === 'content' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('content')}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M5.83333 2.5H14.1667C15.5474 2.5 16.6667 3.61929 16.6667 5V15C16.6667 16.3807 15.5474 17.5 14.1667 17.5H5.83333C4.45262 17.5 3.33333 16.3807 3.33333 15V5C3.33333 3.61929 4.45262 2.5 5.83333 2.5Z" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M6.66667 6.66667H13.3333M6.66667 10H13.3333M6.66667 13.3333H10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
              </svg>
              Manajemen Konten
            </button>
            <button
              className={`${styles.tabBtn} ${activeTab === 'announcements' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('announcements')}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M15.8333 6.66667L10 10.8333L4.16667 6.66667M4.16667 4.16667H15.8333C16.7538 4.16667 17.5 4.91286 17.5 5.83333V14.1667C17.5 15.0871 16.7538 15.8333 15.8333 15.8333H4.16667C3.24619 15.8333 2.5 15.0871 2.5 14.1667V5.83333C2.5 4.91286 3.24619 4.16667 4.16667 4.16667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Pengumuman
            </button>
            <button
              className={`${styles.tabBtn} ${activeTab === 'feedback' ? styles.tabBtnActive : ''}`}
              onClick={() => setActiveTab('feedback')}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M17.5 8.33333C17.5 11.555 14.1421 14.1667 10 14.1667C9.16667 14.1667 8.36667 14.0583 7.61667 13.8583L4.16667 15.8333L5 12.5C3.55833 11.3333 2.5 9.91667 2.5 8.33333C2.5 5.11167 5.85786 2.5 10 2.5C14.1421 2.5 17.5 5.11167 17.5 8.33333Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
              Feedback
            </button>
          </div>

          <div className={styles.tabContent}>
            {activeTab === 'users' && <UserManagement />}
            {activeTab === 'content' && <ContentManagement />}
            {activeTab === 'announcements' && <AnnouncementManagement />}
            {activeTab === 'feedback' && <FeedbackManagement />}
          </div>
        </div>
      </div>
    </>
  );
}