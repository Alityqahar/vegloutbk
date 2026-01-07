import React, { useEffect, useState, useRef } from 'react';

const backgrounds = [
    '/ui1.jpg',
    '/ui2.jpg',
    '/itb1.jpg',
    '/itb2.jpg',
    '/unair1.jpg'
];

const UTBK_DATE = new Date('2026-03-30T07:00:00');

function getTimeLeft() {
const now = new Date();
const diff = UTBK_DATE - now;
const totalSeconds = Math.max(0, Math.floor(diff / 1000));
const days = Math.floor(totalSeconds / (3600 * 24));
const hours = Math.floor((totalSeconds % (3600 * 24)) / 3600);
const minutes = Math.floor((totalSeconds % 3600) / 60);
const seconds = totalSeconds % 60;
return { days, hours, minutes, seconds, totalSeconds };
}

function CircularCountdown({ days, hours, minutes, seconds, totalSeconds }) {
const TOTAL_SECONDS = Math.max(1, Math.floor((UTBK_DATE - new Date()) / 1000));
const percent = totalSeconds / TOTAL_SECONDS;
const radius = 70;
const stroke = 10;
const normalizedRadius = radius - stroke / 2;
const circumference = normalizedRadius * 2 * Math.PI;
const strokeDashoffset = circumference * (1 - percent);

return (
<div className="countdown-container">
    <div className="circular-wrapper">
    <svg
        height={radius * 2}
        width={radius * 2}
        className="countdown-svg"
    >
        <circle
        stroke="rgba(255,255,255,0.2)"
        fill="none"
        strokeWidth={stroke}
        cx={radius}
        cy={radius}
        r={normalizedRadius}
        />
        <circle
        stroke="url(#gradient)"
        fill="none"
        strokeWidth={stroke}
        strokeLinecap="round"
        strokeDasharray={circumference}
        strokeDashoffset={strokeDashoffset}
        cx={radius}
        cy={radius}
        r={normalizedRadius}
        style={{ 
            transition: 'stroke-dashoffset 1s linear',
            transform: 'rotate(-90deg)',
            transformOrigin: '50% 50%'
        }}
        />
        <defs>
        <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ff6b6b" />
            <stop offset="50%" stopColor="#4ecdc4" />
            <stop offset="100%" stopColor="#45b7d1" />
        </linearGradient>
        </defs>
    </svg>
    </div>
    <div className="countdown-numbers">
    <div className="countdown-item">
        <span className="countdown-value">{String(days).padStart(2, '0')}</span>
        <small className="countdown-label">Hari</small>
    </div>
    <div className="countdown-divider">:</div>
    <div className="countdown-item">
        <span className="countdown-value">{String(hours).padStart(2, '0')}</span>
        <small className="countdown-label">Jam</small>
    </div>
    <div className="countdown-divider">:</div>
    <div className="countdown-item">
        <span className="countdown-value">{String(minutes).padStart(2, '0')}</span>
        <small className="countdown-label">Menit</small>
    </div>
    <div className="countdown-divider">:</div>
    <div className="countdown-item">
        <span className="countdown-value">{String(seconds).padStart(2, '0')}</span>
        <small className="countdown-label">Detik</small>
    </div>
    </div>
</div>
);
}

