// src/pages/social/Social.jsx - UPDATED VERSION
import { useEffect, useState } from 'react';
import Navbar, { LoadingScreen } from '../../components/Navbar/Navbar';
import { supabase } from '../../lib/supabase';
import { useRole } from '../../context/RoleContext';
import Notes from '../../components/social/Notes';
import Announcements from '../../components/social/Announcements';
import styles from './social.module.css';

export default function SocialPage() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const { canAddNotes, requiresLogin } = useRole();

    useEffect(() => {
        let mounted = true;

        // Add minimum delay for smooth UX
        const minDelay = new Promise(resolve => setTimeout(resolve, 1500));
        
        Promise.all([
            supabase.auth.getUser(),
            minDelay
        ]).then(([{ data, error }]) => {
            if (!mounted) return;
            
            if (error) {
                console.error('Auth error:', error);
            }
            
            setUser(data?.user || null);
            setLoading(false);
        }).catch((err) => {
            console.error('Failed to fetch user:', err);
            if (mounted) {
                setLoading(false);
            }
        });

        return () => { mounted = false; };
    }, []);

    if (loading) return <LoadingScreen show />;

    return (
        <>
            <Navbar />
            <div className={styles.page}>
                <div className={styles.container}>
                    <Notes 
                        userId={user?.id} 
                        canAdd={canAddNotes}
                        requiresLogin={requiresLogin}
                    />
                    <Announcements />
                </div>
            </div>
        </>
    );
}