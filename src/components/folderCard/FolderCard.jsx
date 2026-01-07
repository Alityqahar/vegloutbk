// FolderCard.jsx
import React from 'react';
import styles from './FolderCard.module.css';
import { Link } from 'react-router-dom';

// Demo Component
export default function UTBKFolderDemo({data,tipe,}) {

    const FolderCard = ({ 
    title, 
    subtitle, 
    icon, 
    color = '#4A90E2', 
    questionCount, 
    href
    }) => {
    return (
    <Link
        to={href}
        className={styles.folderCard}
        style={{ '--folder-color': color, textDecoration: 'none', color: 'inherit' }}
        tabIndex={0}
    >
        <div className={styles.folderTab}>
        <div className={styles.folderLabel}>{title}</div>
        </div>
        <div className={styles.folderBody}>
        <div className={styles.folderContent}>
            <div className={styles.iconWrapper}>
            {icon ? (
                <span className={styles.iconText}>{icon}</span>
            ) : (
                <div className={styles.defaultIcon}>📁</div>
            )}
            </div>
            
            <div className={styles.folderInfo}>
            <h3 className={styles.folderTitle}>{title}</h3>
            {subtitle && <p className={styles.folderSubtitle}>{subtitle}</p>}
            
            {questionCount && (
                <div className={styles.folderStats}>
                <span className={styles.statBadge}>
                    {questionCount} {tipe}
                </span>
                </div>
            )} 
            </div>
        </div>
        
        <div className={styles.folderArrow}>→</div>
        </div>
    </Link>
    );
    };

return (
<div style={{ padding: '2rem', minHeight: '100vh' }}>
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
    <header style={{ marginBottom: '2rem', textAlign: 'center' }}>
        <h1 style={{ 
        fontSize: '2.5rem', 
        fontWeight: '800', 
        color: '#2c3e50',
        marginBottom: '0.5rem'
        }}>
        {tipe} Subtes UTBK 2026
        </h1>
        <p style={{ 
        fontSize: '1.1rem', 
        color: '#7f8c8d' 
        }}>
        Pilih subtes untuk memulai belajar
        </p>
    </header>

    <div className={styles.folderGrid}>
        {data.map((subtest) => (
        <FolderCard
            key={subtest.id}
            title={subtest.title}
            subtitle={subtest.subtitle}
            icon={subtest.icon}
            color={subtest.color}
            questionCount={subtest.questionCount}
            href={subtest.href}
        />
        ))}
    </div>
    </div>
</div>
);
}