export default function UTBKHeroSection() {
const [bgIndex, setBgIndex] = useState(0);
const [fade, setFade] = useState(true);
const [timeLeft, setTimeLeft] = useState(getTimeLeft());
const intervalRef = useRef();

useEffect(() => {
const bgInterval = setInterval(() => {
    setFade(false);
    setTimeout(() => {
    setBgIndex((i) => (i + 1) % backgrounds.length);
    setFade(true);
    }, 800);
}, 6000);
return () => clearInterval(bgInterval);
}, []);

useEffect(() => {
intervalRef.current = setInterval(() => {
    setTimeLeft(getTimeLeft());
}, 1000);
return () => clearInterval(intervalRef.current);
}, []);

return (
<>
    <style>{`
    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }

    body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        overflow-x: hidden;
    }

    .hero-section {
        margin-top: 40px;
        position: relative;
        width: 100vw;
        min-height: 100vh;
        display: flex;
        align-items: center;
        justify-content: center;
        background-size: cover;
        background-position: center;
        background-repeat: no-repeat;
        overflow: hidden;
    }

    .hero-bg {
        position: absolute;
        inset: 0;
        background-size: cover;
        background-position: center;
        transition: opacity 0.8s ease-in-out;
    }

    .hero-overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(
        135deg,
        rgba(20, 20, 40, 0.85) 0%,
        rgba(30, 30, 60, 0.75) 50%,
        rgba(45, 45, 80, 0.65) 100%
        );
        z-index: 1;
    }

    .hero-particles {
        position: absolute;
        inset: 0;
        background-image: 
        radial-gradient(circle at 20% 50%, rgba(255, 107, 107, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 80%, rgba(78, 205, 196, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 40% 20%, rgba(69, 183, 209, 0.08) 0%, transparent 50%);
        z-index: 1;
        animation: particleFloat 20s ease-in-out infinite;
    }

    @keyframes particleFloat {
        0%, 100% { opacity: 0.3; transform: scale(1); }
        50% { opacity: 0.6; transform: scale(1.1); }
    }

    .hero-content {
        position: relative;
        z-index: 2;
        color: #fff;
        text-align: center;
        max-width: 900px;
        margin: 0 auto;
        padding: 3rem 2rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2.5rem;
        animation: fadeInUp 1.2s ease-out;
    }

    @keyframes fadeInUp {
        from {
        opacity: 0;
        transform: translateY(30px);
        }
        to {
        opacity: 1;
        transform: translateY(0);
        }
    }

    .hero-badge {
        display: inline-block;
        padding: 0.5rem 1.5rem;
        background: rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
        border-radius: 50px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        font-size: 0.875rem;
        font-weight: 600;
        letter-spacing: 1px;
        text-transform: uppercase;
        animation: pulse 2s ease-in-out infinite;
    }

    @keyframes pulse {
        0%, 100% { transform: scale(1); opacity: 0.9; }
        50% { transform: scale(1.05); opacity: 1; }
    }

    .hero-title {
        font-size: 3.5rem;
        font-weight: 900;
        line-height: 1.2;
        letter-spacing: -1px;
        text-shadow: 0 8px 32px rgba(0, 0, 0, 0.4);
        background: linear-gradient(135deg, #ffffff 0%, #f0f0f0 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        margin-bottom: 0.5rem;
    }

    .hero-subtitle {
        font-size: 1.125rem;
        font-weight: 500;
        color: rgba(255, 255, 255, 0.85);
        margin-bottom: 1rem;
        text-shadow: 0 2px 12px rgba(0, 0, 0, 0.3);
    }

    .hero-motivation {
        font-size: 1.25rem;
        font-weight: 600;
        line-height: 1.7;
        max-width: 700px;
        color: #fff;
        text-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
        padding: 1.5rem 2rem;
        background: rgba(255, 255, 255, 0.08);
        backdrop-filter: blur(10px);
        border-radius: 16px;
        border: 1px solid rgba(255, 255, 255, 0.15);
        font-style: italic;
        position: relative;
    }

    .hero-motivation::before {
        content: '"';
        position: absolute;
        top: -10px;
        left: 20px;
        font-size: 4rem;
        color: rgba(255, 107, 107, 0.4);
        font-family: Georgia, serif;
    }

    .countdown-container {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2rem;
        padding: 2.5rem;
        background: rgba(255, 255, 255, 0.06);
        backdrop-filter: blur(20px);
        border-radius: 24px;
        border: 1px solid rgba(255, 255, 255, 0.15);
        box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
        min-width: 320px;
    }

    .circular-wrapper {
        position: relative;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .countdown-svg {
        filter: drop-shadow(0 4px 16px rgba(78, 205, 196, 0.3));
    }

    .countdown-numbers {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 1rem;
    }

    .countdown-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.25rem;
    }

    .countdown-value {
        font-size: 2.5rem;
        font-weight: 800;
        color: #fff;
        text-shadow: 0 4px 16px rgba(0, 0, 0, 0.3);
        line-height: 1;
        min-width: 60px;
        text-align: center;
        font-variant-numeric: tabular-nums;
    }

    .countdown-label {
        font-size: 0.75rem;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.7);
        text-transform: uppercase;
        letter-spacing: 1px;
    }

    .countdown-divider {
        font-size: 2rem;
        font-weight: 700;
        color: rgba(255, 255, 255, 0.4);
        margin: 0 0.25rem;
        line-height: 1;
        padding-bottom: 1.5rem;
    }

    .hero-cta {
        display: flex;
        gap: 1rem;
        margin-top: 1rem;
    }

    .cta-button {
        padding: 1rem 2.5rem;
        font-size: 1rem;
        font-weight: 700;
        border: none;
        border-radius: 12px;
        cursor: pointer;
        transition: all 0.3s ease;
        text-transform: uppercase;
        letter-spacing: 0.5px;
    }

    .cta-primary {
        background: linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%);
        color: white;
        box-shadow: 0 8px 24px rgba(255, 107, 107, 0.4);
    }

    .cta-primary:hover {
        transform: translateY(-2px);
        box-shadow: 0 12px 32px rgba(255, 107, 107, 0.5);
    }

    .cta-secondary {
        background: rgba(255, 255, 255, 0.1);
        color: white;
        border: 2px solid rgba(255, 255, 255, 0.3);
        backdrop-filter: blur(10px);
    }

    .cta-secondary:hover {
        background: rgba(255, 255, 255, 0.2);
        border-color: rgba(255, 255, 255, 0.5);
    }

    @media (max-width: 768px) {
        .hero-content {
        padding: 2rem 1.5rem;
        gap: 2rem;
        }

        .hero-title {
        font-size: 2rem;
        }

        .hero-subtitle {
        font-size: 1rem;
        }

        .hero-motivation {
        font-size: 1rem;
        padding: 1rem 1.5rem;
        }

        .countdown-container {
        padding: 1.5rem;
        min-width: 280px;
        }

        .countdown-value {
        font-size: 1.75rem;
        min-width: 45px;
        }

        .countdown-label {
        font-size: 0.65rem;
        }

        .countdown-divider {
        font-size: 1.5rem;
        margin: 0 0.125rem;
        }

        .countdown-numbers {
        gap: 0.5rem;
        }

        .hero-cta {
        flex-direction: column;
        width: 100%;
        }

        .cta-button {
        width: 100%;
        padding: 0.875rem 2rem;
        }
    }

    @media (max-width: 480px) {
        .hero-title {
        font-size: 1.75rem;
        }

        .hero-motivation {
        font-size: 0.9rem;
        }

        .countdown-value {
        font-size: 1.5rem;
        min-width: 38px;
        }
    }
    `}</style>

    <section className="hero-section">
    <div 
        className="hero-bg"
        style={{
        backgroundImage: `url(${backgrounds[bgIndex]})`,
        opacity: fade ? 1 : 0
        }}
    />
    <div className="hero-overlay" />
    <div className="hero-particles" />
    
    <div className="hero-content">
        <div className="hero-badge">UTBK 2026</div>
        
        <div>
        <h1 className="hero-title">
            Wujudkan Mimpi di PTN Impian
        </h1>
        <p className="hero-subtitle">
            Katanya mau bantai-bantai UTBK
        </p>
        </div>

        <CircularCountdown {...timeLeft} />
    </div>
    </section>
</>
);
}