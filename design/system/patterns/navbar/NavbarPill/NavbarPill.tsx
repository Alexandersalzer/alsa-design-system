'use client';

import React, { useState } from 'react';
import { SectionNode } from '../../../core/types/nodes';
import { Box, HStack, VStack, Button, TextLink } from '../../../components';
import { MenuIcon } from 'lucide-react';
import { Modal } from '../../../components/overlays/Modal/Modal';
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
    <>
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

          {/* CENTER */}
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

          {/* RIGHT */}
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
            {/* MOBILE TOGGLE */}
            <Button
              variant="ghost"
              size="md"
              aria-label="Toggle menu"
              onClick={() => setMobileOpen(true)}
              className="navbar-pill__mobile-toggle"
            >
              <MenuIcon />
            </Button>
          </HStack>
        </Box>
      </nav>

      {/* FULLSCREEN MODAL MENU */}
      <Modal
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        size="full"
        title={businessName?.props?.content || 'Meny'}
        showCloseButton
      >
        <VStack spacing="xl" align="center" className="navbar-pill__modal-menu">
          {menuItems.map((item: any, i) => (
            <TextLink
              key={i}
              href={item.props?.href || '/'}
              onClick={() => setMobileOpen(false)}
              className="navbar-pill__modal-link"
            >
              {item.props?.content}
            </TextLink>
          ))}

          <VStack spacing="sm" className="navbar-pill__modal-actions">
            {secondaryAction && (
              <Button
                variant="ghost"
                href={secondaryAction.props?.href}
                onClick={() => setMobileOpen(false)}
              >
                {secondaryAction.props?.content}
              </Button>
            )}
            {primaryAction && (
              <Button
                variant="primary"
                href={primaryAction.props?.href}
                onClick={() => setMobileOpen(false)}
              >
                {primaryAction.props?.content}
              </Button>
            )}
          </VStack>
        </VStack>
      </Modal>
    </>
  );
};

export default NavbarPill;
