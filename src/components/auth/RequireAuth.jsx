import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';

export default function RequireAuth({ children }) {
    const [checking, setChecking] = useState(true);
    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        let mounted = true;
        supabase.auth.getUser().then(({ data }) => {
            if (mounted) {
                setUser(data?.user);
                setChecking(false);
                if (!data?.user) {
                    navigate('/auth-required', { replace: true });
                }
            }
        });
        return () => { mounted = false; };
    }, [navigate]);

    if (checking) return <div style={{ textAlign: 'center', marginTop: '4rem' }}>Memeriksa autentikasi...</div>;
    if (!user) return null; // Sudah redirect

    return children;
}
