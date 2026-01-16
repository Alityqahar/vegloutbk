import { useEffect, useState } from 'react';
import Navbar, { LoadingScreen } from '../../components/Navbar/Navbar';
import { supabase } from '../../lib/supabase';
import Notes from '../../components/social/Notes';
import Announcements from '../../components/social/Announcements';
import styles from './social.module.css';
import { useLoadingDelay } from '../../lib/useLoadingDelay';

export default function SocialPage() {
    const [user, setUser] = useState(null);
    const [dataReady, setDataReady] = useState(false);
    const showLoading = useLoadingDelay(!dataReady, 2000);

    useEffect(() => {
        let mounted = true;

        supabase.auth.getUser().then(({ data }) => {
        if (mounted) {
            setUser(data?.user || null);
            setDataReady(true);
        }
        }).catch(() => {
        if (mounted) setDataReady(true);
        });

        return () => { mounted = false; };
    }, []);

    if (showLoading) return <LoadingScreen show />;

    return (
        <>
        <Navbar />
        <div className={styles.page}>
            <div className={styles.container}>
            <Notes userId={user?.id} />
            <Announcements />
            </div>
        </div>
        </>
    );
}
