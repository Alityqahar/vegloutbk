// src/components/SubscriptionGate/SubscriptionGate.jsx
import { memo, useState } from 'react';
import { useRole } from '../../context/RoleContext';
import styles from './SubscriptionGate.module.css';
import PremiumUpgradeModal from '../PremiumUpgradeModal/PremiumUpgradeModal';

const SubscriptionGate = memo(({ children, feature = 'fitur ini' }) => {
  const { role, hasAccess } = useRole();
  const [modalOpen, setModalOpen] = useState(false);

  if (hasAccess) {
    return children;
  }

  return (
    <>
      <div className={styles.gateContainer}>
        <div className={styles.gateCard}>
          <div className={styles.gateIcon}>🔒</div>
          <h3 className={styles.gateTitle}>
            {role === 'user' ? 'Fitur Premium' : 'Login Diperlukan'}
          </h3>
          <p className={styles.gateDesc}>
            {role === 'user' 
              ? `Akses ${feature} tersedia untuk member premium. Upgrade sekarang untuk akses penuh!`
              : `Silakan login untuk mengakses ${feature}.`
            }
          </p>
          
          {role === 'user' ? (
            <div className={styles.gateActions}>
              <button 
                className={styles.gateBtnPrimary}
                onClick={() => setModalOpen(true)}
              >
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

      <PremiumUpgradeModal 
        open={modalOpen} 
        onClose={() => setModalOpen(false)} 
      />
    </>
  );
});

SubscriptionGate.displayName = 'SubscriptionGate';

export default SubscriptionGate;