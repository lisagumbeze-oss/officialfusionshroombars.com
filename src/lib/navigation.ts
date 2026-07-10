export type NavLink = {
  label: string;
  href: string;
  description?: string;
};

export type NavItem = {
  label: string;
  href?: string;
  children?: NavLink[];
};

export const guideLinks: NavLink[] = [
  {
    label: 'Mushroom Chocolate Guide',
    href: '/mushroom-chocolate-bars',
    description: 'Complete guide to mushroom chocolate',
  },
  {
    label: 'How to Buy Shroom Bars',
    href: '/buy-shroom-bars',
    description: 'Safe purchasing tips',
  },
  {
    label: 'Microdosing Protocol',
    href: '/microdosing-chocolate',
    description: 'Structured microdosing guide',
  },
  {
    label: 'Neau Tropics Review',
    href: '/neau-tropics',
    description: 'In-depth product review',
  },
];

export function buildMainNavigation(shopCategories: string[] = []): NavItem[] {
  const categoryLinks: NavLink[] = shopCategories.map((category) => ({
    label: category,
    href: `/shop?category=${encodeURIComponent(category)}`,
  }));

  return [
    { label: 'Home', href: '/' },
    {
      label: 'Shop',
      href: '/shop',
      children: [
        {
          label: 'All Products',
          href: '/shop',
          description: 'Browse the full collection',
        },
        ...categoryLinks,
      ],
    },
    {
      label: 'Learn',
      children: [
        {
          label: 'Journal',
          href: '/blog',
          description: 'Stories, tips & culture',
        },
        ...guideLinks,
      ],
    },
    {
      label: 'About',
      children: [
        {
          label: 'Our Story',
          href: '/about',
          description: 'Who we are',
        },
        {
          label: 'FAQ',
          href: '/faq',
          description: 'Common questions answered',
        },
        {
          label: 'Contact',
          href: '/contact',
          description: 'Get in touch with us',
        },
      ],
    },
    { label: 'Wishlist', href: '/wishlist' },
  ];
}

export function isNavItemActive(pathname: string, item: NavItem, search = ''): boolean {
  if (item.href && isLinkActive(pathname, item.href, search)) {
    return true;
  }

  return item.children?.some((child) => isLinkActive(pathname, child.href, search)) ?? false;
}

export function isLinkActive(pathname: string, href: string, search = ''): boolean {
  const [path, query] = href.split('?');

  if (query) {
    const expected = new URLSearchParams(query);
    const current = new URLSearchParams(search.startsWith('?') ? search.slice(1) : search);

    for (const [key, value] of expected.entries()) {
      if (current.get(key) !== value) {
        return false;
      }
    }

    return pathname === path || pathname.startsWith(`${path}/`);
  }

  if (path === '/shop' && !query && search.includes('category=')) {
    return false;
  }

  if (path === '/') return pathname === '/';
  return pathname === path || pathname.startsWith(`${path}/`);
}
