import Navbar from "../../components/Navbar/Navbar"
import styles from './materi.module.css'
import FolderCard from '../../components/folderCard/FolderCard'
import { useEffect, useState } from "react"
import { supabase } from '../../lib/supabase'
import { LoadingScreen } from '../../components/Navbar/Navbar'
import { useLoadingDelay } from '../../lib/useLoadingDelay'

const SUBTESTS = [
    {
        id: 1,
        title: 'Penalaran Umum',
        subtitle: 'Logika & Analisis',
        icon: '🧠',
        color: '#FF6B6B',
        href: '/materi/pu',
        table: 'materi_pu'
    },
    {
        id: 2,
        title: 'Pengetahuan Kuantitatif',
        subtitle: 'Matematika Dasar',
        icon: '📊',
        color: '#4ECDC4',
        href: '/materi/pk',
        table: 'materi_pk'
    },
    {
        id: 3,
        title: 'Pemahaman Baca dan Menulis',
        subtitle: 'Penguasaan penulisan dengan kaidah yang benar',
        icon: '📖',
        color: '#45B7D1',
        href: '/materi/pbm',
        table: 'materi_pbm'
    },
    {
        id: 4,
        title: 'Pengetahuan & Pemahaman Umum',
        subtitle: 'Pengetahuan & Pemahaman',
        icon: '🌍',
        color: '#96CEB4',
        href: '/materi/ppu',
        table: 'materi_ppu'
    },
    {
        id: 5,
        title: 'Literasi Bahasa Indonesia',
        subtitle: 'Kemampuan memahami teks Indonesia',
        icon: '🇮🇩',
        color: '#E74C3C',
        href: '/materi/lbi',
        table: 'materi_lbi'
    },
    {
        id: 6,
        title: 'Literasi Bahasa Inggris',
        subtitle: 'Kemampuan memahami teks Inggris',
        icon: '🇬🇧',
        color: '#3498DB',
        href: '/materi/lbe',
        table: 'materi_lbe'
    },
    {
        id: 7,
        title: 'Penalaran Matematika',
        subtitle: 'Kemampuan berpikir logis matematis',
        icon: '🔢',
        color: '#9B59B6',
        href: '/materi/pm',
        table: 'materi_pm'
    }
];

export default function Materi() {
    const [counts, setCounts] = useState({});
    const [dataReady, setDataReady] = useState(false);
    const showLoading = useLoadingDelay(dataReady, 500);

    useEffect(() => {
        let isMounted = true;
        async function fetchCounts() {
            const newCounts = {};
            for (const subtest of SUBTESTS) {
                const { count, error } = await supabase
                    .from(subtest.table)
                    .select('*', { count: 'exact', head: true });
                newCounts[subtest.table] = error ? 0 : count;
            }
            if (isMounted) {
                setCounts(newCounts);
                setDataReady(true);
            }
        }
        fetchCounts();
        return () => { isMounted = false; }
    }, []);

    const subtestDataMateri = SUBTESTS.map(subtest => ({
        ...subtest,
        questionCount: counts[subtest.table] ?? 0
    }));

    return(
        <>
            <LoadingScreen show={showLoading} />
            <Navbar />
            <div className={`${styles.container} ${showLoading ? styles.fadeOut : styles.fadeIn}`}>
                <FolderCard data={subtestDataMateri} tipe="Materi"/>
            </div>
        </>
    )
}