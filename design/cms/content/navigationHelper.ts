import type { WebsiteContent } from '../types/content';

export interface NavbarBlock {
  type: string;
  content?: string;
  slug?: string;
}

export interface NavbarPattern {
  type: string;
  blocks?: NavbarBlock[];
}

export interface JsonNavItem {
  label: string;
  slug: string;
}

export interface NavigationItem {
  href: string;
  label: string;
  slug: string;
  componentType: 'textlink' | 'button';
  textLinkVariant?: 'primary';
  weight?: 'medium';
  underline?: 'hover';
  variant?: 'primary';
  rightIcon?: string;
}

/**
 * Enhances navigation items with CMS content
 * Merges hardcoded navigation with dynamic labels from CMS
 */
export function enhanceNavigationWithCMS(
  navigationItems: NavigationItem[],
  initialContent: WebsiteContent | null
): NavigationItem[] {
  // Use the new globals structure
  if (!initialContent?.globals?.navbar?.patterns) {
    return navigationItems;
  }

  // Find navbar pattern
  const navbarPattern = initialContent.globals.navbar.patterns.find(
    (pattern: NavbarPattern) => pattern.type === 'navbar'
  );
  
  if (!navbarPattern?.blocks) {
    return navigationItems;
  }

  // Extract nav items from blocks
  const jsonNavItems: JsonNavItem[] = navbarPattern.blocks
    .filter((block: NavbarBlock) => block.type === 'navItem')
    .map((block: NavbarBlock) => ({
      label: block.content || '',
      slug: block.slug || ''
    }));

  // Merge JSON content with existing navItems
  return navigationItems.map(item => {
    const jsonItem = jsonNavItems.find((jsonNav: JsonNavItem) => jsonNav.slug === item.slug);
    return {
      ...item,
      label: jsonItem?.label || item.label
    };
  });
}

// Re-export NavigationItem for backward compatibility
export type { NavigationItem as NavigationItemType }; 