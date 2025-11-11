'use client';

import React, { useState } from 'react';
import { SectionNode } from '../../../core/types/nodes';
import { Box, HStack, VStack, Button, TextLink } from '../../../components';
import { MenuIcon, XIcon } from 'lucide-react';

interface NavbarBarProps {
  section?: SectionNode;
}

export const NavbarBar = ({ section }: NavbarBarProps) => {
  if (!section) return null;

  const sectionProps = section.props || {};
  const patternKey = section.order?.[0] || Object.keys(section.patterns || {})[0];
  const pattern = section.patterns?.[patternKey];
  const components = pattern?.components || {};

  // Parse components
  const logo = Object.values(components).find((c: any) => c.type === 'logo');
  const title = Object.values(components).find((c: any) => c.type === 'title');
  const rawItems = Object.values(components).filter((c: any) => c.type === 'navItem');

  // Build groups
  const leftGroup = logo || title ? [logo, title].filter(Boolean) : [];
  const middleGroup = rawItems.filter((i: any) => i.props?.group === 'middle');
  const rightGroup = rawItems.filter((i: any) => i.props?.group === 'right');

  const [mobileOpen, setMobileOpen] = useState(false);
  const align: 'left' | 'center' | 'right' = sectionProps.mainGroupAlign || 'center';

  return (
    <nav className="navbar-bar">
      <Box className="navbar-bar__inner">
        {/* LEFT: brand */}
        <HStack align="center" spacing="sm" className="navbar-bar__left">
          {logo && (
            <img
              src={logo.props?.src}
              alt={logo.props?.alt || 'Logo'}
              width={logo.props?.width || 40}
              height={logo.props?.height || 40}
              className="navbar-bar__logo"
            />
          )}
          {title && (
            <TextLink href="/" weight="bold" size="lg" underline="none">
              {title.props?.content}
            </TextLink>
          )}
        </HStack>

        {/* MIDDLE */}
        {middleGroup.length > 0 && (
          <HStack
            className={`navbar-bar__middle navbar-bar__middle--${align}`}
            spacing="lg"
          >
            {middleGroup.map((item: any, i) => (
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
        <HStack spacing="sm" className="navbar-bar__right">
          {rightGroup.map((item: any, i) => {
            const type = item.props?.componentType || 'textlink';
            return type === 'button' ? (
              <Button key={i} href={item.props?.href || '/'} size="md">
                {item.props?.content}
              </Button>
            ) : (
              <TextLink key={i} href={item.props?.href || '/'} size="md">
                {item.props?.content}
              </TextLink>
            );
          })}
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
          {[...middleGroup, ...rightGroup].map((item: any, i) => (
            <TextLink
              key={i}
              href={item.props?.href || '/'}
              onClick={() => setMobileOpen(false)}
            >
              {item.props?.content}
            </TextLink>
          ))}
        </VStack>
      )}
    </nav>
  );
};

export default NavbarBar;
