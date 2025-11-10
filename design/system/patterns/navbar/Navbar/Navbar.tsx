'use client';

import React, { useState } from 'react';
import {
  Drawer,
  Modal,
  IconButton,
  TextLink,
  Button,
  Box,
  VStack,
  HStack,
  Logo,
  Container,
} from '../../../components';
import { MenuIcon, XIcon } from 'lucide-react';

// ===== TYPES =====
export type NavbarVariant = 'pill' | 'bar';
export type NavbarWidth = 'full' | 'content' | 'narrow' | 'wide';
export type MobileBreakpoint = 'sm' | 'md' | 'lg';
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
  isActive?: boolean;
}

// ===== PATTERN PROPS =====
interface NavbarPatternProps {
  type: string;
  props: Record<string, any>;
  components: Record<string, any>;
}

// ===== COMPONENT PROPS =====
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
  mobileMenuButtonStyle?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'destructive';
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

// ===== BRAND LINK =====
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
  underline = 'none',
}: BrandLinkProps) => (
  <TextLink
    href={href}
    variant={variant}
    size={size}
    weight={weight}
    underline={underline}
    className="navbar__brand-link"
  >
    <HStack align="center" spacing="sm">
      {logoSrc && (
        <Logo
          src={logoSrc}
          alt={logoAlt}
          size="md"
          variant="contain"
          className="navbar__brand-logo"
          fallbackText={children?.toString().charAt(0) || 'B'}
        />
      )}
      {children && <span className="navbar__brand-name">{children}</span>}
    </HStack>
  </TextLink>
);

// ===== NAV MENU =====
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
  onItemClick,
}: NavMenuProps) => {
  const Stack = isMobile ? VStack : HStack;
  const stackProps = isMobile
    ? { spacing, align: 'stretch' as const }
    : { spacing, wrap: false, align: 'center' as const };

  return (
    <Stack {...stackProps}>
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
              onClick={onItemClick}
            >
              {item.label}
            </TextLink>
          );
        }

        const buttonVariant = item.isActive ? 'secondary' : itemVariant;

        return (
          <Button
            key={item.href || index}
            href={item.href}
            variant={buttonVariant}
            size={itemSize}
            onClick={onItemClick}
          >
            {item.label}
          </Button>
        );
      })}
    </Stack>
  );
};

// ===== MOBILE MENU BUTTON =====
interface MobileMenuButtonProps {
  isOpen: boolean;
  onClick: () => void;
  buttonVariant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'destructive';
}

const MobileMenuButton = ({
  isOpen,
  onClick,
  buttonVariant = 'ghost',
}: MobileMenuButtonProps) => (
  <IconButton
    icon={isOpen ? <XIcon /> : <MenuIcon />}
    variant={buttonVariant}
    size="lg"
    aria-label={isOpen ? 'Close menu' : 'Open menu'}
    onClick={onClick}
  />
);

// ===== MOBILE MENU OVERLAY =====
interface MobileMenuOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  navbarVariant: NavbarVariant;
  animationDirection?: AnimationDirection;
  transparent?: boolean;
}

const MobileMenuOverlay = ({
  isOpen,
  onClose,
  children,
  navbarVariant,
  animationDirection = 'right',
  transparent = false,
}: MobileMenuOverlayProps) => {
  // Bar variant uses Drawer (side panel)
  if (navbarVariant === 'bar') {
    const placement = animationDirection === 'left' ? 'start' : 
                     animationDirection === 'top' ? 'top' : 
                     animationDirection === 'bottom' ? 'bottom' : 'end';

    return (
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        placement={placement}
        size="md"
        showCloseButton={false}
        className={transparent ? 'drawer--transparent' : ''}
      >
        {children}
      </Drawer>
    );
  }

  // Pill variant uses Modal (full screen)
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="full"
      showCloseButton={false}
      className={transparent ? 'modal--transparent' : ''}
    >
      {children}
    </Modal>
  );
};

// ===== TRANSFORM FUNCTION =====
function transformPatternToProps(patternProps: NavbarPatternProps): NavbarProps {
  const { props, components } = patternProps;

  // Extract components
  const logo = Object.values(components || {}).find((c: any) => c.type === 'logo') as any;
  const brand = Object.values(components || {}).find((c: any) => c.type === 'title') as any;

  // Transform navItems from components
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
      isActive: item.props?.isActive,
    }));

  return {
    // Navbar config
    navbarVariant: props?.navbarVariant || 'bar',
    transparent: props?.transparent || false,
    navbarWidth: props?.navbarWidth || 'content',
    sticky: props?.sticky || false,

    // Mobile config
    mobileBreakpoint: props?.mobileBreakpoint || 'md',
    mobileAnimationDirection: props?.mobileAnimationDirection || 'right',
    mobileMenuButtonStyle: props?.mobileMenuButtonStyle || 'ghost',
    mobileOverlayTransparent: props?.mobileOverlayTransparent || false,

    // Brand config
    brandName: brand?.props?.content || props?.brandName,
    brandHref: props?.brandHref || '/',
    brandVariant: props?.brandVariant || 'brand',
    brandSize: props?.brandSize || 'lg',
    brandWeight: props?.brandWeight || 'bold',
    brandUnderline: props?.brandUnderline || 'none',

    // Logo config
    logoSrc: logo?.props?.src,
    logoAlt: logo?.props?.alt || 'Logo',
    logoWidth: logo?.props?.width || 40,
    logoHeight: logo?.props?.height || 40,

    // Navigation config
    navItems,
    navSize: props?.navSize || 'md',
    navVariant: props?.navVariant || 'primary',
    className: props?.className,
  };
}

// ===== NAVBAR COMPONENT =====
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
  mobileMenuButtonStyle = 'ghost',
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
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Box className={navbarClasses}>
      <Box className="navbar__container">
        <HStack justify="between" align="center" spacing="md" wrap={false} className="navbar__content">
          {/* Brand */}
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

          {/* Desktop Menu */}
          <Box className="navbar__desktop-menu">
            <NavMenu 
              items={navItems} 
              spacing="xl" 
              size={navSize} 
              variant={navVariant} 
            />
          </Box>

          {/* Mobile Toggle */}
          <Box className="navbar__mobile-toggle">
            <MobileMenuButton
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              buttonVariant={mobileMenuButtonStyle}
            />
          </Box>
        </HStack>
      </Box>

      {/* Mobile Menu Overlay */}
      <MobileMenuOverlay
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        navbarVariant={navbarVariant}
        animationDirection={mobileAnimationDirection}
        transparent={mobileOverlayTransparent}
      >
        <VStack spacing="lg" className="navbar__mobile-menu">
          {/* Mobile Header */}
          <HStack justify="between" align="center" className="navbar__container">
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
              isOpen={true}
              onClick={() => setIsMobileMenuOpen(false)}
              buttonVariant={mobileMenuButtonStyle}
            />
          </HStack>

          {/* Mobile Menu Content */}
          <Container className="navbar__mobile-menu-content">
            <VStack spacing="xl" align="center">
              <NavMenu
                items={navItems}
                spacing="lg"
                size={navSize}
                variant={navVariant}
                isMobile
                onItemClick={() => setIsMobileMenuOpen(false)}
              />
            </VStack>
          </Container>
        </VStack>
      </MobileMenuOverlay>
    </Box>
  );
};

// ===== MAIN EXPORT =====
export const Navbar = (patternProps: NavbarPatternProps) => {
  const componentProps = transformPatternToProps(patternProps);
  return <NavbarComponent {...componentProps} />;
};

export default Navbar;