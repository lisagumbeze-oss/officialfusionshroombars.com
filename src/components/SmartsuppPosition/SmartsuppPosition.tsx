'use client';

import { useEffect } from 'react';

const MOBILE_QUERY = '(max-width: 768px)';

function getMobileOffsetY(): number {
  return 81;
}

function applySmartsuppOffset() {
  const smartsupp = (window as Window & { _smartsupp?: { offsetY?: number } })._smartsupp;
  if (!smartsupp) return;

  smartsupp.offsetY = window.matchMedia(MOBILE_QUERY).matches ? getMobileOffsetY() : 0;
}

export default function SmartsuppPosition() {
  useEffect(() => {
    applySmartsuppOffset();

    window.addEventListener('resize', applySmartsuppOffset);
    window.addEventListener('orientationchange', applySmartsuppOffset);

    const interval = window.setInterval(applySmartsuppOffset, 500);
    const timeout = window.setTimeout(() => window.clearInterval(interval), 10000);

    return () => {
      window.removeEventListener('resize', applySmartsuppOffset);
      window.removeEventListener('orientationchange', applySmartsuppOffset);
      window.clearInterval(interval);
      window.clearTimeout(timeout);
    };
  }, []);

  return null;
}
