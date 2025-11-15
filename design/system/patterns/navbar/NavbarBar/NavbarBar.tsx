'use client';

import { useState } from 'react';
import { Box, HStack, VStack, Button, TextLink, IconButton } from '../../../components';
import { MenuIcon, XIcon } from 'lucide-react';
import { Popover } from '../../../components';
import { useComponentProps, componentPresent, usePatternProps, useMapComponents, CDN_BASE_URL } from '../../../core/utils/helpers';
import { alignMap } from '../utils';
import './NavbarBar.css';
import { PatternNode } from '../../../core/types/nodes';

const NavbarBar = (patternNode: PatternNode) => {
  const { components = {} } = patternNode;
  const getComponent = useComponentProps(components);
  const getPatternProps = usePatternProps(patternNode);
  const renderIf = componentPresent(components);
  const mapComponentIndices = useMapComponents(components);

  const [mobileOpen, setMobileOpen] = useState(false);
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

        {/* DESKTOP ITEMS */}
        <HStack className="navbar-bar__content">
          {renderIf('textlink', 'menuItem') && (
            <HStack 
              className={`navbar-bar__middle navbar-bar__middle--${align}`}
              spacing="lg"
            >
              {mapComponentIndices('textlink', 'menuItem')
                .slice(0, getPatternProps().maxMenuItems)
                .map((props, i) => (
                  <TextLink key={i} href={props.href} size="md" underline="hover">
                    {props.content}
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
        </HStack>

        {/* MOBILE MENU (CHAKRA STYLE) */}
        <Popover
          open={mobileOpen}
          onOpenChange={setMobileOpen}
          closeOnInteractOutside
          closeOnEscape
          positioning={{
            placement: 'bottom',
            offset: 12,
            navbar: true,
            alignment: align,        // left, center, right
            animation: 'slide-fade', // or "fade"
          }}
        >
          <Popover.Trigger asChild>
            <IconButton
              variant="ghost"
              size="md"
              aria-label="Toggle menu"
              className="navbar-bar__mobile-toggle"
              icon={mobileOpen ? <XIcon /> : <MenuIcon />}
            />
          </Popover.Trigger>
          <Popover.Positioner>
            <Popover.Content className="navbar-bar__mobile-menu">
              <VStack spacing="md" align="stretch" className="navbar-bar__mobile-content">
                {/* MENU ITEMS */}
                {renderIf('textlink', 'menuItem') && (
                  <VStack spacing="xs" align="stretch">
                    {mapComponentIndices('textlink', 'menuItem').map((props, i) => (
                      <TextLink
                        key={i}
                        href={props.href}
                        onClick={() => setMobileOpen(false)}
                        className="navbar-bar__mobile-link"
                      >
                        {props.content}
                      </TextLink>
                    ))}
                  </VStack>
                )}
                {/* ACTION BUTTONS */}
                <VStack spacing="sm" className="navbar-bar__mobile-actions">
                  {renderIf('button', 'secondaryAction') && (
                    <Button
                      variant="ghost"
                      href={getComponent('button', 'secondaryAction').href}
                      onClick={() => setMobileOpen(false)}
                      className="navbar-bar__mobile-button"
                    >
                      {getComponent('button', 'secondaryAction').content}
                    </Button>
                  )}
                  {renderIf('button', 'primaryAction') && (
                    <Button
                      variant="primary"
                      href={getComponent('button', 'primaryAction').href}
                      onClick={() => setMobileOpen(false)}
                      className="navbar-bar__mobile-button"
                    >
                      {getComponent('button', 'primaryAction').content}
                    </Button>
                  )}
                </VStack>
              </VStack>
            </Popover.Content>
          </Popover.Positioner>
        </Popover>
      </Box>
    </nav>
  );
};

export default NavbarBar;