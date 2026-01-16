// src/components/Hero/Hero.jsx
import { memo, useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '../../context/RoleContext';
import styles from './Hero.module.css';
import PremiumUpgradeModal from '../PremiumUpgradeModal/PremiumUpgradeModal';

const BACKGROUNDS = [
  '/ui1.jpg',
  '/ui2.jpg',
  '/itb1.jpg',
  '/itb2.jpg',
  '/unair1.jpg'
];

const UTBK_DATE = new Date('2026-04-21T07:00:00');

const getTimeLeft = () => {
  const now = new Date();
  const diff = Math.max(0, UTBK_DATE - now);
  const totalSeconds = Math.floor(diff / 1000);

  return {
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    totalSeconds
  };
};

// ==================== COUNTDOWN ITEM COMPONENT ====================
const CountdownItem = memo(({ value, label }) => (
  <div className={styles.countdownItem}>
    <span className={styles.countdownValue}>
      {String(value).padStart(2, '0')}
    </span>
    <span className={styles.countdownUnitLabel}>{label}</span>
  </div>
));

CountdownItem.displayName = 'CountdownItem';

// ==================== COUNTDOWN DISPLAY ====================
const CountdownDisplay = memo(({ days, hours, minutes, seconds }) => (
  <div className={styles.countdownSection}>
    <span className={styles.countdownLabel}>Waktu Tersisa Menuju UTBK 2026</span>
    <div className={styles.countdownContainer}>
      <CountdownItem value={days} label="Hari" />
      <div className={styles.countdownDivider}>:</div>
      <CountdownItem value={hours} label="Jam" />
      <div className={styles.countdownDivider}>:</div>
      <CountdownItem value={minutes} label="Menit" />
      <div className={styles.countdownDivider}>:</div>
      <CountdownItem value={seconds} label="Detik" />
    </div>
  </div>
));

CountdownDisplay.displayName = 'CountdownDisplay';

// ==================== PREMIUM CTA COMPONENT ====================
const PremiumCTASection = memo(({ userRole, onUpgradeClick, onRegisterClick }) => {
  if (userRole === 'subs' || userRole === 'admin') {
    return null;
  }

  return (
    <div className={styles.ctaSection}>
      <div className={styles.premiumCTA}>
        <div className={styles.premiumIcon}>⭐</div>
        <h3 className={styles.premiumTitle}>
          {userRole ? 'Upgrade ke Premium!' : 'Mulai Persiapan Sekarang!'}
        </h3>
        <p className={styles.premiumDesc}>
          Akses penuh materi UTBK, latihan soal unlimited, dan fitur eksklusif untuk meningkatkan skor Anda
        </p>
        <div className={styles.ctaButtons}>
          {userRole ? (
            <button
              className={styles.premiumBtn}
              onClick={onUpgradeClick}
              type="button"
            >
              ⭐ Upgrade Premium
            </button>
          ) : (
            <>
              <button
                className={styles.registerBtn}
                onClick={onRegisterClick}
                type="button"
              >
                🚀 Daftar Gratis
              </button>
              <button
                className={styles.premiumBtn}
                onClick={onUpgradeClick}
                type="button"
              >
                ⭐ Atau Upgrade Premium
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
});

PremiumCTASection.displayName = 'PremiumCTASection';

// ==================== BACKGROUND CAROUSEL ====================
const BackgroundCarousel = memo(({ currentIndex, fade }) => (
  <div
    className={styles.heroBg}
    style={{
      backgroundImage: `url(${BACKGROUNDS[currentIndex]})`,
      opacity: fade ? 1 : 0
    }}
    aria-hidden="true"
  />
));

BackgroundCarousel.displayName = 'BackgroundCarousel';

// ==================== MAIN HERO COMPONENT ====================
function UTBKHeroSection() {
  const [bgIndex, setBgIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());
  const [modalOpen, setModalOpen] = useState(false);
  const intervalRef = useRef(null);
  const bgIntervalRef = useRef(null);
  const navigate = useNavigate();
  const { user, role } = useRole();

  // ==================== BACKGROUND ROTATION ====================
  useEffect(() => {
    bgIntervalRef.current = setInterval(() => {
      setFade(false);
      const timer = setTimeout(() => {
        setBgIndex((prev) => (prev + 1) % BACKGROUNDS.length);
        setFade(true);
      }, 800);

      return () => clearTimeout(timer);
    }, 6000);

    return () => {
      if (bgIntervalRef.current) clearInterval(bgIntervalRef.current);
    };
  }, []);

  // ==================== COUNTDOWN TIMER ====================
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // ==================== EVENT HANDLERS ====================
  const handleUpgradeClick = useCallback(() => {
    setModalOpen(true);
  }, []);

  const handleRegisterClick = useCallback(() => {
    navigate('/register');
  }, [navigate]);

  const handleModalClose = useCallback(() => {
    setModalOpen(false);
  }, []);

  return (
    <>
      <section className={styles.heroSection}>
        {/* Background Image */}
        <BackgroundCarousel currentIndex={bgIndex} fade={fade} />

        {/* Overlay Gradient */}
        <div className={styles.heroOverlay} aria-hidden="true" />

        {/* Particle Effect */}
        <div className={styles.heroParticles} aria-hidden="true" />

        {/* Main Content */}
        <div className={styles.heroContent}>
          {/* Badge */}
          <div className={styles.heroBadge}>
            UTBK 2026
          </div>

          {/* Text Section */}
          <div className={styles.heroTextSection}>
            <h1 className={styles.heroTitle}>
              Wujudkan Impian di PTN Pilihan Anda
            </h1>
            <p className={styles.heroSubtitle}>
              Persiapan UTBK yang komprehensif dengan materi berkualitas dan latihan soal unlimited
            </p>
          </div>

          {/* Countdown */}
          <CountdownDisplay {...timeLeft} />

          {/* CTA Section */}
          <PremiumCTASection
            userRole={user ? role : null}
            onUpgradeClick={handleUpgradeClick}
            onRegisterClick={handleRegisterClick}
          />
        </div>
      </section>

      {/* Premium Upgrade Modal */}
      <PremiumUpgradeModal
        open={modalOpen}
        onClose={handleModalClose}
      />
    </>
  );
}

export default memo(UTBKHeroSection);