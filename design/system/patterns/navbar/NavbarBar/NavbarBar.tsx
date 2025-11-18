'use client';

import { useState, useEffect } from 'react';
import { cn } from '../../../lib/utils';
import { Box, HStack, VStack, Button, TextLink, IconButton, IconButtons } from '../../../components';
import { LogoImage } from '../../../components/media/Image';
import { CrossIcon, MenuIcon, XIcon } from 'lucide-react';
import Drawer from '../../../components/overlays/Drawer/Drawer';
import { useComponentProps, componentPresent, usePatternProps, useMapComponents, CDN_BASE_URL } from '../../../core/utils/helpers';
import { alignMap } from '../utils';
import './NavbarBar.css';
import { PatternNode } from '../../../core/types/nodes';


const NavbarBar = ( patternNode: PatternNode) => {
    const { components = {} } = patternNode;
    const getComponent = useComponentProps(components);
    const getPatternProps = usePatternProps(patternNode);
    const renderIf = componentPresent(components);
    const mapComponentIndices = useMapComponents(components);


  const [mobileOpen, setMobileOpen] = useState(false);


  const desktopAlign = alignMap[getPatternProps().menuAlign] || 'center';
  const mobileAlign =
    alignMap[getPatternProps().mobileMenuAlign] ||
    alignMap[getPatternProps().menuAlign] ||
    'center';
  const mobileVariant = getPatternProps().mobileMenuVariant || 'fullscreen';

  // Auto-close drawer when screen becomes desktop size (debounced)
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (window.innerWidth > 1024) {
          setMobileOpen(false);
        }
      }, 50);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <nav className="navbar-bar">
  <Box className="navbar-bar__container">
        {/* LEFT */}
        <HStack align="center" spacing="sm" className="navbar-bar__left">
          {renderIf('logo') && (
            <LogoImage
              src={`${CDN_BASE_URL}${getComponent('logo').src}`}
              alt={getComponent('logo').alt || 'Logo'}
              width={getComponent('logo').width || 40}
              height={getComponent('logo').height || 40}
              className="navbar-bar__logo"
              loading="eager"
              priority={true}
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
            <HStack className={`navbar-bar__middle navbar-bar__middle--${desktopAlign}`} spacing="lg">
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
        </div>

        {/* MOBILE TOGGLE */}
        <IconButton
          variant="ghost"
          size="md"
          aria-label="Toggle menu"
          onClick={() => setMobileOpen(!mobileOpen)}
          className="navbar-bar__mobile-toggle"
          icon={
            mobileOpen 
              ? <XIcon /> 
              : <MenuIcon />
          }
        />
      </Box>

      {/* MOBILE DRAWER */}
      <Drawer
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        showCloseButton={false}
        preventScroll
        type="top"
        className={`drawer-variant-${mobileVariant}`}
      >
        <VStack
          spacing="lg"
          align="stretch"
          className={cn(
            "drawer-navbar-content",
            `drawer-align-${mobileAlign}`,
          )}
        >
          {renderIf('textlink', 'menuItem') && mapComponentIndices('textlink', 'menuItem')
            .map((props, i) => (
              <TextLink
                key={i}
                href={props.href}
                onClick={() => setMobileOpen(false)}
                className="drawer-navbar-link"
              >
                {props.content}
              </TextLink>
            ))}

          <VStack spacing="sm" className="drawer-navbar-actions">
            {renderIf('button', 'secondaryAction') && (
              <Button
                variant="ghost"
                href={getComponent('button', 'secondaryAction').href}
                onClick={() => setMobileOpen(false)}
                className="drawer-navbar-button"
              >
                {getComponent('button', 'secondaryAction').content}
              </Button>
            )}
            {renderIf('button', 'primaryAction') && (
              <Button
                variant="primary"
                href={getComponent('button', 'primaryAction').href}
                onClick={() => setMobileOpen(false)}
                className="drawer-navbar-button"
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