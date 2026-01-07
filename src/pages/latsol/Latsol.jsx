import Navbar from "../../components/Navbar/Navbar"
import styles from './Latsol.module.css'
import FolderCard from '../../components/folderCard/FolderCard'

export default function Materi() {

        const subtestDataMateri = [
    {
        id: 1,
        title: 'Penalaran Umum',
        subtitle: 'Logika & Analisis',
        icon: '🧠',
        color: '#FF6B6B',
        questionCount: 30,
        href: '/subtes/penalaran-umum'
    },
    {
        id: 2,
        title: 'Pengetahuan Kuantitatif',
        subtitle: 'Matematika Dasar',
        icon: '📊',
        color: '#4ECDC4',
        questionCount: 25,
        href: '/subtes/pengetahuan-kuantitatif'
    },
    {
        id: 3,
        title: 'Pemahaman Baca dan Menulis',
        subtitle: 'Penguasaan penulisan dengan kaidah yang benar',
        icon: '📖',
        color: '#45B7D1',
        questionCount: 20,
        href: '/subtes/pemahaman-baca-menulis'
    },
    {
        id: 4,
        title: 'Pengetahuan Umum',
        subtitle: 'Pengetahuan & Pemahaman',
        icon: '🌍',
        color: '#96CEB4',
        questionCount: 20,
        href: '/subtes/pengetahuan-umum'
    },
    {
        id: 5,
        title: 'Literasi Bahasa Indonesia',
        subtitle: 'Kemampuan memahami teks Indonesia',
        icon: '🇮🇩',
        color: '#E74C3C',
        questionCount: 20,
        href: '/subtes/literasi-indonesia'
    },
    {
        id: 6,
        title: 'Literasi Bahasa Inggris',
        subtitle: 'Kemampuan memahami teks Inggris',
        icon: '🇬🇧',
        color: '#3498DB',
        questionCount: 20,
        href: '/materi/lbe'
    },
    {
        id: 7,
        title: 'Penalaran Matematika',
        subtitle: 'Kemampuan berpikir logis matematis',
        icon: '🔢',
        color: '#9B59B6',
        questionCount: 20,
        href: '/subtes/penalaran-matematika'
    }
    ];

    return(
        <>
            <Navbar />
            <div className={styles.container}>
                <FolderCard data={subtestDataMateri} tipe="Soal"/>
            </div>
        </>
    )
}