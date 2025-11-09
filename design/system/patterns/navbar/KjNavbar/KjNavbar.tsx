'use client';

import React, { useState, useEffect } from 'react';
import { HStack } from '../../../components/layout/hStack/HStack';
import { VStack } from '../../../components/layout/vStack/VStack';
import { Box } from '../../../components/layout/box/Box';
import { Button } from '../../../components';
import { TextLink } from '../../../components';
import { IconButton } from '../../../components';
import { Portal } from '../../../components/layout/portal/Portal';
import { ArrowRightIcon, MenuIcon, XIcon } from 'lucide-react';

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
  isMobile?: boolean;
  onItemClick?: () => void;
}

const NavMenu = ({ 
  items, 
  spacing = 'sm', 
  wrap = false,
  className = '',
  variant = 'primary',
  size = 'md',
  isMobile = false,
  onItemClick
}: NavMenuProps) => {

  const StackComponent = isMobile ? VStack : HStack;
  const stackProps = isMobile 
    ? { spacing, align: 'stretch' as const, className }
    : { spacing, wrap, align: 'center' as const, className };

  return (
    <StackComponent {...stackProps}>
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
              onClick={onItemClick}
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
              onClick={onItemClick}
            >
              {item.label}
            </Button>
          );
        }
      })}
    </StackComponent>
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

// ===== MOBILE MENU BUTTON VARIANTS =====
type MobileMenuButtonVariant = 'hamburger' | 'dots' | 'minimal';

interface MobileMenuButtonProps {
  isOpen: boolean;
  onClick: () => void;
  variant?: MobileMenuButtonVariant;
  buttonVariant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'destructive';
}

const MobileMenuButton = ({ 
  isOpen, 
  onClick, 
  variant = 'hamburger',
  buttonVariant = 'ghost'
}: MobileMenuButtonProps) => {
  return (
    <IconButton
      icon={isOpen ? <XIcon /> : <MenuIcon />}
      variant={buttonVariant}
      size="lg"
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      onClick={onClick}
      className="kj-navbar__mobile-button"
    />
  );
};

// ===== MOBILE MENU OVERLAY COMPONENT =====
type OverlayVariant = 'full' | 'dropdown' | 'sidebar';
type AnimationDirection = 'left' | 'right' | 'top' | 'bottom';

interface MobileMenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  overlayVariant?: OverlayVariant;
  animationDirection?: AnimationDirection;
  transparent?: boolean;
}

const MobileMenuOverlay = ({ 
  isOpen, 
  onClose, 
  children,
  overlayVariant = 'full',
  animationDirection = 'right',
  transparent = false
}: MobileMenuOverlayProps) => {
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsAnimating(true);
      // Prevent body scroll when menu is open
      document.body.style.overflow = 'hidden';
    } else {
      // Re-enable body scroll when menu closes
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen && !isAnimating) return null;

  const overlayClasses = [
    'kj-navbar__overlay',
    `kj-navbar__overlay--${overlayVariant}`,
    `kj-navbar__overlay--${animationDirection}`,
    isOpen ? 'kj-navbar__overlay--open' : 'kj-navbar__overlay--closing',
    transparent && 'kj-navbar__overlay--transparent'
  ].filter(Boolean).join(' ');

  const contentClasses = [
    'kj-navbar__overlay-content',
    `kj-navbar__overlay-content--${overlayVariant}`,
    `kj-navbar__overlay-content--${animationDirection}`
  ].join(' ');

  return (
    <Portal>
      <Box 
        className={overlayClasses}
        onClick={onClose}
        onTransitionEnd={() => {
          if (!isOpen) setIsAnimating(false);
        }}
      >
        <Box 
          className={contentClasses}
          onClick={(e) => e.stopPropagation()}
        >
          {children}
        </Box>
      </Box>
    </Portal>
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

  // ===== NEW RESPONSIVE & VARIANT PROPS =====
  // Navbar style variants
  navbarVariant?: 'pill' | 'bar';
  transparent?: boolean;
  navbarWidth?: 'full' | 'content' | 'narrow' | 'wide';
  
  // Mobile menu variants
  mobileMenuButtonVariant?: MobileMenuButtonVariant;
  mobileMenuButtonStyle?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'destructive';
  mobileOverlayVariant?: OverlayVariant;
  mobileAnimationDirection?: AnimationDirection;
  mobileOverlayTransparent?: boolean;
  
  // Responsive behavior
  mobileBreakpoint?: 'sm' | 'md' | 'lg'; // When to show mobile menu
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
  
  // New variant props with defaults
  navbarVariant = 'bar',
  transparent = false,
  navbarWidth = 'content',
  mobileMenuButtonVariant = 'hamburger',
  mobileMenuButtonStyle = 'ghost',
  mobileOverlayVariant = 'full',
  mobileAnimationDirection = 'right',
  mobileOverlayTransparent = false,
  mobileBreakpoint = 'md',
}: KjNavbarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Hardcoded S3 base URL
  const S3_BASE_URL_MEMBERS = 'https://cdn.blimpify-im.com/members';

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
  const finalLogoSrc = finalLogoEndpoint ? `${S3_BASE_URL_MEMBERS}/${finalLogoEndpoint}` : undefined;
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

  // Build navbar classes
  const navbarClasses = [
    'kj-navbar',
    `kj-navbar--${navbarVariant}`,
    `kj-navbar--width-${navbarWidth}`,
    transparent && 'kj-navbar--transparent',
    className
  ].filter(Boolean).join(' ');

  const breakpointClass = `kj-navbar--mobile-${mobileBreakpoint}`;

  return (
    <Box className={`${navbarClasses} ${breakpointClass}`}>
      {/* Content constrained wrapper */}
      <Box className="kj-navbar__container">
        <HStack 
          justify="between" 
          align="center" 
          spacing="md" 
          wrap={false}
          className="kj-navbar__content"
        >
          {/* Brand Section */}
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
          
          {/* Desktop Navigation */}
          <Box className="kj-navbar__desktop-menu">
            <NavMenu 
              items={menuItems} 
              spacing="xl" 
              wrap={false}
              size={navSize}
            />
          </Box>

          {/* Mobile Menu Button */}
          <Box className="kj-navbar__mobile-toggle">
            <MobileMenuButton
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              variant={mobileMenuButtonVariant}
              buttonVariant={mobileMenuButtonStyle}
            />
          </Box>
        </HStack>
      </Box>

      {/* Mobile Menu Overlay */}
      <MobileMenuOverlay
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        overlayVariant={mobileOverlayVariant}
        animationDirection={mobileAnimationDirection}
        transparent={mobileOverlayTransparent}
      >
        <VStack spacing="lg" className="kj-navbar__mobile-menu">
          {/* Brand in mobile menu (optional) */}
          <Box className="kj-navbar__mobile-header">
            <HStack justify="between" align="center">
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
              <MobileMenuButton
                isOpen={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen(false)}
                variant={mobileMenuButtonVariant}
                buttonVariant={mobileMenuButtonStyle}
              />
            </HStack>
          </Box>

          {/* Mobile Navigation Items */}
          <NavMenu 
            items={menuItems} 
            spacing="md" 
            size={navSize}
            isMobile={true}
            onItemClick={() => setIsMobileMenuOpen(false)}
          />
        </VStack>
      </MobileMenuOverlay>
    </Box>
  );
};

export default KjNavbar;