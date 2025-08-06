'use client';

import { useEditingMode } from '../../../../../cms/wrappers/editing/EditingWrapper';
import { useContent } from '../../../../../cms/wrappers/content/ContentProvider';
import { usePathname } from 'next/navigation';
import { Section } from '../../../../layout/frames/section';
import { Container } from '../../../../layout/frames/container';
import { Cluster } from '../../../../layout/utilities/cluster';
import { BrandLink, NavMenu, type NavMenuItem } from '../../../patterns/client/navbar';
import { getNavigationContext, type NavigationItem } from '../../../../utils/navigation';
import { ArrowRightIcon } from 'lucide-react';
import type { WebsiteContent } from '../../../../../cms/utils/content';

// Navbar-specific interfaces (moved from navigationHelper)
interface NavbarBlock {
  type: string;
  content?: string;
  slug?: string;
  config?: {
    href?: string;
    [key: string]: any;
  };
}

interface NavbarPattern {
  type: string;
  blocks?: NavbarBlock[];
}

interface JsonNavItem {
  label: string;
  slug: string;
  href: string;
}

interface CMSNavigationItem {
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

interface EnhancedNavigationItem {
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
function enhanceNavigationWithCMS(
  navigationItems: CMSNavigationItem[],
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
      href: block.config?.href || `/${block.slug || ''}`
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

export interface NavItem extends NavigationItem {
  label: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  rightIcon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  componentType?: 'button' | 'textlink';
  textLinkVariant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'brand';
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
  underline?: 'none' | 'hover' | 'always';
}

export interface NavbarProps {
  brandName?: string;
  brandHref?: string;
  navItems?: NavItem[];
  className?: string;
  navVariant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'destructive';
  navSize?: 'sm' | 'md' | 'lg' | 'xl';
  brandVariant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'brand';
  brandSize?: 'sm' | 'md' | 'lg' | 'xl';
  brandWeight?: 'regular' | 'medium' | 'semibold' | 'bold';
  brandUnderline?: 'none' | 'hover' | 'always';
  logoSrc?: string;
  logoAlt?: string;
  logoWidth?: number;
  logoHeight?: number;
}

const Navbar = ({ 
  brandName = 'MARKETING SWEDEN',
  brandHref = '/home',
  navItems = [],
  className,
  navVariant = 'ghost',
  navSize = 'md',
  brandVariant = 'brand',
  brandSize = 'lg',
  brandWeight = 'bold',
  brandUnderline = 'none',
  logoSrc = '/images/sections/kjlogo.jpg',
  logoAlt = 'KJ Marketing Logo',
  logoWidth = 32,
  logoHeight = 32
}: NavbarProps) => {
  const { isEditingMode } = useEditingMode();
  const { getNavbarContent, content } = useContent();
  const pathname = usePathname();

  // Default navigation configuration
  const navigationConfig = {
    textlink: {
      componentType: 'textlink' as const,
      textLinkVariant: 'primary' as const,
      weight: 'medium' as const,
      underline: 'hover' as const
    },
    button: {
      componentType: 'button' as const,
      variant: 'primary' as const,
      rightIcon: 'ArrowRightIcon'
    }
  };

  // Create base navigation items from configuration for CMS
  const baseNavigationItems: CMSNavigationItem[] = [
    {
      componentType: 'textlink' as const,
      textLinkVariant: navigationConfig?.textlink?.textLinkVariant || 'primary',
      weight: navigationConfig?.textlink?.weight || 'medium',
      underline: navigationConfig?.textlink?.underline || 'hover'
    },
    {
      componentType: 'button' as const,
      variant: navigationConfig?.button?.variant || 'primary',
      rightIcon: navigationConfig?.button?.rightIcon || 'ArrowRightIcon'
    }
  ];

  // Enhance navigation with CMS content - pass the actual content instead of null
  const enhancedNavigationItems = enhanceNavigationWithCMS(baseNavigationItems, content);

  // Convert string icon references back to JSX
  const processedNavItems = enhancedNavigationItems.map(item => ({
    ...item,
    rightIcon: item.rightIcon === 'ArrowRightIcon' ? <ArrowRightIcon /> : undefined,
    size: navSize,
    leftIcon: undefined
  }));

  // Merge with any passed navItems
  const finalNavItems = navItems.length > 0 ? navItems : processedNavItems;
  
  // Use navigation utilities for consistent route handling
  const nav = getNavigationContext(pathname, isEditingMode);

  // Get navbar content from JSON
  const navbarContent = getNavbarContent();

  // Merge JSON content with existing navItems, prioritizing JSON labels
  const mergedNavItems = finalNavItems.map(item => {
    // Find matching content from JSON based on slug
    const jsonItem = navbarContent?.navItems.find(jsonNav => jsonNav.slug === item.slug);
    
    return {
      ...item,
      label: jsonItem?.label || item.label // Use JSON label if available, fallback to prop label
    };
  });

  // Transform NavItem[] to NavMenuItem[] with proper hrefs and active states
  const menuItems: NavMenuItem[] = mergedNavItems.map(item => ({
    ...item,
    href: nav.buildNavHref(item),
    isActive: nav.isNavItemActive(item, pathname),
    variant: item.variant || navVariant,
    size: item.size || navSize,
    rightIcon: item.rightIcon,
    leftIcon: item.leftIcon,
    componentType: item.componentType,
    textLinkVariant: item.textLinkVariant,
    weight: item.weight,
    underline: item.underline
  }));

  return (
    <Section 
      as="nav"
      style={{ backgroundColor: 'var(--primary-white)' }}
      sticky={true}
      top={0}
      zIndex={1000}
    >
      <Container maxWidth="lg">
        <Cluster justify="between" align="center" className="h-16">
          <BrandLink 
            href={nav.buildBrandHref(brandHref)}
            variant={brandVariant}
            size={brandSize}
            weight={brandWeight}
            underline={brandUnderline}
            logoSrc={logoSrc}
            logoAlt={logoAlt}
            logoWidth={logoWidth}
            logoHeight={logoHeight}
          >
            {brandName}
          </BrandLink>
          
          {/* Spacer */}
          <div className="flex-1" />
          
          <NavMenu 
            items={menuItems} 
            spacing="xl" 
            wrap={false}
            variant={navVariant}
            size={navSize}
          />
        </Cluster>
      </Container>
    </Section>
  );
};

export default Navbar; 