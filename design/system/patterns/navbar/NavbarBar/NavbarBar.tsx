'use client';

import React, { useState } from 'react';
import { SectionNode } from '../../../core/types/nodes';
import { Box, HStack, VStack, Button, TextLink } from '../../../components';
import { MenuIcon, XIcon } from 'lucide-react';
import './NavbarBar.css';

interface NavbarBarProps {
  section?: SectionNode;
}

const NavbarBar = ({ section }: NavbarBarProps) => {
  if (!section) return null;

  const patternKey = section.order?.[0] || Object.keys(section.patterns || {})[0];
  const pattern = section.patterns?.[patternKey];
  const components = pattern?.components || {};
  const patternProps = pattern?.props || {};

  // Roles
  const logo = Object.values(components).find((c: any) => c.props?.role === 'logo');
  const businessName = Object.values(components).find((c: any) => c.props?.role === 'businessName');
  const menuItems = Object.values(components).filter((c: any) => c.props?.role === 'menuItem');
  const primaryAction = Object.values(components).find((c: any) => c.props?.role === 'primaryAction');
  const secondaryAction = Object.values(components).find((c: any) => c.props?.role === 'secondaryAction');

  const [mobileOpen, setMobileOpen] = useState(false);
  const align: 'left' | 'center' | 'right' = patternProps.menuAlign || 'center';

  return (
    <nav className="navbar-bar">
      <Box className="navbar-bar__container">
        {/* LEFT */}
        <HStack align="center" spacing="sm" className="navbar-bar__left">
          {logo && (
            <img
              src={logo.props?.src}
              alt={logo.props?.alt || 'Logo'}
              className="navbar-bar__logo"
              width={logo.props?.width || 40}
              height={logo.props?.height || 40}
            />
          )}
          {businessName && (
            <TextLink href="/" className="navbar-bar__brand">
              {businessName.props?.content}
            </TextLink>
          )}
        </HStack>

        {/* MIDDLE */}
        {menuItems.length > 0 && (
          <HStack className={`navbar-bar__middle navbar-bar__middle--${align}`} spacing="lg">
            {menuItems.map((item: any, i) => (
              <TextLink key={i} href={item.props?.href || '/'} size="md" underline="hover">
                {item.props?.content}
              </TextLink>
            ))}
          </HStack>
        )}

        {/* RIGHT (hardcoded roles) */}
        <HStack spacing="sm" className="navbar-bar__right">
          {secondaryAction && (
            <Button variant="ghost" href={secondaryAction.props?.href}>
              {secondaryAction.props?.content}
            </Button>
          )}
          {primaryAction && (
            <Button variant="primary" href={primaryAction.props?.href}>
              {primaryAction.props?.content}
            </Button>
          )}
          <Button
            variant="ghost"
            size="md"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="navbar-bar__mobile-toggle"
          >
            {mobileOpen ? <XIcon /> : <MenuIcon />}
          </Button>
        </HStack>
      </Box>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <VStack className="navbar-bar__mobile-menu" spacing="sm">
          {menuItems.map((item: any, i) => (
            <TextLink
              key={i}
              href={item.props?.href || '/'}
              onClick={() => setMobileOpen(false)}
            >
              {item.props?.content}
            </TextLink>
          ))}
          {primaryAction && (
            <Button href={primaryAction.props?.href}>{primaryAction.props?.content}</Button>
          )}
        </VStack>
      )}
    </nav>
  );
};

export default NavbarBar;
