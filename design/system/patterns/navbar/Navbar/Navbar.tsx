'use client';

import React, { useState, useEffect } from 'react';
import { 
    Portal,
    IconButton,
    TextLink,
    Button,
    Box,
    VStack,
    HStack 
} from  '../../../components';
import { MenuIcon, XIcon } from 'lucide-react';

// ===== TYPES =====
export type NavbarVariant = 'pill' | 'bar';
export type NavbarWidth = 'full' | 'content' | 'narrow' | 'wide';
export type MobileBreakpoint = 'sm' | 'md' | 'lg';
export type MobileMenuButtonVariant = 'hamburger' | 'dots' | 'minimal';
export type MobileOverlayVariant = 'full' | 'dropdown' | 'sidebar';
export type AnimationDirection = 'left' | 'right' | 'top' | 'bottom';

export interface NavItem {
  href: string;
  label: string;
  componentType?: 'button' | 'textlink';
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  textLinkVariant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'brand';
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
  underline?: 'none' | 'hover' | 'always';
  rightIcon?: React.ReactNode;
  leftIcon?: React.ReactNode;
  isActive?: boolean;
}

// ===== PATTERN PROPS (what the registry passes) =====
interface NavbarPatternProps {
  type: string;
  props: Record<string, any>;
  components: Record<string, any>;
}

// ===== COMPONENT PROPS (internal) =====
export interface NavbarProps {
  brandName?: string;
  brandHref?: string;
  logoSrc?: string;
  logoAlt?: string;
  logoWidth?: number;
  logoHeight?: number;
  navItems?: NavItem[];
  navbarVariant?: NavbarVariant;
  transparent?: boolean;
  navbarWidth?: NavbarWidth;
  mobileBreakpoint?: MobileBreakpoint;
  mobileMenuButtonVariant?: MobileMenuButtonVariant;
  mobileMenuButtonStyle?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'destructive';
  mobileOverlayVariant?: MobileOverlayVariant;
  mobileAnimationDirection?: AnimationDirection;
  mobileOverlayTransparent?: boolean;
  brandVariant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'brand';
  brandSize?: 'sm' | 'md' | 'lg' | 'xl';
  brandWeight?: 'regular' | 'medium' | 'semibold' | 'bold';
  brandUnderline?: 'none' | 'hover' | 'always';
  navSize?: 'sm' | 'md' | 'lg' | 'xl';
  navVariant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'destructive';
  className?: string;
  sticky?: boolean;
}

// ===== BRAND LINK COMPONENT =====
interface BrandLinkProps {
  href: string;
  children: React.ReactNode;
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
    >
      <HStack align="center" spacing="sm">
        {logoSrc && (
          <img 
            src={logoSrc} 
            alt={logoAlt}
            width={logoWidth}
            height={logoHeight}
            style={{ display: 'block', flexShrink: 0 }}
          />
        )}
        {children && <span>{children}</span>}
      </HStack>
    </TextLink>
  );
};

// ===== NAV MENU COMPONENT =====
interface NavMenuProps {
  items: NavItem[];
  spacing?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'destructive';
  isMobile?: boolean;
  onItemClick?: () => void;
}

