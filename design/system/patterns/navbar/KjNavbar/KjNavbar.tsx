'use client';

import React from 'react';
import { HStack } from '../../../components/layout/hStack/HStack';
import { Box } from '../../../components/layout/box/Box';
import { Button } from '../../../components';
import { TextLink } from '../../../components';
import { ArrowRightIcon } from 'lucide-react';

// ===== NAV MENU INTERFACES & COMPONENTS =====
export interface NavMenuItem {
  href: string;
  label: string;
  slug?: string;
  isActive?: boolean;
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  rightIcon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  componentType?: 'button' | 'textlink';
  textLinkVariant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'brand';
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
  underline?: 'none' | 'hover' | 'always';
}

interface NavMenuProps {
  items: NavMenuItem[];
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  wrap?: boolean;
  className?: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const NavMenu = ({ 
  items, 
  spacing = 'sm', 
  wrap = false,
  className = '',
  variant = 'primary',
  size = 'md'
}: NavMenuProps) => {

  return (
    <HStack spacing={spacing} wrap={wrap} className={className} align='center'>
      {items.map((item, index) => {
        // Use individual item variant/size or fallback to global defaults
        const itemVariant = item.variant || variant;
        const itemSize = item.size || size;
        
        // Check if this should be a TextLink or Button
        if (item.componentType === 'textlink') {
          // Render as TextLink
          const textLinkVariant = item.textLinkVariant || 'primary';
          const activeVariant = item.isActive ? 'accent' : textLinkVariant;
          
          return (
            <TextLink
              key={item.href || index}
              href={item.href}
              variant={activeVariant}
              size={itemSize}
              weight={item.weight || 'medium'}
              underline={item.underline || 'hover'}
              leftIcon={item.leftIcon}
              rightIcon={item.rightIcon}
            >
              {item.label}
            </TextLink>
          );
        } else {
          // Render as Button
          const buttonVariant = item.isActive ? 'secondary' : itemVariant;
          
          return (
            <Button
              key={item.href || index}
              variant={buttonVariant}
              size={itemSize}
              rightIcon={item.rightIcon}
              leftIcon={item.leftIcon}
            >
              {item.label}
            </Button>
          );
        }
      })}
    </HStack>
  );
};

// ===== BRAND LINK COMPONENT =====
interface BrandLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'brand';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
  logoSrc?: string;
  logoAlt?: string;
  logoWidth?: number;
  logoHeight?: number;
  underline?: 'none' | 'hover' | 'always';
}

const BrandLink = ({ 
  href, 
  children, 
  className = '',
  variant = 'brand',
  size = 'lg',
  weight = 'bold',
  logoSrc,
  logoAlt = 'Logo',
  logoWidth = 40,
  logoHeight = 40,
  underline = 'none'
}: BrandLinkProps) => {
  return (
    <TextLink
      href={href}
      variant={variant}
      size={size}
      weight={weight}
      underline={underline}
      className={className}
    >
      <HStack align="center">
        {logoSrc && (
          <img 
            src={logoSrc} 
            alt={logoAlt}
            width={logoWidth}
            height={logoHeight}
            className="object-contain flex-shrink-0"
            style={{ display: 'component' }}
          />
        )}
        <span className="brand-text" style={{ display: 'flex', alignItems: 'center' }}>{children}</span>
      </HStack>
    </TextLink>
  );
};

export interface NavItem {
  href: string;
  label: string;
  slug?: string;
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  rightIcon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  componentType?: 'button' | 'textlink';
  textLinkVariant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'brand';
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
  underline?: 'none' | 'hover' | 'always';
}

export interface KjNavbarProps {
  // New CMS structure
  type?: string;
  props?: Record<string, any>;
  components?: Record<string, {
    type: string;
    props: Record<string, any>;
  }>;
  
  // Legacy props for backwards compatibility
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
  logoEndpoint?: string;
  logoAlt?: string;
  logoWidth?: number;
  logoHeight?: number;
}

