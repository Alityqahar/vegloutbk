    // src/components/PremiumUpgradeModal/PremiumUpgradeModal.jsx
    import { memo } from 'react';
    import styles from './PremiumUpgradeModal.module.css';

    const PremiumUpgradeModal = memo(({ open, onClose }) => {
    if (!open) return null;

    return (
        <div className={styles.modalBackdrop} onClick={onClose}>
        <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            {/* Close Button */}
            <button className={styles.modalClose} onClick={onClose}>
            ×
            </button>

            {/* Header */}
            <div className={styles.modalHeader}>
            <div className={styles.iconWrapper}>
                ⭐
            </div>
            
            <h2 className={styles.modalTitle}>
                Upgrade ke Premium
            </h2>
            
            <p className={styles.modalSubtitle}>
                Akses penuh ke semua fitur dan materi UTBK
            </p>
            </div>

            {/* Benefits */}
            <div className={styles.benefitsSection}>
            <h3 className={styles.sectionTitle}>
                ✨ Manfaat Premium
            </h3>
            
            <ul className={styles.benefitsList}>
                <li className={styles.benefitItem}>
                <span className={styles.benefitIcon}>📚</span>
                <span>Akses semua materi & latihan soal</span>
                </li>
                <li className={styles.benefitItem}>
                <span className={styles.benefitIcon}>📥</span>
                <span>Download PDF tanpa batas</span>
                </li>
                <li className={styles.benefitItem}>
                <span className={styles.benefitIcon}>✅</span>
                <span>Fitur to-do & notes pribadi</span>
                </li>
                <li className={styles.benefitItem}>
                <span className={styles.benefitIcon}>💬</span>
                <span>Bagikan notes di halaman Social</span>
                </li>
                <li className={styles.benefitItem}>
                <span className={styles.benefitIcon}>⚡</span>
                <span>Dukungan prioritas dari tim</span>
                </li>
            </ul>
            </div>

            {/* How to Upgrade */}
            <div className={styles.stepsSection}>
            <h3 className={styles.sectionTitle}>
                📋 Cara Upgrade Premium
            </h3>
            
            <ol className={styles.stepsList}>
                <li>Hubungi admin melalui kontak di bawah</li>
                <li>Informasikan username dan email Anda</li>
                <li>Lakukan pembayaran sesuai instruksi admin</li>
                <li>Tunggu konfirmasi aktivasi akun Premium</li>
                <li>Nikmati akses penuh semua fitur!</li>
            </ol>
            </div>

            {/* Contact Admin */}
            <div className={styles.contactSection}>
            <h3 className={styles.contactTitle}>
                📞 Hubungi Admin
            </h3>
            
            <div className={styles.contactButtons}>
                <a
                href="https://t.me/najihahubbi"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.contactBtn}
                >
                <span className={styles.contactIcon}>💬</span>
                <span>Telegram: Najiha</span>
                </a>
                
                <a
                href="https://t.me/@Surtishii"
                target="_blank"
                rel="noopener noreferrer"
                className={styles.contactBtn}
                >
                <span className={styles.contactIcon}>💬</span>
                <span>Telegram: Aul</span>
                </a>
            </div>
            </div>

            {/* Footer Note */}
            <p className={styles.footerNote}>
            Dapatkan akses penuh dan maksimalkan persiapan UTBK Anda! 🎯
            </p>
        </div>
        </div>
    );
    });

    PremiumUpgradeModal.displayName = 'PremiumUpgradeModal';

    export default PremiumUpgradeModal;