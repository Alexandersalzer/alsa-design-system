'use client';

import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { useToggle } from '../../../../../cms-modules/context/ToggleContext';
import { useContent } from '../../../../../cms-modules/context/ContentContext';
import { Section } from '../../../../layout/frames/section';
import { Container } from '../../../../layout/frames/container';
import { Cluster } from '../../../../layout/utilities/cluster';
import { BrandLink, NavMenu, type NavMenuItem } from '../../../patterns/navbar';
import { getNavigationContext, type NavigationItem } from '../../../../utils/navigation';
import { IconButton } from '../../../primitives/IconButton';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

export interface NavItem extends NavigationItem {
  label: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'danger';
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
  navVariant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'danger';
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
  logoHeight = 40
}: NavbarProps) => {
  const { isToggled } = useToggle();
  const { getNavbarContent } = useContent();
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Use navigation utilities for consistent route handling
  const nav = getNavigationContext(pathname, isToggled);

  // Get navbar content from JSON
  const navbarContent = getNavbarContent();

  // Merge JSON content with existing navItems, prioritizing JSON labels
  const mergedNavItems = navItems.map(item => {
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

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <Section 
      as="nav" 
      className={`shadow-md ${className || ''}`}
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
          
          {/* Desktop Navigation - Hidden on mobile */}
          <div className="hidden md:flex flex-1 justify-end">
            <NavMenu 
              items={menuItems} 
              spacing="xl" 
              wrap={false}
              variant={navVariant}
              size={navSize}
            />
          </div>

          {/* Mobile Hamburger Menu Button - Only visible on mobile */}
          <div className="md:hidden">
            <IconButton
              icon={isMobileMenuOpen ? <XMarkIcon /> : <Bars3Icon />}
              variant="ghost"
              size="md"
              aria-label={isMobileMenuOpen ? "Stäng meny" : "Öppna meny"}
              onClick={toggleMobileMenu}
            />
          </div>
        </Cluster>
      </Container>
    </Section>
  );
};

export default Navbar; 