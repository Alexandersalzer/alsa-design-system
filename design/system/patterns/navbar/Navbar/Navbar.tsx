'use client';

import React, { useState } from 'react';
import {
  Drawer,
  Modal,
  Popover,
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
              leftIcon={item.leftIcon}
              rightIcon={item.rightIcon}
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
            variant={buttonVariant}
            size={itemSize}
            rightIcon={item.rightIcon}
            leftIcon={item.leftIcon}
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
  transparent = false,
}: MobileMenuOverlayProps) => {
  // Decide which system primitive to use
  if (overlayVariant === 'sidebar') {
    return (
      <Drawer
        isOpen={isOpen}
        onClose={onClose}
        placement={animationDirection === 'left' ? 'start' : 'end'}
        showCloseButton={false}
        className={transparent ? 'drawer--transparent' : ''}
      >
        {children}
      </Drawer>
    );
  }
  if (overlayVariant === 'dropdown') {
    return (
      <Popover
        open={isOpen}
        onOpenChange={(open) => {
          if (!open) onClose();
        }}
        modal={false}
        closeOnInteractOutside
        closeOnEscape
      >
        <Popover.Trigger asChild>
          {/* Invisible trigger element – Popover needs one */}
          <div style={{ display: 'none' }} />
        </Popover.Trigger>
        <Popover.Positioner>
          <Popover.Content
            className={transparent ? 'popover--transparent' : ''}
            positioning={{ placement: 'bottom-start' }}
            maxHeight={600}
          >
            {children}
          </Popover.Content>
        </Popover.Positioner>
      </Popover>
    );
  }

  // Default = full modal
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

  const logo = Object.values(components || {}).find((c: any) => c.type === 'logo') as any;
  const brand = Object.values(components || {}).find((c: any) => c.type === 'title') as any;

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
    navbarVariant: props?.navbarVariant || 'bar',
    transparent: props?.transparent || false,
    navbarWidth: props?.navbarWidth || 'content',
    sticky: props?.sticky || false,

    mobileBreakpoint: props?.mobileBreakpoint || 'md',
    mobileOverlayVariant: props?.mobileOverlayVariant || 'full',
    mobileAnimationDirection: props?.mobileAnimationDirection || 'right',
    mobileMenuButtonStyle: props?.mobileMenuButtonStyle || 'ghost',
    mobileOverlayTransparent: props?.mobileOverlayTransparent || false,

    brandName: brand?.props?.content || props?.brandName,
    brandHref: props?.brandHref || '/',
    brandVariant: props?.brandVariant || 'brand',
    brandSize: props?.brandSize || 'lg',
    brandWeight: props?.brandWeight || 'bold',
    brandUnderline: props?.brandUnderline || 'none',

    logoSrc: logo?.props?.src,
    logoAlt: logo?.props?.alt || 'Logo',
    logoWidth: logo?.props?.width || 40,
    logoHeight: logo?.props?.height || 40,

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
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Box className={navbarClasses}>
      <Box className="navbar__container">
        <HStack justify="between" align="center" spacing="md" wrap={false} className="navbar__content">
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
            <NavMenu items={navItems} spacing="xl" size={navSize} variant={navVariant} />
          </Box>

          <Box className="navbar__mobile-toggle">
            <MobileMenuButton
              isOpen={isMobileMenuOpen}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              buttonVariant={mobileMenuButtonStyle}
            />
          </Box>
        </HStack>
      </Box>

      <MobileMenuOverlay
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
        overlayVariant={navbarVariant === 'pill' ? 'dropdown' : mobileOverlayVariant}
        animationDirection={navbarVariant === 'pill' ? 'top' : mobileAnimationDirection}
        transparent={mobileOverlayTransparent}
      >
        <Container spacing="lg" height="full">
          <VStack spacing="2xl" className="navbar__mobile-menu">
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
                buttonVariant={mobileMenuButtonStyle}
              />
            </HStack>

            <NavMenu
              items={navItems}
              spacing="md"
              size={navSize}
              variant={navVariant}
              isMobile
              onItemClick={() => setIsMobileMenuOpen(false)}
            />

            {navbarVariant === 'bar' && (
              <Button
                variant="accent"
                size="lg"
                radius="lg"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  window.location.href = '/contact';
                }}
              >
                Starta projekt
              </Button>
            )}
          </VStack>
        </Container>
      </MobileMenuOverlay>
    </Box>
  );
};

// ===== EXPORT =====
export const Navbar = (patternProps: NavbarPatternProps) => {
  const componentProps = transformPatternToProps(patternProps);
  return <NavbarComponent {...componentProps} />;
};

export default Navbar;
