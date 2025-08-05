'use client';

import { useEditingMode } from '../../../../../cms/modules/initial/child/EditingWrapper';
import { useContent } from '../../../../../cms/context/ContentProvider';
import { usePathname } from 'next/navigation';
import { Section } from '../../../../layout/frames/section';
import { Container } from '../../../../layout/frames/container';
import { Cluster } from '../../../../layout/utilities/cluster';
import { BrandLink, NavMenu, type NavMenuItem } from '../../../patterns/client/navbar';
import { getNavigationContext, type NavigationItem as UtilsNavigationItem } from '../../../../utils/navigation';
import type { NavigationItem } from '../../../../../cms/content/navigationHelper';
import { enhanceNavigationWithCMS } from '../../../../../cms/content/navigationHelper';
import { ArrowRightIcon } from '../../../../..';

export interface NavItem extends UtilsNavigationItem {
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
  // Navigation item configuration
  navigationConfig?: {
    textlink?: {
      componentType: 'textlink';
      textLinkVariant?: 'primary';
      weight?: 'medium';
      underline?: 'hover';
    };
    button?: {
      componentType: 'button';
      variant?: 'primary';
      rightIcon?: string;
    };
  };
}

const Navbar = ({ 
  brandName = 'Blimpifyco',
  brandHref = '/',
  navItems = [],
  className,
  navVariant = 'ghost',
  navSize = 'md',
  brandVariant = 'brand',
  brandSize = 'lg',
  brandWeight = 'bold',
  brandUnderline = 'none',
  logoSrc,
  logoAlt = 'Logo',
  logoWidth = 40,
  logoHeight = 40,
  navigationConfig = {
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
  }
}: NavbarProps) => {
  const { isEditingMode } = useEditingMode();
  const { getNavbarContent, content } = useContent();
  const pathname = usePathname();

  
  // Use navigation utilities for consistent route handling
  const nav = getNavigationContext(pathname, isEditingMode);

  // Get navbar content from JSON
  const navbarContent = getNavbarContent();

  // Create base navigation items from configuration if navItems is empty
  let finalNavItems = navItems;
  if (navItems.length === 0) {
    const baseNavigationItems: NavigationItem[] = [
      {
        componentType: 'textlink' as const,
        textLinkVariant: navigationConfig?.textlink?.textLinkVariant || 'primary',
        weight: navigationConfig?.textlink?.weight || 'medium',
        underline: navigationConfig?.textlink?.underline || 'hover',
        href: '/'
      },
      {
        componentType: 'button' as const,
        variant: navigationConfig?.button?.variant || 'primary',
        rightIcon: navigationConfig?.button?.rightIcon || 'ArrowRightIcon',
        href: '/'
      }
    ];

    // Enhance navigation with CMS content
    const enhancedNavigationItems = enhanceNavigationWithCMS(baseNavigationItems, content);

    // Convert string icon references back to JSX and transform to NavItem[]
    finalNavItems = enhancedNavigationItems.map(item => ({
      ...item,
      rightIcon: item.rightIcon === 'ArrowRightIcon' ? <ArrowRightIcon /> : undefined,
      label: item.label || '' // Ensure label exists
    }));
  }

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