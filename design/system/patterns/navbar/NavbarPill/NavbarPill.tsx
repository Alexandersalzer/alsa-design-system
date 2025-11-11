'use client';

import React, { useState } from 'react';
import { SectionNode } from '../../../core/types/nodes';
import { Box, HStack, VStack, Button, TextLink } from '../../../components';
import { MenuIcon, XIcon } from 'lucide-react';
import './NavbarPill.css';

interface NavbarPillProps {
  section?: SectionNode;
}

const NavbarPill = ({ section }: NavbarPillProps) => {
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
    <nav className="navbar-pill">
      <Box className="navbar-pill__container">
        {/* LEFT */}
        <HStack align="center" spacing="sm" className="navbar-pill__left">
          {logo && (
            <img
              src={logo.props?.src}
              alt={logo.props?.alt || 'Logo'}
              className="navbar-pill__logo"
              width={logo.props?.width || 40}
              height={logo.props?.height || 40}
            />
          )}
          {businessName && (
            <TextLink href="/" className="navbar-pill__brand">
              {businessName.props?.content}
            </TextLink>
          )}
        </HStack>

        {/* DESKTOP CONTENT */}
        <div className="navbar-pill__content">
          {menuItems.length > 0 && (
            <HStack
              className={`navbar-pill__middle navbar-pill__middle--${align}`}
              spacing="lg"
            >
              {menuItems.map((item: any, i) => (
                <TextLink
                  key={i}
                  href={item.props?.href || '/'}
                  size="md"
                  underline="hover"
                >
                  {item.props?.content}
                </TextLink>
              ))}
            </HStack>
          )}

          <HStack spacing="sm" className="navbar-pill__right">
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
          aria-label="Toggle menu"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="navbar-pill__mobile-toggle"
        >
          {mobileOpen ? <XIcon /> : <MenuIcon />}
        </Button>
      </Box>

      {/* MOBILE MENU */}
      <VStack
        className={`navbar-pill__mobile-menu ${
          mobileOpen ? 'navbar-pill__mobile-menu--open' : ''
        }`}
        spacing="md"
      >
        {menuItems.map((item: any, i) => (
          <TextLink
            key={i}
            href={item.props?.href || '/'}
            onClick={() => setMobileOpen(false)}
            className="navbar-pill__mobile-link"
          >
            {item.props?.content}
          </TextLink>
        ))}

        <VStack spacing="sm" className="navbar-pill__mobile-actions">
          {secondaryAction && (
            <Button
              variant="ghost"
              href={secondaryAction.props?.href}
              onClick={() => setMobileOpen(false)}
              className="navbar-pill__mobile-button"
            >
              {secondaryAction.props?.content}
            </Button>
          )}
          {primaryAction && (
            <Button
              variant="primary"
              href={primaryAction.props?.href}
              onClick={() => setMobileOpen(false)}
              className="navbar-pill__mobile-button"
            >
              {primaryAction.props?.content}
            </Button>
          )}
        </VStack>
      </VStack>
    </nav>
  );
};

export default NavbarPill;
