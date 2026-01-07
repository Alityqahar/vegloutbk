import Navbar from '../../components/Navbar/Navbar';
import { Link, useLocation } from 'react-router-dom';

export default function NeedLogin() {
    const location = useLocation();
    const from = location.state?.from || '/';

    return (
        <>
            <Navbar />
            <div style={{
                minHeight: '60vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem'
            }}>
                <h2 style={{ color: '#007bff', marginBottom: '1rem' }}>Silakan Login Terlebih Dahulu</h2>
                <p style={{ fontSize: '1.1rem', color: '#555', marginBottom: '2rem', textAlign: 'center' }}>
                    Anda harus login untuk mengakses halaman ini.<br />
                    Setelah login, Anda akan diarahkan kembali ke halaman yang diinginkan.
                </p>
                <Link
                    to={`/login?redirect=${encodeURIComponent(from)}`}
                    style={{
                        background: '#007bff',
                        color: '#fff',
                        padding: '0.7rem 2rem',
                        borderRadius: '6px',
                        fontWeight: '600',
                        textDecoration: 'none',
                        fontSize: '1.1rem'
                    }}
                >
                    Login
                </Link>
            </div>
        </>
    );
}
