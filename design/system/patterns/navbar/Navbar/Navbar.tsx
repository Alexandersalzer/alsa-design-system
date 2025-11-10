'use client';
import React, { useState } from 'react';
import { Box, HStack, VStack, Button, TextLink, IconButton, Container, Logo, Drawer, Modal } from '../../../components';
import { MenuIcon, XIcon } from 'lucide-react';

export type NavbarVariant = 'bar' | 'pill';
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
  sticky?: boolean;

  mobileBreakpoint?: MobileBreakpoint;
  mobileAnimationDirection?: AnimationDirection;
  mobileMenuButtonStyle?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'destructive';
  mobileOverlayTransparent?: boolean;

  brandVariant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'brand';
  brandSize?: 'sm' | 'md' | 'lg' | 'xl';
  brandWeight?: 'regular' | 'medium' | 'semibold' | 'bold';
  brandUnderline?: 'none' | 'hover' | 'always';
  navSize?: 'sm' | 'md' | 'lg' | 'xl';
  navVariant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'destructive';
  className?: string;
}

/* ---------------------------------------------
   BRAND LINK
--------------------------------------------- */
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
}: any) => (
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
          fallbackText={children?.toString()?.charAt(0) || 'B'}
        />
      )}
      {children && <span className="navbar__brand-name">{children}</span>}
    </HStack>
  </TextLink>
);

/* ---------------------------------------------
   NAV MENU
--------------------------------------------- */
const NavMenu = ({ items = [], isMobile = false, onItemClick, spacing = 'lg', size = 'md', variant = 'primary' }: any) => {
  const Stack = isMobile ? VStack : HStack;
  return (
    <Stack spacing={spacing} align={isMobile ? 'stretch' : 'center'} wrap={!isMobile}>
      {items.map((item: NavItem, i: number) => {
        const type = item.componentType || 'textlink';
        if (type === 'textlink') {
          return (
            <TextLink
              key={i}
              href={item.href}
              variant={item.isActive ? 'accent' : item.textLinkVariant || 'primary'}
              size={item.size || size}
              weight={item.weight || 'medium'}
              underline={item.underline || 'hover'}
              onClick={onItemClick}
            >
              {item.label}
            </TextLink>
          );
        }
        return (
          <Button
            key={i}
            href={item.href}
            variant={item.isActive ? 'secondary' : item.variant || variant}
            size={item.size || size}
            onClick={onItemClick}
          >
            {item.label}
          </Button>
        );
      })}
    </Stack>
  );
};

/* ---------------------------------------------
   MAIN NAVBAR COMPONENT
--------------------------------------------- */
const NavbarComponent = ({
  brandName,
  brandHref = '/',
  logoSrc,
  logoAlt = 'Logo',
  logoWidth = 40,
  logoHeight = 40,
  navItems = [],
  navbarVariant = 'bar',
  transparent = false,
  navbarWidth = 'content',
  sticky = false,
  mobileBreakpoint = 'md',
  mobileAnimationDirection = 'right',
  mobileMenuButtonStyle = 'ghost',
  mobileOverlayTransparent = false,
  brandVariant = 'brand',
  brandSize = 'lg',
  brandWeight = 'bold',
  brandUnderline = 'none',
  navSize = 'md',
  navVariant = 'primary',
  className = '',
}: NavbarProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const navbarClasses = [
    'navbar',
    `navbar--${navbarVariant}`,
    `navbar--width-${navbarWidth}`,
    `navbar--mobile-${mobileBreakpoint}`,
    transparent && 'navbar--transparent',
    sticky && 'navbar--sticky',
    className,
  ].filter(Boolean).join(' ');

  return (
    <Box className={navbarClasses}>
      <Box className="navbar__container">
        <HStack justify="between" align="center" className="navbar__content">
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

          {/* Desktop menu */}
          <Box className="navbar__desktop-menu">
            <NavMenu items={navItems} size={navSize} variant={navVariant} />
          </Box>

          {/* Mobile toggle */}
          <Box className="navbar__mobile-toggle">
            <IconButton
              icon={isOpen ? <XIcon /> : <MenuIcon />}
              variant={mobileMenuButtonStyle}
              size="lg"
              aria-label="Toggle menu"
              onClick={() => setIsOpen(!isOpen)}
            />
          </Box>
        </HStack>
      </Box>

      {/* Mobile overlay */}
      {navbarVariant === 'pill' ? (
        <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} size="full" showCloseButton={false} className={mobileOverlayTransparent ? 'modal--transparent' : ''}>
          <VStack spacing="xl" className="navbar__mobile-menu">
            <BrandLink href={brandHref} logoSrc={logoSrc} logoAlt={logoAlt}>{brandName}</BrandLink>
            <NavMenu items={navItems} isMobile onItemClick={() => setIsOpen(false)} />
          </VStack>
        </Modal>
      ) : (
        <Drawer isOpen={isOpen} onClose={() => setIsOpen(false)} placement={mobileAnimationDirection === 'left' ? 'start' : 'end'} className={mobileOverlayTransparent ? 'drawer--transparent' : ''}>
          <VStack spacing="lg" className="navbar__mobile-menu">
            <NavMenu items={navItems} isMobile onItemClick={() => setIsOpen(false)} />
          </VStack>
        </Drawer>
      )}
    </Box>
  );
};

/* ---------------------------------------------
   TRANSFORM JSON → PROPS
--------------------------------------------- */
function transformPatternToProps(sectionData: any): NavbarProps {
  const sectionProps = sectionData.props || {};
  const patternKey =
    sectionData.order?.[0] || Object.keys(sectionData.patterns || {})[0];
  const pattern = sectionData.patterns?.[patternKey] || {};
  const components = (pattern.components || {}) as Record<
    string,
    { type: string; props?: Record<string, any> }
  >;

  // ✅ Now TypeScript knows each component has a type + props
  const logo = Object.values(components).find(
    (c) => c.type === 'logo'
  );
  const title = Object.values(components).find(
    (c) => c.type === 'title'
  );

  const navItems: NavItem[] = Object.values(components)
    .filter((c) => c.type === 'navItem')
    .map((c) => ({
      href: c.props?.href || '/',
      label: c.props?.content || '',
      componentType: c.props?.componentType || 'textlink',
      variant: c.props?.variant,
      size: c.props?.size,
      textLinkVariant: c.props?.textLinkVariant,
      weight: c.props?.weight,
      underline: c.props?.underline,
    }));

  return {
    ...sectionProps,
    brandName: title?.props?.content || sectionProps.brandName,
    logoSrc: logo?.props?.src,
    logoAlt: logo?.props?.alt,
    logoWidth: logo?.props?.width,
    logoHeight: logo?.props?.height,
    navItems,
  };
}


/* ---------------------------------------------
   EXPORT FINAL NAVBAR
--------------------------------------------- */
export const Navbar = (sectionData: any) => {
  const props = transformPatternToProps(sectionData);
  return <NavbarComponent {...props} />;
};

export default Navbar;
