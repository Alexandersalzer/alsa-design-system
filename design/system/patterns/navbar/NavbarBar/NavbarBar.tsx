'use client';

import React, { useState } from 'react';
import { SectionNode } from '../../../core/types/nodes';
import { Box, HStack, VStack, Button, TextLink } from '../../../components';
import { MenuIcon } from 'lucide-react';
import Drawer from '../../../components/overlays/Drawer/Drawer';
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

        {/* DESKTOP CONTENT */}
        <div className="navbar-bar__content">
          {menuItems.length > 0 && (
            <HStack className={`navbar-bar__middle navbar-bar__middle--${align}`} spacing="lg">
              {menuItems.map((item: any, i) => (
                <TextLink key={i} href={item.props?.href || '/'} size="md" underline="hover">
                  {item.props?.content}
                </TextLink>
              ))}
            </HStack>
          )}

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
          </HStack>
        </div>

        {/* MOBILE TOGGLE */}
        <Button
          variant="ghost"
          size="md"
          aria-label="Open menu"
          onClick={() => setMobileOpen(true)}
          className="navbar-bar__mobile-toggle"
        >
          <MenuIcon />
        </Button>
      </Box>

      {/* MOBILE DRAWER */}
      <Drawer
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        placement="end"
        size="md"
        mobileOverlay
        showCloseButton
        closeButtonVariant="icon"
        preventScroll
      >
        <VStack spacing="lg" align="center" className="navbar-bar__drawer-content">
          {menuItems.map((item: any, i) => (
            <TextLink
              key={i}
              href={item.props?.href || '/'}
              onClick={() => setMobileOpen(false)}
              className="navbar-bar__drawer-link"
            >
              {item.props?.content}
            </TextLink>
          ))}

          <VStack spacing="sm" className="navbar-bar__drawer-actions">
            {secondaryAction && (
              <Button
                variant="ghost"
                href={secondaryAction.props?.href}
                onClick={() => setMobileOpen(false)}
                className="navbar-bar__drawer-button"
              >
                {secondaryAction.props?.content}
              </Button>
            )}
            {primaryAction && (
              <Button
                variant="primary"
                href={primaryAction.props?.href}
                onClick={() => setMobileOpen(false)}
                className="navbar-bar__drawer-button"
              >
                {primaryAction.props?.content}
              </Button>
            )}
          </VStack>
        </VStack>
      </Drawer>
    </nav>
  );
};

export default NavbarBar;
