import Navbar from '../../components/Navbar/Navbar';
import styles from './auth.module.css';
import { Link } from 'react-router-dom';

export default function AuthRequired() {
    return (
        <>
            <Navbar />
            <div className={styles.authWrapper}>
                <div className={styles.authCard}>
                    <h2 className={styles.authTitle}>Akses Terbatas</h2>
                    <p style={{ fontSize: '1.1rem', color: '#333', marginBottom: '1.2rem', textAlign: 'center' }}>
                        Anda harus login untuk mengakses halaman ini.
                    </p>
                    <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
                        <Link to="/login" className={styles.authBtn} style={{color:'white'}}>
                            Login
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}
