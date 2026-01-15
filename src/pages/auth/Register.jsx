import React, { useState } from 'react';
import styles from './auth.module.css';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../../lib/supabase';
import Swal from 'sweetalert2';
import Navbar, { LoadingScreen } from '../../components/Navbar/Navbar';

export default function Register() {
const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
const [error, setError] = useState('');
const [loading, setLoading] = useState(false);
const navigate = useNavigate();

const handleChange = e => {
setForm({ ...form, [e.target.name]: e.target.value });
setError('');
};

const handleSubmit = async e => {
e.preventDefault();

if (!form.name || !form.email || !form.password || !form.confirm) {
    setError('Semua field wajib diisi.');
    return;
}

if (form.password !== form.confirm) {
    setError('Password tidak cocok.');
    return;
}

setError('');
setLoading(true);

// 1. REGISTER KE SUPABASE AUTH
const { data, error: signUpError } = await supabase.auth.signUp({
    email: form.email,
    password: form.password
});

if (signUpError) {
    setLoading(false);
    Swal.fire({
    icon: 'error',
    title: 'Registrasi Gagal',
    text: signUpError.message,
    confirmButtonColor: '#007bff'
    });
    setError(signUpError.message);
    return;
}

// 2. SIMPAN PROFILE (USERNAME / NAMA)
const user = data.user;

if (user) {
    const { error: profileError } = await supabase
    .from('profiles')
    .insert({
        id: user.id,
        username: form.name
    });

    if (profileError) {
    setLoading(false);
    Swal.fire({
        icon: 'error',
        title: 'Gagal Menyimpan Profil',
        text: 'Gagal menyimpan profil.',
        confirmButtonColor: '#007bff'
    });
    setError('Gagal menyimpan profil.');
    return;
    }
}

setLoading(false);
// 3. INFO KE USER
Swal.fire({
    icon: 'success',
    title: 'Registrasi Berhasil',
    text: 'Silakan cek spam untuk verifikasi akun.',
    confirmButtonColor: '#007bff'
}).then(() => {
    navigate('/check-email');
});
};

return (
<>
    <LoadingScreen show={loading} />
    <Navbar />
    <div className={styles.authWrapper}>
    <div className={styles.authCard}>
        <h2 className={styles.authTitle}>Daftar Akun Baru</h2>
        <form className={styles.authForm} onSubmit={handleSubmit} autoComplete="off">
        <label className={styles.authLabel}>
            Nama Lengkap
            <input
            type="text"
            name="name"
            className={styles.authInput}
            placeholder="Nama lengkap"
            value={form.name}
            onChange={handleChange}
            required
            disabled={loading}
            />
        </label>
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
        <label className={styles.authLabel}>
            Konfirmasi Password
            <input
            type="password"
            name="confirm"
            className={styles.authInput}
            placeholder="Ulangi password"
            value={form.confirm}
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
            {loading ? 'Memproses...' : 'Daftar'}
        </button>
        </form>
        <div className={styles.authFooter}>
        Sudah punya akun?{' '}
        <Link to="/login" className={styles.authLink}>
            Masuk
        </Link>
        </div>
    </div>
    </div>
</>
);
}
