import Navbar from "../../components/Navbar/Navbar"
import styles from './Latsol.module.css'
import FolderCard from '../../components/folderCard/FolderCard'
import { useEffect, useState } from "react"
import { supabase } from '../../lib/supabase'
import { LoadingScreen } from '../../components/Navbar/Navbar'

const SUBTESTS = [
    {
        id: 1,
        title: 'Penalaran Umum',
        subtitle: 'Logika & Analisis',
        icon: '🧠',
        color: '#FF6B6B',
        href: '/latsol/pu',
        table: 'latsol_pu'
    },
    {
        id: 2,
        title: 'Pengetahuan Kuantitatif',
        subtitle: 'Matematika Dasar',
        icon: '📊',
        color: '#4ECDC4',
        href: '/latsol/pk',
        table: 'latsol_pk'
    },
    {
        id: 3,
        title: 'Pemahaman Baca dan Menulis',
        subtitle: 'Penguasaan penulisan dengan kaidah yang benar',
        icon: '📖',
        color: '#45B7D1',
        href: '/latsol/pbm',
        table: 'latsol_pbm'
    },
    {
        id: 4,
        title: 'Pengetahuan & Pemahaman Umum',
        subtitle: 'Pengetahuan & Pemahaman',
        icon: '🌍',
        color: '#96CEB4',
        href: '/latsol/ppu',
        table: 'latsol_ppu'
    },
    {
        id: 5,
        title: 'Literasi Bahasa Indonesia',
        subtitle: 'Kemampuan memahami teks Indonesia',
        icon: '🇮🇩',
        color: '#E74C3C',
        href: '/latsol/lbi',
        table: 'latsol_lbi'
    },
    {
        id: 6,
        title: 'Literasi Bahasa Inggris',
        subtitle: 'Kemampuan memahami teks Inggris',
        icon: '🇬🇧',
        color: '#3498DB',
        href: '/latsol/lbe',
        table: 'latsol_lbe'
    },
    {
        id: 7,
        title: 'Penalaran Matematika',
        subtitle: 'Kemampuan berpikir logis matematis',
        icon: '🔢',
        color: '#9B59B6',
        href: '/latsol/pm',
        table: 'latsol_pm'
    }
];

export default function Latsol() {
    const [counts, setCounts] = useState({});
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let isMounted = true;
        async function fetchCounts() {
            setLoading(true);
            const newCounts = {};
            for (const subtest of SUBTESTS) {
                const { count, error } = await supabase
                    .from(subtest.table)
                    .select('*', { count: 'exact', head: true });
                newCounts[subtest.table] = error ? 0 : count;
            }
            if (isMounted) setCounts(newCounts);
            setLoading(false);
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
            <LoadingScreen show={loading} />
            <Navbar />
            <div className={styles.container}>
                <FolderCard data={subtestDataMateri} tipe="Soal"/>
            </div>
        </>
    )
}