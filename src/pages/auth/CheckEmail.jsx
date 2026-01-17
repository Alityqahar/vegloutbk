import React from 'react';
import styles from './auth.module.css';
import Navbar from '../../components/Navbar/Navbar';
import { Link } from 'react-router-dom';

export default function CheckEmail() {
return (
<>
    <Navbar />
    <div className={styles.authWrapper}>
    <div className={styles.authCard}>
        <h2 className={styles.authTitle}>Verifikasi Email</h2>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <span style={{ fontSize: '2.5rem', color: '#007bff' }}>📧</span>
        </div>
        <p style={{ fontSize: '1.1rem', color: '#333', marginBottom: '1.2rem', textAlign: 'center' }}>
        Terima kasih telah mendaftar! <br />
        Silakan cek <b>email(SPAM)</b> Anda untuk melakukan verifikasi akun sebelum login.
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