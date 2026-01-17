// src/components/Navbar/Navbar.jsx - ENHANCED VERSION
import { memo, useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import { useRole } from '../../context/RoleContext';
import Swal from 'sweetalert2';
import styles from './Navbar.module.css';

const NavLink = memo(({ to, children, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <li className={styles.menuItem}>
      <Link 
        to={to} 
        className={`${styles.menuLink} ${isActive ? styles.active : ''}`}
        onClick={onClick}
      >
        {children}
      </Link>
    </li>
  );
});

NavLink.displayName = 'NavLink';

const UserDropdown = memo(({ username, role, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const handleClick = (e) => {
      if (!e.target.closest(`.${styles.userDropdown}`)) {
        closeDropdown();
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [isOpen, closeDropdown]);

  const handleLogout = useCallback(() => {
    closeDropdown();
    onLogout();
  }, [onLogout, closeDropdown]);

  const handleAdminClick = () => {
    closeDropdown();
    navigate('/admin');
  };

  // Role badge style
  const getRoleBadge = () => {
    if (role === 'admin') {
      return <span className={styles.roleBadgeAdmin}>ADMIN</span>;
    }
    if (role === 'subs') {
      return <span className={styles.roleBadgeSubs}>⭐ PREMIUM</span>;
    }
    return null;
  };

  return (
    <div className={styles.userDropdown}>
      <button 
        className={styles.userBtn}
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className={`${styles.userAvatar} ${role === 'subs' ? styles.avatarSubs : ''} ${role === 'admin' ? styles.avatarAdmin : ''}`}>
          {username.charAt(0).toUpperCase()}
        </span>
        <div className={styles.userInfo}>
          <span className={styles.userName}>Hai, {username}!</span>
          {getRoleBadge()}
        </div>
        <svg 
          className={`${styles.dropdownIcon} ${isOpen ? styles.dropdownIconOpen : ''}`}
          width="12" 
          height="12" 
          viewBox="0 0 12 12" 
          fill="none"
        >
          <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      </button>
      
      {isOpen && (
        <div className={styles.dropdownMenu}>
          {role === 'admin' && (
            <button 
              className={styles.dropdownItem}
              onClick={handleAdminClick}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6.66667 2H3.33333C2.59695 2 2 2.59695 2 3.33333V6.66667C2 7.40305 2.59695 8 3.33333 8H6.66667C7.40305 8 8 7.40305 8 6.66667V3.33333C8 2.59695 7.40305 2 6.66667 2Z" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M12.6667 2H9.33333C8.59695 2 8 2.59695 8 3.33333V6.66667C8 7.40305 8.59695 8 9.33333 8H12.6667C13.403 8 14 7.40305 14 6.66667V3.33333C14 2.59695 13.403 2 12.6667 2Z" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M6.66667 8H3.33333C2.59695 8 2 8.59695 2 9.33333V12.6667C2 13.403 2.59695 14 3.33333 14H6.66667C7.40305 14 8 13.403 8 12.6667V9.33333C8 8.59695 7.40305 8 6.66667 8Z" stroke="currentColor" strokeWidth="1.5"/>
                <path d="M12.6667 8H9.33333C8.59695 8 8 8.59695 8 9.33333V12.6667C8 13.403 8.59695 14 9.33333 14H12.6667C13.403 14 14 13.403 14 12.6667V9.33333C14 8.59695 13.403 8 12.6667 8Z" stroke="currentColor" strokeWidth="1.5"/>
              </svg>
              Dashboard Admin
            </button>
          )}
          <button 
            className={styles.dropdownItem}
            onClick={handleLogout}
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M6 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V3.33333C2 2.97971 2.14048 2.64057 2.39052 2.39052C2.64057 2.14048 2.97971 2 3.33333 2H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M10.6667 11.3333L14 8L10.6667 4.66667" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M14 8H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            Logout
          </button>
        </div>
      )}
    </div>
  );
});

UserDropdown.displayName = 'UserDropdown';

export function LoadingScreen({ show = false }) {
  if (!show) return null;
  return (
    <div style={{
      position: 'fixed',
      zIndex: 9999,
      inset: 0,
      background: 'rgba(255,255,255,0.92)',
      backdropFilter: 'blur(2px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
      opacity: show ? 1 : 0,
      pointerEvents: show ? 'all' : 'none'
    }}>
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 24,
        animation: 'fadeInScale 0.5s cubic-bezier(0.34, 1.56, 0.64, 1)'
      }}>
        <div style={{
          position: 'relative',
          width: 64,
          height: 64
        }}>
          <div style={{
            position: 'absolute',
            inset: 0,
            borderRadius: '50%',
            border: '4px solid #e0eaff',
            animation: 'spin 3s linear infinite'
          }} />
          <div style={{
            position: 'absolute',
            inset: 8,
            borderRadius: '50%',
            border: '4px solid transparent',
            borderTopColor: '#007bff',
            borderRightColor: '#007bff',
            animation: 'spin 1.5s linear infinite reverse'
          }} />
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 8
        }}>
          <div style={{
            fontWeight: 700,
            color: '#007bff',
            fontSize: 18,
            letterSpacing: 0.5
          }}>
            Memuat...
          </div>
          <div style={{
            fontSize: 13,
            color: '#888',
            animation: 'pulse 2s ease-in-out infinite'
          }}>
            Siapkan konten terbaik untuk Anda
          </div>
        </div>

        <div style={{
          width: 200,
          height: 4,
          background: '#e0eaff',
          borderRadius: 999,
          overflow: 'hidden'
        }}>
          <div style={{
            height: '100%',
            background: 'linear-gradient(90deg, #007bff, #4ecdc4)',
            animation: 'loadingProgress 2s ease-in-out infinite'
          }} />
        </div>

        <style>{`
          @keyframes spin {
            to { transform: rotate(360deg); }
          }
          @keyframes pulse {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 1; }
          }
          @keyframes fadeInScale {
            from {
              opacity: 0;
              transform: scale(0.9);
            }
            to {
              opacity: 1;
              transform: scale(1);
            }
          }
          @keyframes loadingProgress {
            0% { transform: translateX(-100%); }
            50% { transform: translateX(100%); }
            100% { transform: translateX(100%); }
          }
        `}</style>
      </div>
    </div>
  );
}

