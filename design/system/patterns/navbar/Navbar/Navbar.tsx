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

export interface NavbarProps {
  // Brand
  brandName?: string;
  brandHref?: string;
  logoSrc?: string;
  logoAlt?: string;
  logoWidth?: number;
  logoHeight?: number;
  
  // Navigation items
  navItems?: NavItem[];
  
  // Navbar style variants
  navbarVariant?: NavbarVariant;
  transparent?: boolean;
  navbarWidth?: NavbarWidth;
  
  // Mobile menu configuration
  mobileBreakpoint?: MobileBreakpoint;
  mobileMenuButtonVariant?: MobileMenuButtonVariant;
  mobileMenuButtonStyle?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'destructive';
  mobileOverlayVariant?: MobileOverlayVariant;
  mobileAnimationDirection?: AnimationDirection;
  mobileOverlayTransparent?: boolean;
  
  // Brand customization
  brandVariant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'brand';
  brandSize?: 'sm' | 'md' | 'lg' | 'xl';
  brandWeight?: 'regular' | 'medium' | 'semibold' | 'bold';
  brandUnderline?: 'none' | 'hover' | 'always';
  
  // Nav items defaults
  navSize?: 'sm' | 'md' | 'lg' | 'xl';
  navVariant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'destructive';
  
  // Other
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

// ===== MAIN NAVBAR COMPONENT =====
export const Navbar = ({ 
  // Brand
  brandName,
  brandHref = '/',
  logoSrc,
  logoAlt = 'Logo',
  logoWidth = 32,
  logoHeight = 32,
  
  // Navigation
  navItems = [],
  
  // Navbar variants
  navbarVariant = 'bar',
  transparent = false,
  navbarWidth = 'content',
  
  // Mobile menu
  mobileBreakpoint = 'md',
  mobileMenuButtonVariant = 'hamburger',
  mobileMenuButtonStyle = 'ghost',
  mobileOverlayVariant = 'full',
  mobileAnimationDirection = 'right',
  mobileOverlayTransparent = false,
  
  // Brand customization
  brandVariant = 'brand',
  brandSize = 'lg',
  brandWeight = 'bold',
  brandUnderline = 'none',
  
  // Nav defaults
  navSize = 'md',
  navVariant = 'primary',
  
  // Other
  className = '',
  sticky = false,
}: NavbarProps) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Build classes
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
          {/* Brand Section */}
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
          
          {/* Desktop Navigation */}
          <Box className="navbar__desktop-menu">
            <NavMenu 
              items={navItems} 
              spacing="xl" 
              size={navSize}
              variant={navVariant}
            />
          </Box>

          {/* Mobile Menu Button */}
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

      {/* Mobile Menu Overlay */}
      <MobileMenuOverlay
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        overlayVariant={mobileOverlayVariant}
        animationDirection={mobileAnimationDirection}
        transparent={mobileOverlayTransparent}
      >
        <VStack spacing="lg" className="navbar__mobile-menu">
          {/* Mobile Header */}
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

          {/* Mobile Navigation Items */}
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

export default Navbar;