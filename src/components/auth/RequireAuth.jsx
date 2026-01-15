import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { LoadingScreen } from '../Navbar/Navbar';

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

    if (checking) return <LoadingScreen show={true} />;
    if (!user) return null; // Sudah redirect

    return children;
}