export const KjNavbar = ({ 
  type,
  props: cmsProps = {},
  components = {},
  // Legacy props
  brandName,
  brandHref = '/',
  navItems = [],
  className,
  navSize = 'md',
  brandVariant = 'brand',
  brandSize = 'lg',
  brandWeight = 'bold',
  brandUnderline = 'none',
  logoEndpoint,
  logoAlt,
  logoWidth = 32,
  logoHeight = 32,
}: KjNavbarProps) => {

  // Hardcoded S3 base URL
  const CDN_BASE_URL = 'https://cdn.blimpify-im.com/members';

  // Extract data from new CMS structure
  const logoComponent = Object.values(components).find(comp => comp.type === 'logo');
  const titleComponent = Object.values(components).find(comp => comp.type === 'title');
  
  // Extract logo endpoint from new props structure
  let logoEndpointFromComponent = '';
  if (logoComponent?.props?.src) {
    const logoSrc = logoComponent.props.src;
    if (logoSrc.startsWith('https://cdn.blimpify-im.com/members/')) {
      logoEndpointFromComponent = logoSrc.replace('https://cdn.blimpify-im.com/members/', '');
    } else if (logoSrc.startsWith('/')) {
      logoEndpointFromComponent = logoSrc.substring(1);
    } else {
      logoEndpointFromComponent = logoSrc;
    }
  }

  // Use new structure with fallbacks to legacy props
  const finalBrandName = brandName || titleComponent?.props?.content;
  const finalBrandHref = brandHref;
  const finalLogoEndpoint = logoEndpoint || logoEndpointFromComponent;
  const finalLogoSrc = finalLogoEndpoint ? `${CDN_BASE_URL}/${finalLogoEndpoint}` : undefined;
  const finalLogoAlt = logoAlt || logoComponent?.props?.alt;



  // Convert CMS components to nav items (new structure)
  const cmsNavItems: NavItem[] = Object.values(components)
    .filter((component: any) => component.type === 'navItem')
    .map((component: any, index: number) => {
    const navItemsArray = Object.values(components).filter((c: any) => c.type === 'navItem');
    return {
      href: component.props?.href || '/',
      label: component.props?.content || '',
      slug: '',
      variant: component.props?.variant,
      componentType: index === navItemsArray.length - 1 ? 'button' : 'textlink',
      textLinkVariant: 'primary',
      weight: 'medium',
      underline: 'hover',
      rightIcon: index === navItemsArray.length - 1 ? <ArrowRightIcon /> : undefined,
      size: navSize
    };
  });

  // Use CMS items if available, otherwise fallback to passed navItems
  const finalNavItems = cmsNavItems.length > 0 ? cmsNavItems : navItems;

  // Transform NavItem[] to NavMenuItem[] 
  const menuItems: NavMenuItem[] = finalNavItems.map(item => ({
    ...item,
    isActive: false, // Simplified - no active state logic
    variant: item.variant,
    size: item.size || navSize,
    rightIcon: item.rightIcon,
    leftIcon: item.leftIcon,
    componentType: item.componentType,
    textLinkVariant: item.textLinkVariant,
    weight: item.weight,
    underline: item.underline
  }));

  return (
    <Box
      className={className}
      style={{
        width: '100%'
      }}
    >
      {/* Content constrained wrapper */}
      <Box
        style={{
          maxWidth: 'var(--width-content)',
          margin: '0 auto',
          paddingTop: 'var(--selected-navbar-spacing)',      // ✅ FIXED
          paddingBottom: 'var(--selected-navbar-spacing)',   // ✅ FIXED
          width: '100%',
        }}
      >
        <HStack 
          justify="between" 
          align="center" 
          spacing="md" 
          wrap={false}
        >
          <BrandLink 
            href={finalBrandHref}
            variant={brandVariant}
            size={brandSize}
            weight={brandWeight}
            underline={brandUnderline}
            logoSrc={finalLogoSrc}
            logoAlt={finalLogoAlt}
            logoWidth={logoWidth}
            logoHeight={logoHeight}
          >
            {finalBrandName}
          </BrandLink>
          
          <NavMenu 
            items={menuItems} 
            spacing="xl" 
            wrap={false}
            size={navSize}
          />
        </HStack>
      </Box>
    </Box>
  );
};

export default KjNavbar;