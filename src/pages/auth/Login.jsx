import React, { useState } from 'react';
import styles from './auth.module.css';
import { Link, useNavigate } from 'react-router-dom';
import Navbar, { LoadingScreen } from '../../components/Navbar/Navbar';
import { supabase } from '../../lib/supabase';
import Swal from 'sweetalert2';

export default function Login() {
const [form, setForm] = useState({ email: '', password: '' });
const [error, setError] = useState('');
const [loading, setLoading] = useState(false);
const navigate = useNavigate();

const handleChange = e => {
setForm({ ...form, [e.target.name]: e.target.value });
setError('');
};

const handleSubmit = async e => {
e.preventDefault();
if (!form.email || !form.password) {
    setError('Email dan password wajib diisi.');
    return;
}
setError('');
setLoading(true);
const { error: loginError } = await supabase.auth.signInWithPassword({
    email: form.email,
    password: form.password
});
setLoading(false);
if (loginError) {
    Swal.fire({
    icon: 'error',
    title: 'Login Gagal',
    text: loginError.message,
    confirmButtonColor: '#007bff'
    });
    setError(loginError.message);
    return;
}
Swal.fire({
    icon: 'success',
    title: 'Login Berhasil',
    text: 'Selamat datang kembali!',
    confirmButtonColor: '#007bff',
    timer: 1500,
    showConfirmButton: false
}).then(() => {
    navigate('/');
});
};

return (
<>
    <LoadingScreen show={loading} />
    <Navbar />
    <div className={styles.authWrapper}>
    <div className={styles.authCard}>
        <h2 className={styles.authTitle}>Masuk ke Akun</h2>
        <form className={styles.authForm} onSubmit={handleSubmit} autoComplete="off">
        <label className={styles.authLabel}>
            Email
            <input
            type="email"
            name="email"
            className={styles.authInput}
            placeholder="Alamat email"
            value={form.email}
            onChange={handleChange}
            required
            disabled={loading}
            />
        </label>
        <label className={styles.authLabel}>
            Password
            <input
            type="password"
            name="password"
            className={styles.authInput}
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
            disabled={loading}
            />
        </label>
        {error && <div className={styles.authError}>{error}</div>}
        <button
            type="submit"
            className={styles.authBtn}
            disabled={loading}
        >
            {loading ? 'Memproses...' : 'Masuk'}
        </button>
        </form>
        <div className={styles.authFooter}>
        Belum punya akun?{' '}
        <Link to="/register" className={styles.authLink}>
            Daftar
        </Link>
        </div>
    </div>
    </div>
</>
);
}
