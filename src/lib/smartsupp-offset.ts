const MOBILE_BOTTOM_NAV_FALLBACK = 65;
const MOBILE_WIDGET_GAP = 12;
const MOBILE_EXTRA_BUFFER = 16;

function getSafeAreaInsetBottom(): number {
  if (typeof document === 'undefined') return 0;

  const probe = document.createElement('div');
  probe.style.cssText =
    'position:fixed;bottom:0;padding-bottom:env(safe-area-inset-bottom);visibility:hidden;pointer-events:none;';
  document.body.appendChild(probe);
  const inset = parseFloat(getComputedStyle(probe).paddingBottom) || 0;
  document.body.removeChild(probe);
  return inset;
}

export function getSmartsuppMobileOffsetY(): number {
  if (typeof window === 'undefined') {
    return MOBILE_BOTTOM_NAV_FALLBACK + MOBILE_WIDGET_GAP + MOBILE_EXTRA_BUFFER;
  }

  const rootStyles = getComputedStyle(document.documentElement);
  const navHeight =
    parseFloat(rootStyles.getPropertyValue('--mobile-bottom-nav-height')) ||
    MOBILE_BOTTOM_NAV_FALLBACK;

  return Math.ceil(navHeight + getSafeAreaInsetBottom() + MOBILE_WIDGET_GAP + MOBILE_EXTRA_BUFFER);
}

export const SMARTSUPP_MOBILE_QUERY = '(max-width: 768px)';
