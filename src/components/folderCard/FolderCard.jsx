import { memo } from 'react';
import { Link } from 'react-router-dom';
import styles from './FolderCard.module.css';

// Individual Folder Card Component
const FolderCard = memo(({ 
title, 
subtitle, 
icon, 
color = '#4A90E2', 
questionCount, 
href,
tipe
}) => {
return (
<Link
    to={href}
    className={styles.folderCard}
    style={{ '--folder-color': color }}
    aria-label={`${title} - ${questionCount} ${tipe}`}
>
    <div className={styles.folderTab}>
    <div className={styles.folderLabel}>{title}</div>
    </div>
    
    <div className={styles.folderBody}>
    <div className={styles.folderContent}>
        <div className={styles.iconWrapper}>
        {icon ? (
            <span className={styles.iconText} role="img" aria-label={title}>
            {icon}
            </span>
        ) : (
            <div className={styles.defaultIcon}>📁</div>
        )}
        </div>
        
        <div className={styles.folderInfo}>
        <h3 className={styles.folderTitle}>{title}</h3>
        {subtitle && <p className={styles.folderSubtitle}>{subtitle}</p>}
        
        {questionCount !== undefined && (
            <div className={styles.folderStats}>
            <span className={styles.statBadge}>
                {questionCount} {tipe}
            </span>
            </div>
        )}
        </div>
    </div>
    
    <div className={styles.folderArrow} aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
    </div>
    </div>
</Link>
);
});

FolderCard.displayName = 'FolderCard';

// Main component that renders the grid
function UTBKFolderDemo({ data, tipe }) {
return (
<div className={styles.folderSection}>
    <div className={styles.folderContainer}>
    <header className={styles.folderHeader}>
        <h1 className={styles.folderHeaderTitle}>
        {tipe} Subtes UTBK 2026
        </h1>
        <p className={styles.folderHeaderSubtitle}>
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
            tipe={tipe}
        />
        ))}
    </div>
    </div>
</div>
);
}

export default memo(UTBKFolderDemo);