import { useEffect, useState } from 'react';

/**
 * Hook untuk menambah artificial delay pada loading state
 * Berguna untuk smooth transition & persepsi kecepatan yang lebih baik
 * @param {boolean} isReady - apakah data sudah siap
 * @param {number} minDuration - durasi minimal loading (ms), default 2000
 * @returns {boolean} - apakah loading sudah selesai
 */
export function useLoadingDelay(isReady, minDuration = 500) {
  const [showLoading, setShowLoading] = useState(!isReady);

  useEffect(() => {
    if (!isReady) {
      setShowLoading(true);
      return;
    }

    const startTime = Date.now();
    const timer = setTimeout(() => {
      const elapsed = Date.now() - startTime;
      const remaining = Math.max(0, minDuration - elapsed);
      setTimeout(() => setShowLoading(false), remaining);
    }, 0);

    return () => clearTimeout(timer);
  }, [isReady, minDuration]);

  return showLoading;
}
