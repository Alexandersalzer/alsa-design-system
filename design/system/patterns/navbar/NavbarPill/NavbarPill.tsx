'use client';

import React from 'react';
import { useState } from 'react';
import { SectionNode } from '../../../core/types/nodes';
import { Box, HStack, VStack, Button, TextLink } from '../../../components';
import { MenuIcon } from 'lucide-react';
import { Popover } from '../../../components/overlays/Popover/Popover';
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

  const align: 'left' | 'center' | 'right' = patternProps.menuAlign || 'center';
  const [open, setOpen] = useState(false);

  return (
    <nav className="navbar-pill">
      <Box className="navbar-pill__container">
        {/* LEFT SIDE */}
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

        {/* DESKTOP NAVIGATION */}
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

        {/* MOBILE POPOVER MENU */}
        <div className="navbar-pill__mobile">
          <Popover open={open} onOpenChange={setOpen}>
            <Popover.Trigger asChild>
              <Button
                variant="ghost"
                size="md"
                aria-label="Open menu"
                className="navbar-pill__mobile-toggle"
              >
                <MenuIcon />
              </Button>
            </Popover.Trigger>

            <Popover.Positioner>
              <Popover.Content className="navbar-pill__popover">
                <VStack spacing="lg" align="center" className="navbar-pill__popover-menu">
                  {menuItems.map((item: any, i) => (
                    <TextLink
                      key={i}
                      href={item.props?.href || '/'}
                      onClick={() => setOpen(false)}
                      className="navbar-pill__popover-link"
                    >
                      {item.props?.content}
                    </TextLink>
                  ))}

                  <VStack spacing="sm" className="navbar-pill__popover-actions">
                    {secondaryAction && (
                      <Button
                        variant="ghost"
                        href={secondaryAction.props?.href}
                        onClick={() => setOpen(false)}
                      >
                        {secondaryAction.props?.content}
                      </Button>
                    )}
                    {primaryAction && (
                      <Button
                        variant="primary"
                        href={primaryAction.props?.href}
                        onClick={() => setOpen(false)}
                      >
                        {primaryAction.props?.content}
                      </Button>
                    )}
                  </VStack>
                </VStack>
              </Popover.Content>
            </Popover.Positioner>
          </Popover>
        </div>
      </Box>
    </nav>
  );
};

export default NavbarPill;
