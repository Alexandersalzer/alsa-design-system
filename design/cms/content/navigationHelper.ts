import type { WebsiteContent } from '../types/content';

export interface NavbarBlock {
  type: string;
  content?: string;
  slug?: string;
  href?: string;
}

export interface NavbarPattern {
  type: string;
  blocks?: NavbarBlock[];
}

export interface JsonNavItem {
  label: string;
  slug: string;
  href: string;
}

export interface NavigationItem {
  href?: string;
  label?: string;
  slug?: string;
  componentType: 'textlink' | 'button';
  textLinkVariant?: 'primary';
  weight?: 'medium';
  underline?: 'hover';
  variant?: 'primary';
  rightIcon?: string;
}

export interface EnhancedNavigationItem {
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
 * Reads href, label, and slug from CMS, keeps component configuration from baseNavigationItems
 */
export function enhanceNavigationWithCMS(
  navigationItems: NavigationItem[],
  initialContent: WebsiteContent | null
): EnhancedNavigationItem[] {
  // Use the new globals structure
  if (!initialContent?.globals?.navbar?.patterns) {
    return [];
  }

  // Find navbar pattern
  const navbarPattern = initialContent.globals.navbar.patterns.find(
    (pattern: NavbarPattern) => pattern.type === 'navbar'
  );
  
  if (!navbarPattern?.blocks) {
    return [];
  }

  // Extract nav items from blocks with href, label, and slug
  const jsonNavItems: JsonNavItem[] = navbarPattern.blocks
    .filter((block: NavbarBlock) => block.type === 'navItem')
    .map((block: NavbarBlock) => ({
      label: block.content || '',
      slug: block.slug || '',
      href: block.href || `/${block.slug || ''}`
    }));

  // Create navigation items by combining CMS data with component configuration
  return jsonNavItems.map((jsonItem, index) => {
    // Use component configuration from baseNavigationItems based on index
    const componentConfig = navigationItems[index] || navigationItems[0] || {};
    
    return {
      href: jsonItem.href,
      label: jsonItem.label,
      slug: jsonItem.slug,
      componentType: componentConfig.componentType || 'textlink',
      textLinkVariant: componentConfig.textLinkVariant,
      weight: componentConfig.weight,
      underline: componentConfig.underline,
      variant: componentConfig.variant,
      rightIcon: componentConfig.rightIcon
    };
  });
}

// Re-export NavigationItem for backward compatibility
export type { NavigationItem as NavigationItemType }; 