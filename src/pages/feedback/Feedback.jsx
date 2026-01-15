import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import Navbar, { LoadingScreen } from '../../components/Navbar/Navbar';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import { useLoadingDelay } from '../../lib/useLoadingDelay';

export default function FeedbackPage() {
    const [user, setUser] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [checking, setChecking] = useState(true);
    const showLoadingScreen = useLoadingDelay(user !== null && !checking, 2000);
    const navigate = useNavigate();

    useEffect(() => {
        let mounted = true;
        supabase.auth.getUser().then(({ data }) => {
            if (mounted) setUser(data?.user);
            if (mounted && !data?.user) {
                navigate('/need-login', { replace: true });
            }
            setChecking(false);
        });
        return () => { mounted = false; };
    }, [navigate]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!message.trim()) {
            Swal.fire({
                icon: 'warning',
                title: 'Masukan tidak boleh kosong',
                confirmButtonColor: '#007bff'
            });
            return;
        }
        setLoading(true);
        const { id, email, user_metadata } = user;
        const username = user_metadata?.full_name || user_metadata?.name || email?.split('@')[0] || '';
        const { error } = await supabase
            .from('feedback')
            .insert({
                user_id: id,
                email,
                username,
                message
            });
        setLoading(false);
        if (error) {
            Swal.fire({
                icon: 'error',
                title: 'Gagal mengirim feedback',
                text: error.message,
                confirmButtonColor: '#007bff'
            });
        } else {
            Swal.fire({
                icon: 'success',
                title: 'Terima kasih atas masukan Anda!',
                text: 'Feedback berhasil dikirim.',
                timer: 1500,
                showConfirmButton: false
            });
            setMessage('');
        }
    };

    if (checking || showLoadingScreen) return <LoadingScreen show={true} />;
    if (!user) return null;

    return (
        <>
            <Navbar />
            <div style={{
                maxWidth: 480,
                margin: '80px auto',
                padding: '2rem',
                background: '#fff',
                borderRadius: 16,
                boxShadow: '0 4px 24px rgba(0,123,255,0.07)',
                display: 'flex',
                flexDirection: 'column',
                gap: '2rem',
                animation: 'fadeInUp 0.6s cubic-bezier(0.34, 1.56, 0.64, 1)'
            }}>
                <h2 style={{
                    fontWeight: 800,
                    fontSize: '2rem',
                    color: '#007bff',
                    textAlign: 'center'
                }}>
                    Feedback & Saran
                </h2>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>
                    <div>
                        <label style={{ fontWeight: 600, color: '#333', marginBottom: 6, display: 'block' }}>
                            Masukan, Saran, atau Kritik Anda
                        </label>
                        <textarea
                            value={message}
                            onChange={e => setMessage(e.target.value)}
                            rows={5}
                            style={{
                                width: '100%',
                                padding: '0.8rem 1rem',
                                borderRadius: 8,
                                border: '1.5px solid #d0d0d0',
                                fontSize: '1rem',
                                background: '#f8fafd',
                                resize: 'vertical'
                            }}
                            placeholder="Tulis masukan, saran, atau kritik Anda di sini..."
                            required
                            disabled={loading}
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            background: '#007bff',
                            color: '#fff',
                            borderRadius: 8,
                            padding: '0.8rem 1.2rem',
                            fontWeight: 700,
                            fontSize: '1.1rem',
                            border: 'none',
                            boxShadow: '0 2px 8px rgba(0,123,255,0.08)',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            transition: 'background 0.2s'
                        }}
                    >
                        {loading ? 'Mengirim...' : 'Kirim Feedback'}
                    </button>
                </form>
                <div style={{ textAlign: 'center', color: '#555', fontSize: '0.97rem' }}>
                    Terima Kasih Telah Memberikan Feedback.
                </div>
            </div>
            <style>{`
              @keyframes fadeInUp {
                from {
                  opacity: 0;
                  transform: translateY(20px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
            `}</style>
        </>
    );
}