const NavMenu = ({ 
  items, 
  spacing = 'xl', 
  size = 'md',
  variant = 'primary',
  isMobile = false,
  onItemClick
}: NavMenuProps) => {
  const StackComponent = isMobile ? VStack : HStack;
  const stackProps = isMobile 
    ? { spacing, align: 'stretch' as const }
    : { spacing, wrap: false, align: 'center' as const };

  return (
    <StackComponent {...stackProps}>
      {items.map((item, index) => {
        const itemVariant = item.variant || variant;
        const itemSize = item.size || size;
        
        if (item.componentType === 'textlink') {
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

// ===== MOBILE MENU BUTTON =====
interface MobileMenuButtonProps {
  isOpen: boolean;
  onClick: () => void;
  variant?: MobileMenuButtonVariant;
  buttonVariant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'destructive';
}

const MobileMenuButton = ({ 
  isOpen, 
  onClick, 
  buttonVariant = 'ghost'
}: MobileMenuButtonProps) => {
  return (
    <IconButton
      icon={isOpen ? <XIcon /> : <MenuIcon />}
      variant={buttonVariant}
      size="lg"
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      onClick={onClick}
    />
  );
};

// ===== MOBILE MENU OVERLAY =====
interface MobileMenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  overlayVariant?: MobileOverlayVariant;
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
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  if (!isOpen && !isAnimating) return null;

  const overlayClasses = [
    'navbar__overlay',
    `navbar__overlay--${overlayVariant}`,
    `navbar__overlay--${animationDirection}`,
    isOpen ? 'navbar__overlay--open' : 'navbar__overlay--closing',
    transparent && 'navbar__overlay--transparent'
  ].filter(Boolean).join(' ');

  const contentClasses = [
    'navbar__overlay-content',
    `navbar__overlay-content--${overlayVariant}`,
    `navbar__overlay-content--${animationDirection}`
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

// ===== TRANSFORM FUNCTION =====
// Converts pattern props (from JSON) to component props
function transformPatternToProps(patternProps: NavbarPatternProps): NavbarProps {
  const { props, components } = patternProps;

  // Extract logo
  const logo = Object.values(components || {}).find(
    (c: any) => c.type === 'logo'
  ) as any;

  // Extract brand/title
  const brand = Object.values(components || {}).find(
    (c: any) => c.type === 'title'
  ) as any;

  // Extract and transform nav items
  const navItems: NavItem[] = Object.values(components || {})
    .filter((c: any) => c.type === 'navItem')
    .map((item: any) => ({
      href: item.props?.href || '/',
      label: item.props?.content || '',
      componentType: item.props?.componentType || 'textlink',
      variant: item.props?.variant,
      size: item.props?.size,
      textLinkVariant: item.props?.textLinkVariant,
      weight: item.props?.weight,
      underline: item.props?.underline,
      rightIcon: item.props?.rightIcon,
      leftIcon: item.props?.leftIcon,
      isActive: item.props?.isActive,
    }));

  return {
    // Navbar style
    navbarVariant: props?.navbarVariant || 'bar',
    transparent: props?.transparent || false,
    navbarWidth: props?.navbarWidth || 'content',
    sticky: props?.sticky || false,

    // Mobile menu
    mobileBreakpoint: props?.mobileBreakpoint || 'md',
    mobileOverlayVariant: props?.mobileOverlayVariant || 'full',
    mobileAnimationDirection: props?.mobileAnimationDirection || 'right',
    mobileMenuButtonStyle: props?.mobileMenuButtonStyle || 'ghost',
    mobileOverlayTransparent: props?.mobileOverlayTransparent || false,

    // Brand
    brandName: brand?.props?.content || props?.brandName,
    brandHref: props?.brandHref || '/',
    brandVariant: props?.brandVariant || 'brand',
    brandSize: props?.brandSize || 'lg',
    brandWeight: props?.brandWeight || 'bold',
    brandUnderline: props?.brandUnderline || 'none',

    // Logo
    logoSrc: logo?.props?.src,
    logoAlt: logo?.props?.alt || 'Logo',
    logoWidth: logo?.props?.width || 40,
    logoHeight: logo?.props?.height || 40,

    // Nav items
    navItems,
    navSize: props?.navSize || 'md',
    navVariant: props?.navVariant || 'primary',

    // Other
    className: props?.className,
  };
}

// ===== INTERNAL NAVBAR COMPONENT =====
const NavbarComponent = ({ 
  brandName,
  brandHref = '/',
  logoSrc,
  logoAlt = 'Logo',
  logoWidth = 32,
  logoHeight = 32,
  navItems = [],
  navbarVariant = 'bar',
  transparent = false,
  navbarWidth = 'content',
  mobileBreakpoint = 'md',
  mobileMenuButtonVariant = 'hamburger',
  mobileMenuButtonStyle = 'ghost',
  mobileOverlayVariant = 'full',
  mobileAnimationDirection = 'right',
  mobileOverlayTransparent = false,
  brandVariant = 'brand',
  brandSize = 'lg',
  brandWeight = 'bold',
  brandUnderline = 'none',
  navSize = 'md',
  navVariant = 'primary',
  className = '',
  sticky = false,
}: NavbarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navbarClasses = [
    'navbar',
    `navbar--${navbarVariant}`,
    `navbar--width-${navbarWidth}`,
    `navbar--mobile-${mobileBreakpoint}`,
    transparent && 'navbar--transparent',
    sticky && 'navbar--sticky',
    className
  ].filter(Boolean).join(' ');

  return (
    <Box className={navbarClasses}>
      <Box className="navbar__container">
        <HStack 
          justify="between" 
          align="center" 
          spacing="md" 
          wrap={false}
          className="navbar__content"
        >
          <BrandLink 
            href={brandHref}
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
          
          <Box className="navbar__desktop-menu">
            <NavMenu 
              items={navItems} 
              spacing="xl" 
              size={navSize}
              variant={navVariant}
            />
          </Box>

          <Box className="navbar__mobile-toggle">
            <MobileMenuButton
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              variant={mobileMenuButtonVariant}
              buttonVariant={mobileMenuButtonStyle}
            />
          </Box>
        </HStack>
      </Box>

      <MobileMenuOverlay
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        overlayVariant={mobileOverlayVariant}
        animationDirection={mobileAnimationDirection}
        transparent={mobileOverlayTransparent}
      >
        <VStack spacing="lg" className="navbar__mobile-menu">
          <Box className="navbar__mobile-header">
            <HStack justify="between" align="center">
              <BrandLink 
                href={brandHref}
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
              <MobileMenuButton
                isOpen={isMobileMenuOpen}
                onClick={() => setIsMobileMenuOpen(false)}
                variant={mobileMenuButtonVariant}
                buttonVariant={mobileMenuButtonStyle}
              />
            </HStack>
          </Box>

          <NavMenu 
            items={navItems} 
            spacing="md" 
            size={navSize}
            variant={navVariant}
            isMobile={true}
            onItemClick={() => setIsMobileMenuOpen(false)}
          />
        </VStack>
      </MobileMenuOverlay>
    </Box>
  );
};

// ===== EXPORTED PATTERN WRAPPER =====
// This is what gets registered in the pattern registry
export const Navbar = (patternProps: NavbarPatternProps) => {
  const componentProps = transformPatternToProps(patternProps);
  return <NavbarComponent {...componentProps} />;
};

export default Navbar;