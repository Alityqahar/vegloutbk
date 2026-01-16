// src/components/Hero/Hero.jsx
import { memo, useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRole } from '../../context/RoleContext';
import styles from './Hero.module.css';
import PremiumUpgradeModal from '../PremiumUpgradeModal/PremiumUpgradeModal';

const backgrounds = [
  '/ui1.jpg',
  '/ui2.jpg',
  '/itb1.jpg',
  '/itb2.jpg',
  '/unair1.jpg'
];

const UTBK_DATE = new Date('2026-04-21T07:00:00');

function getTimeLeft() {
  const now = new Date();
  const diff = UTBK_DATE - now;
  const totalSeconds = Math.max(0, Math.floor(diff / 1000));

  return {
    days: Math.floor(totalSeconds / (3600 * 24)),
    hours: Math.floor((totalSeconds % (3600 * 24)) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    totalSeconds
  };
}

const CountdownCircle = memo(({ totalSeconds }) => {
  const TOTAL_SECONDS = Math.max(1, Math.floor((UTBK_DATE - new Date()) / 1000));
  const percent = totalSeconds / TOTAL_SECONDS;
  const radius = 90;
  const stroke = 12;
  const normalizedRadius = radius - stroke / 2;
  const circumference = normalizedRadius * 2 * Math.PI;
  const strokeDashoffset = circumference * (1 - percent);

  return (
    <svg
      height={radius * 2}
      width={radius * 2}
      className={styles.countdownSvg}
    >
      <defs>
        <linearGradient id="countdown-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ff6b6b" />
          <stop offset="50%" stopColor="#4ecdc4" />
          <stop offset="100%" stopColor="#45b7d1" />
        </linearGradient>
      </defs>
      <circle
        stroke="rgba(255,255,255,0.15)"
        fill="none"
        strokeWidth={stroke}
        cx={radius}
        cy={radius}
        r={normalizedRadius}
      />
      <circle
        stroke="url(#countdown-gradient)"
        fill="none"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        cx={radius}
        cy={radius}
        r={normalizedRadius}
        className={styles.countdownProgress}
      />
    </svg>
  );
});

CountdownCircle.displayName = 'CountdownCircle';

const CountdownItem = memo(({ value, label }) => (
  <div className={styles.countdownItem}>
    <span className={styles.countdownValue}>
      {String(value).padStart(2, '0')}
    </span>
    <small className={styles.countdownLabel}>{label}</small>
  </div>
));

CountdownItem.displayName = 'CountdownItem';

const CircularCountdown = memo(({ days, hours, minutes, seconds, totalSeconds }) => (
  <div className={styles.countdownContainer}>
    <div className={styles.circularWrapper}>
      <CountdownCircle totalSeconds={totalSeconds} />
    </div>
    <div className={styles.countdownNumbers}>
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

CircularCountdown.displayName = 'CircularCountdown';

const PremiumCTA = memo(({ userRole, onUpgradeClick, onRegisterClick }) => {
  if (userRole === 'subs' || userRole === 'admin') return null;

  return (
    <div className={styles.premiumCTA}>
      <div className={styles.premiumIcon}>⭐</div>
      <h3 className={styles.premiumTitle}>
        {userRole ? 'Upgrade ke Premium!' : 'Daftar & Dapatkan Akses Premium!'}
      </h3>
      <p className={styles.premiumDesc}>
        Akses penuh materi, latihan soal, dan fitur eksklusif untuk persiapan UTBK terbaikmu
      </p>
      <button
        className={styles.premiumBtn}
        onClick={userRole ? onUpgradeClick : onRegisterClick}
      >
        {userRole ? '⭐ Upgrade Sekarang' : '🚀 Daftar Gratis'}
      </button>
    </div>
  );
});

PremiumCTA.displayName = 'PremiumCTA';

function UTBKHeroSection() {
  const [bgIndex, setBgIndex] = useState(0);
  const [fade, setFade] = useState(true);
  const [timeLeft, setTimeLeft] = useState(getTimeLeft());
  const [modalOpen, setModalOpen] = useState(false);
  const intervalRef = useRef();
  const bgIntervalRef = useRef();
  const navigate = useNavigate();
  const { user, role } = useRole();

  // Background rotation
  useEffect(() => {
    bgIntervalRef.current = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setBgIndex((i) => (i + 1) % backgrounds.length);
        setFade(true);
      }, 800);
    }, 6000);

    return () => clearInterval(bgIntervalRef.current);
  }, []);

  // Countdown timer
  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setTimeLeft(getTimeLeft());
    }, 1000);

    return () => clearInterval(intervalRef.current);
  }, []);

  const handleUpgradeClick = () => {
    setModalOpen(true);
  };

  const handleRegisterClick = () => {
    navigate('/register');
  };

  return (
    <>
      <section className={styles.heroSection}>
        <div 
          className={styles.heroBg}
          style={{
            backgroundImage: `url(${backgrounds[bgIndex]})`,
            opacity: fade ? 1 : 0
          }}
        />
        <div className={styles.heroOverlay} />
        <div className={styles.heroParticles} />
        
        <div className={styles.heroContent}>
          <div className={styles.heroBadge}>
            UTBK 2026
          </div>
          
          <div className={styles.heroText}>
            <h1 className={styles.heroTitle}>
              Wujudkan Mimpi di PTN Impian
            </h1>
            <p className={styles.heroSubtitle}>
              Katanya mau bantai-bantai UTBK 🎯
            </p>
          </div>
          
          <CircularCountdown {...timeLeft} />
          
          <PremiumCTA 
            userRole={user ? role : null} 
            onUpgradeClick={handleUpgradeClick}
            onRegisterClick={handleRegisterClick}
          />
        </div>
      </section>

      <PremiumUpgradeModal 
        open={modalOpen} 
        onClose={() => setModalOpen(false)} 
      />
    </>
  );
}

export default memo(UTBKHeroSection);