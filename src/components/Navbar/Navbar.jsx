import styles from './Navbar.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import Swal from 'sweetalert2';

export default function Navbar() {
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        let mounted = true;
        supabase.auth.getUser().then(({ data }) => {
            if (mounted) setUser(data?.user);
        });
        const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
            if (mounted) setUser(session?.user ?? null);
        });
        return () => {
            mounted = false;
            listener?.subscription.unsubscribe();
        };
    }, []);

    // Ambil nama user, fallback ke email jika nama tidak ada
    const username =
        user?.user_metadata?.full_name ||
        user?.user_metadata?.name ||
        user?.email?.split('@')[0] ||
        'User';

    const handleLogout = async () => {
        await supabase.auth.signOut();
        setUser(null); // force UI update
        Swal.fire({
            icon: 'success',
            title: 'Logout Berhasil',
            text: 'Anda telah keluar dari akun.',
            timer: 1200,
            showConfirmButton: false,
        });
        navigate('/'); // redirect ke home
    };

    return (
        <nav className={styles.navbar}>
            <div className={styles.navContainer}>
                <div className={styles.left}>
                    <div className={styles.logo}>
                        <Link to="/">VegloUTBK</Link>
                    </div>
                    <ul className={styles.menu}>
                        <li>
                            <Link to="/">Home</Link>
                        </li>
                        <li>
                            <Link to="/materi">Materi</Link>
                        </li>
                        <li>
                            <Link to="/latsol">Latsol</Link>
                        </li>
                    </ul>
                </div>
                <div className={styles.right}>
                    {!user ? (
                        <Link to="/login" className={styles.loginBtn}>
                            Login
                        </Link>
                    ) : (
                        <div className={styles.greetingWrapper} style={{ gap: '0.5rem' }}>
                            <span className={styles.greetingBtn} style={{ cursor: 'default', background: 'none', padding: 0 }}>
                                Hai, {username}!
                            </span>
                            <button
                                className={styles.loginBtn}
                                style={{ marginLeft: '0.5rem' }}
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </nav>
    );
}