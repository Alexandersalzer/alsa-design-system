'use client';

import React, { useState } from 'react';
import { Box, HStack, VStack, Button, TextLink, IconButton } from '../../../components';
import { MenuIcon } from 'lucide-react';
import { Modal } from '../../../components/overlays/Modal/Modal';
import './NavbarPill.css';

interface NavbarPillProps {
  type?: string;
  props?: Record<string, any>;
  components?: Record<string, any>;
}

const NavbarPill = ({ type, props: patternProps = {}, components = {} }: NavbarPillProps) => {
  if (!components) return null;

  // Roles
  const logo = Object.values(components).find((c: any) => c.props?.role === 'logo');
  const businessName = Object.values(components).find((c: any) => c.props?.role === 'businessName');
  const menuItems = Object.values(components).filter((c: any) => c.props?.role === 'menuItem');
  const primaryAction = Object.values(components).find((c: any) => c.props?.role === 'primaryAction');
  const secondaryAction = Object.values(components).find((c: any) => c.props?.role === 'secondaryAction');

  const [mobileOpen, setMobileOpen] = useState(false);
  
  // Map menuAlign values
  const alignMap: Record<string, 'left' | 'center' | 'right'> = {
    left: 'left',
    center: 'center', 
    right: 'right',
    middle: 'center', // Map 'middle' to 'center'
  };
  const align = alignMap[patternProps.menuAlign] || 'center';

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

          {/* MIDDLE */}
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
            <IconButton
              variant="ghost"
              size="md"
              aria-label="Toggle menu"
              onClick={() => setMobileOpen(true)}
              className="navbar-pill__mobile-toggle"
              icon={<MenuIcon />}
            />
          </HStack>
        </Box>
      </nav>

      {/* MOBILE MODAL MENU */}
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
