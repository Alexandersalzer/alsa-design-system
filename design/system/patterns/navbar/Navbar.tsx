'use client';

import React, { useState } from 'react';
import { Box } from '../../components/layout/box/Box';
import { HStack } from '../../components/layout/hStack/HStack';
import { VStack } from '../../components/layout/vStack/VStack';
import { Button, TextLink } from '../../components';
import { MenuIcon, XIcon, ArrowRightIcon } from 'lucide-react';

/* ---------------------------------------------------------
   Types
--------------------------------------------------------- */

export interface NavItem {
  href: string;
  label: string;
  componentType?: 'textlink' | 'button';
  textLinkVariant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'brand';
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  weight?: 'regular' | 'medium' | 'semibold' | 'bold';
  underline?: 'none' | 'hover' | 'always';
  rightIcon?: React.ReactNode;
  leftIcon?: React.ReactNode;
}

export interface NavbarProps {
  props?: Record<string, any>;
  components?: Record<string, any>;
  className?: string;
  /** allows each variant to inject custom dropdown UI */
  renderMobileMenu?: (items: NavItem[]) => React.ReactNode;
}

/* ---------------------------------------------------------
   Parse CMS data
--------------------------------------------------------- */
function parseCmsData(components?: Record<string, any>, props?: Record<string, any>) {
  if (!components) return null;

  const logo = Object.values(components).find((c: any) => c?.type === 'logo');
  const title = Object.values(components).find((c: any) => c?.type === 'title');
  const rawNavItems = Object.values(components).filter((c: any) => c?.type === 'navItem');

  const items: NavItem[] = rawNavItems.map((c: any) => {
    const p = c.props || {};
    return {
      href: p.href || '/',
      label: p.content || '',
      componentType: p.componentType || 'textlink',
      textLinkVariant: p.textLinkVariant || 'primary',
      variant: p.variant || 'primary',
      size: p.size || 'md',
      weight: p.weight || 'medium',
      underline: p.underline || 'hover',
      rightIcon: p.componentType === 'button' ? <ArrowRightIcon /> : undefined,
    };
  });

  const linkItems = items.filter((i) => i.componentType === 'textlink');
  const buttonItems = items.filter((i) => i.componentType === 'button');

  return {
    brandName: title?.props?.content ?? props?.brandName ?? '',
    brandHref: props?.brandHref ?? '/',
    logoSrc: logo?.props?.src,
    logoAlt: logo?.props?.alt ?? 'Logo',
    logoWidth: logo?.props?.width ?? 40,
    logoHeight: logo?.props?.height ?? 40,
    linkItems,
    buttonItems,
  };
}

/* ---------------------------------------------------------
   Navbar Component
--------------------------------------------------------- */
export const Navbar: React.FC<NavbarProps> = ({
  props,
  components,
  className = '',
  renderMobileMenu,
}) => {
  const parsed = parseCmsData(components, props);
  const [isMobileOpen, setMobileOpen] = useState(false);
  const alignment: 'left' | 'center' | 'right' = props?.mainGroupAlign || 'center';

  if (!parsed) return null;

  const allItems = [...parsed.linkItems, ...parsed.buttonItems];

  return (
    <Box className={`navbar ${className}`}>
      <HStack justify="between" align="center" className="navbar__row">
        {/* LEFT: Brand */}
        <HStack align="center" spacing="sm" className="navbar__brand">
          {parsed.logoSrc && (
            <img
              src={parsed.logoSrc}
              alt={parsed.logoAlt}
              width={parsed.logoWidth}
              height={parsed.logoHeight}
              className="navbar__logo"
            />
          )}
          <TextLink
            href={parsed.brandHref}
            variant="brand"
            size="lg"
            weight="bold"
            underline="none"
          >
            {parsed.brandName}
          </TextLink>
        </HStack>

        {/* CENTER: Links (configurable alignment) */}
        <HStack
          align="center"
          spacing="lg"
          className={`navbar__main navbar__main--${alignment}`}
        >
          {parsed.linkItems.map((item, i) => (
            <TextLink
              key={`${item.href}-${i}`}
              href={item.href}
              variant={item.textLinkVariant || 'primary'}
              size={item.size || 'md'}
              weight={item.weight || 'medium'}
              underline={item.underline || 'hover'}
            >
              {item.label}
            </TextLink>
          ))}
        </HStack>

        {/* RIGHT: Buttons */}
        <HStack align="center" spacing="sm" className="navbar__actions">
          {parsed.buttonItems.map((item, i) => (
            <Button
              key={`${item.href}-${i}`}
              href={item.href}
              variant={item.variant || 'primary'}
              size={item.size || 'md'}
              rightIcon={item.rightIcon}
              leftIcon={item.leftIcon}
            >
              {item.label}
            </Button>
          ))}

          {/* MOBILE TOGGLE */}
          <Button
            variant="ghost"
            size="md"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen(!isMobileOpen)}
            className="navbar__mobile-toggle"
          >
            {isMobileOpen ? <XIcon /> : <MenuIcon />}
          </Button>
        </HStack>
      </HStack>

      {/* MOBILE MENU */}
      {isMobileOpen && (
        <Box className="navbar__mobile-menu">
          {renderMobileMenu ? (
            renderMobileMenu(allItems)
          ) : (
            <VStack spacing="sm">
              {allItems.map((item, i) =>
                item.componentType === 'textlink' ? (
                  <TextLink key={`${item.href}-${i}`} href={item.href}>
                    {item.label}
                  </TextLink>
                ) : (
                  <Button
                    key={`${item.href}-${i}`}
                    href={item.href}
                    variant={item.variant || 'primary'}
                    size={item.size || 'md'}
                  >
                    {item.label}
                  </Button>
                )
              )}
            </VStack>
          )}
        </Box>
      )}
    </Box>
  );
};
