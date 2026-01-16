// src/components/SubscriptionGate/SubscriptionGate.jsx
import { memo } from 'react';
import { useRole } from '../../context/RoleContext';
import styles from './SubscriptionGate.module.css';

const SubscriptionGate = memo(({ children, feature = 'fitur ini' }) => {
  const { role, hasAccess } = useRole();

  if (hasAccess) {
    return children;
  }

  return (
    <div className={styles.gateContainer}>
      <div className={styles.gateCard}>
        <div className={styles.gateIcon}>🔒</div>
        <h3 className={styles.gateTitle}>
          {role === 'user' ? 'Fitur Premium' : 'Login Diperlukan'}
        </h3>
        <p className={styles.gateDesc}>
          {role === 'user' 
            ? `Akses ${feature} tersedia untuk member premium. Upgrade akun Anda untuk mendapatkan akses penuh ke semua fitur.`
            : `Silakan login untuk mengakses ${feature}.`
          }
        </p>
        
        {role === 'user' ? (
          <div className={styles.gateActions}>
            <button className={styles.gateBtnPrimary}>
              ⭐ Upgrade ke Premium
            </button>
            <p className={styles.gateBenefits}>
              <strong>Manfaat Premium:</strong>
              <br />
              ✓ Akses semua materi & latihan soal
              <br />
              ✓ Download PDF tanpa batas
              <br />
              ✓ Fitur to-do & notes pribadi
              <br />
              ✓ Dukungan prioritas
            </p>
          </div>
        ) : (
          <div className={styles.gateActions}>
            <a href="/login" className={styles.gateBtnPrimary}>
              Login Sekarang
            </a>
          </div>
        )}
      </div>
    </div>
  );
});

SubscriptionGate.displayName = 'SubscriptionGate';

export default SubscriptionGate;