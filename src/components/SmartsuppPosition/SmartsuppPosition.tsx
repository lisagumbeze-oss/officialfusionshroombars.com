'use client';

import { useEffect } from 'react';
import { getSmartsuppMobileOffsetY, SMARTSUPP_MOBILE_QUERY } from '@/lib/smartsupp-offset';

function applySmartsuppOffset() {
  const smartsupp = (window as Window & { _smartsupp?: { offsetY?: number } })._smartsupp;
  if (!smartsupp) return;

  smartsupp.offsetY = window.matchMedia(SMARTSUPP_MOBILE_QUERY).matches
    ? getSmartsuppMobileOffsetY()
    : 0;
}

export default function SmartsuppPosition() {
  useEffect(() => {
    applySmartsuppOffset();

    window.addEventListener('resize', applySmartsuppOffset);
    window.addEventListener('orientationchange', applySmartsuppOffset);

    const interval = window.setInterval(applySmartsuppOffset, 500);
    const timeout = window.setTimeout(() => window.clearInterval(interval), 15000);

    return () => {
      window.removeEventListener('resize', applySmartsuppOffset);
      window.removeEventListener('orientationchange', applySmartsuppOffset);
      window.clearInterval(interval);
      window.clearTimeout(timeout);
    };
  }, []);

  return null;
}
