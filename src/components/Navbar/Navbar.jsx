import { memo, useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import Swal from 'sweetalert2';
import styles from './Navbar.module.css';

// Komponen terpisah untuk menu items (reusable)
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

// Komponen user dropdown
const UserDropdown = memo(({ username, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = useCallback(() => {
    setIsOpen(prev => !prev);
  }, []);

  const closeDropdown = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Close dropdown saat click outside
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

  return (
    <div className={styles.userDropdown}>
      <button 
        className={styles.userBtn}
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className={styles.userAvatar}>
          {username.charAt(0).toUpperCase()}
        </span>
        <span className={styles.userName}>Hai, {username}!</span>
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

function Navbar() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState('User');
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  // ✅ PENTING: useEffect untuk Auth Check (jangan dihapus!)
  useEffect(() => {
    let mounted = true;

    // Get initial user
    supabase.auth.getUser().then(({ data }) => {
      if (mounted) {
        setUser(data?.user);
        setLoading(false);
      }
    });

    // Listen to auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (mounted) {
        setUser(session?.user ?? null);
      }
    });

    return () => {
      mounted = false;
      listener?.subscription.unsubscribe();
    };
  }, []);

  // ✅ Fetch username dari tabel profiles
  useEffect(() => {
    if (!user) return;
    
    let mounted = true;
    
    const fetchUsername = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('username')
        .eq('id', user.id)
        .single();
      
      if (mounted && !error && data) {
        setUsername(data.username || user.email?.split('@')[0] || 'User');
      } else if (mounted) {
        // Fallback jika tidak ada di profiles
        setUsername(user.email?.split('@')[0] || 'User');
      }
    };
    
    fetchUsername();
    
    return () => { mounted = false; };
  }, [user]);

  const handleLogout = useCallback(async () => {
    const { error } = await supabase.auth.signOut();

    if (!error) {
      setUser(null);
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
            <span className={styles.logoIcon}>📚</span>
            <span className={styles.logoText}>VegloUTBK</span>
          </Link>
          
          <ul className={`${styles.menu} ${mobileMenuOpen ? styles.menuOpen : ''}`}>
            <NavLink to="/" onClick={closeMobileMenu}>Home</NavLink>
            <NavLink to="/materi" onClick={closeMobileMenu}>Materi</NavLink>
            <NavLink to="/latsol" onClick={closeMobileMenu}>Latsol</NavLink>
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
            <UserDropdown username={username} onLogout={handleLogout} />
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