function Navbar() {
  const { user, role, loading } = useRole();
  const [username, setUsername] = useState('User');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    setUsername(user.username || user.email?.split('@')[0] || 'User');
  }, [user]);

  const handleLogout = useCallback(async () => {
    const { error } = await supabase.auth.signOut();

    if (!error) {
      Swal.fire({
        icon: 'success',
        title: 'Logout Berhasil',
        text: 'Anda telah keluar dari akun.',
        timer: 1200,
        showConfirmButton: false,
      });
      navigate('/');
    }
  }, [navigate]);

  const toggleMobileMenu = useCallback(() => {
    setMobileMenuOpen(prev => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setMobileMenuOpen(false);
  }, []);

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        <div className={styles.left}>
          <Link to="/" className={styles.logo}>
            <span className={styles.logoIcon}><img src="logo2.png" alt="" /></span>
          </Link>
          
          <ul className={`${styles.menu} ${mobileMenuOpen ? styles.menuOpen : ''}`}>
            <NavLink to="/" onClick={closeMobileMenu}>Home</NavLink>
            <NavLink to="/materi" onClick={closeMobileMenu}>Materi</NavLink>
            <NavLink to="/latsol" onClick={closeMobileMenu}>Latsol</NavLink>
            <NavLink to="/social" onClick={closeMobileMenu}>Social</NavLink>
            <NavLink to="/todo" onClick={closeMobileMenu}>To-Do</NavLink>
            <NavLink to="/feedback" onClick={closeMobileMenu}>Feedback</NavLink>
          </ul>
        </div>
        
        <div className={styles.right}>
          {loading ? (
            <div className={styles.loadingSkeleton} />
          ) : !user ? (
            <Link to="/login" className={styles.loginBtn}>
              <span style={{color:'white'}}>Login</span>
            </Link>
          ) : (
            <UserDropdown username={username} role={role} onLogout={handleLogout} />
          )}
          
          <button 
            className={styles.mobileMenuBtn}
            onClick={toggleMobileMenu}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            <span className={`${styles.hamburger} ${mobileMenuOpen ? styles.hamburgerOpen : ''}`} />
          </button>
        </div>
      </div>
    </nav>
  );
}

export default memo(Navbar);