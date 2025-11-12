'use client';

import { useState } from 'react';
import { Box, HStack, VStack, Button, TextLink } from '../../../components';
import { MenuIcon } from 'lucide-react';
import Drawer from '../../../components/overlays/Drawer/Drawer';
import { useComponentProps, componentPresent, usePatternProps, useMapComponents, CDN_BASE_URL } from '../../../core/utils/helpers';
import './NavbarBar.css';
import { PatternNode } from '../../../core/types/nodes';


const NavbarBar = ( patternNode: PatternNode) => {
    const { components = {} } = patternNode;
    const getComponent = useComponentProps(components);
    const getPatternProps = usePatternProps(patternNode);
    const renderIf = componentPresent(components);
    const mapComponentIndices = useMapComponents(components);

  const [mobileOpen, setMobileOpen] = useState(false);
  
  // Map menuAlign values
  const alignMap: Record<string, 'left' | 'center' | 'right'> = {
    left: 'left',
    center: 'center', 
    right: 'right',
    middle: 'center', // Map 'middle' to 'center'
  };
  const align = alignMap[getPatternProps().menuAlign] || 'center';

  return (
    <nav className="navbar-bar">
      <Box className="navbar-bar__container">
        {/* LEFT */}
        <HStack align="center" spacing="sm" className="navbar-bar__left">
          {renderIf('logo') && (
            <img
              src={`${CDN_BASE_URL}${getComponent('logo').src}`}
              alt={getComponent('logo').alt || 'Logo'}
              className="navbar-bar__logo"
              width={getComponent('logo').width || 40}
              height={getComponent('logo').height || 40}
            />
          )}
          {renderIf('typography', 'businessName') && (
            <TextLink href="/" className="navbar-bar__brand">
              {getComponent('typography', 'businessName').content}
            </TextLink>
          )}
        </HStack>

        {/* DESKTOP CONTENT */}
        <div className="navbar-bar__content">
          {renderIf('textlink', 'menuItem') && (
            <HStack className={`navbar-bar__middle navbar-bar__middle--${align}`} spacing="lg">
              {mapComponentIndices('textlink', 'menuItem').map(i => (
                <TextLink key={i} href={getComponent('textlink', 'menuItem', {}, i).href} size="md" underline="hover">
                  {getComponent('textlink', 'menuItem', {}, i).content}
                </TextLink>
              ))}
            </HStack>
          )}

          <HStack spacing="sm" className="navbar-bar__right">
            {renderIf('button', 'secondaryAction') && (
              <Button variant="ghost" href={getComponent('button', 'secondaryAction').href}>
                {getComponent('button', 'secondaryAction').content}
              </Button>
            )}
            {renderIf('button', 'primaryAction') && (
              <Button variant="primary" href={getComponent('button', 'primaryAction').href}>
                {getComponent('button', 'primaryAction').content}
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
        showCloseButton
        closeButtonVariant="icon"
        preventScroll
      >
        <VStack spacing="lg" align="center" className="navbar-bar__drawer-content">
          {renderIf('textlink', 'menuItem') && mapComponentIndices('textlink', 'menuItem').map(i => (
            <TextLink
              key={i}
              href={getComponent('textlink', 'menuItem', {}, i).href}
              onClick={() => setMobileOpen(false)}
              className="navbar-bar__drawer-link"
            >
              {getComponent('textlink', 'menuItem', {}, i).content}
            </TextLink>
          ))}

          <VStack spacing="sm" className="navbar-bar__drawer-actions">
            {renderIf('button', 'secondaryAction') && (
              <Button
                variant="ghost"
                href={getComponent('button', 'secondaryAction').href}
                onClick={() => setMobileOpen(false)}
                className="navbar-bar__drawer-button"
              >
                {getComponent('button', 'secondaryAction').content}
              </Button>
            )}
            {renderIf('button', 'primaryAction') && (
              <Button
                variant="primary"
                href={getComponent('button', 'primaryAction').href}
                onClick={() => setMobileOpen(false)}
                className="navbar-bar__drawer-button"
              >
                {getComponent('button', 'primaryAction').content}
              </Button>
            )}
          </VStack>
        </VStack>
      </Drawer>
    </nav>
  );
};

export default NavbarBar;
