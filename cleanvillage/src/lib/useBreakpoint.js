import { useState, useEffect } from 'react';

const safeWidth = () => (typeof window !== 'undefined' ? window.innerWidth : 1280);

export function useIsMobile(breakpoint = 900) {
  const [isMobile, setIsMobile] = useState(() => safeWidth() < breakpoint);
  useEffect(() => {
    const handler = () => setIsMobile(window.innerWidth < breakpoint);
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, [breakpoint]);
  return isMobile;
}
