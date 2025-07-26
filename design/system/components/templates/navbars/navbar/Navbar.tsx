'use client';

import { usePathname } from 'next/navigation';
import { useToggle } from '../../../../../cms-modules/context/ToggleContext';
import { Section } from '../../../../layout/frames/section';
import { Container } from '../../../../layout/frames/container';
import { Cluster } from '../../../../layout/utilities/cluster';
import { BrandLink, NavMenu, type NavMenuItem } from '../../../patterns/navbar';
import { getNavigationContext, type NavigationItem } from '../../../../utils/navigation';

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
  const pathname = usePathname();
  
  // Use navigation utilities for consistent route handling
  const nav = getNavigationContext(pathname, isToggled);

  // Transform NavItem[] to NavMenuItem[] with proper hrefs and active states
  const menuItems: NavMenuItem[] = navItems.map(item => ({
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