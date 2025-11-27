'use client';

import { useState, useEffect } from 'react';
import { cn } from '../../../utils/cn';
import { Box, HStack, VStack, Button, TextLink, IconButton } from '../../../components';
import { Logo } from '../../../components/media/Logo';
import { MenuIcon, XIcon } from 'lucide-react';
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

  // Build logo props
  const logoProps = {
    src: renderIf('logo') ? `${CDN_BASE_URL}${getComponent('logo').src}` : undefined,
    alt: renderIf('logo') ? (getComponent('logo').alt || 'Logo') : undefined,
    text: renderIf('typography', 'businessName') ? getComponent('typography', 'businessName').content : undefined,
    href: '/',
    width: renderIf('logo') ? (getComponent('logo').width || 40) : undefined,
    height: renderIf('logo') ? (getComponent('logo').height || 40) : undefined,
    color: renderIf('logo') ? (getComponent('logo').color || 'auto') : 'auto' as const,
    textSize: renderIf('typography', 'businessName') ? (getComponent('typography', 'businessName').size || 'lg') : 'lg' as const,
    textWeight: renderIf('typography', 'businessName') ? (getComponent('typography', 'businessName').weight || 'extrabold') : 'extrabold' as const,
    textTransform: renderIf('typography', 'businessName') ? (getComponent('typography', 'businessName').transform || 'none') : 'none' as const,
    textSpacing: renderIf('typography', 'businessName') ? (getComponent('typography', 'businessName').spacing || 'normal') : 'normal' as const,
    textGradient: renderIf('typography', 'businessName') ? (getComponent('typography', 'businessName').gradient || false) : false,
    gap: renderIf('logo') && renderIf('typography', 'businessName') ? (getPatternProps().logoGap || 'sm') : 'sm' as const,
    hideTextOnMobile: getPatternProps().hideLogoTextOnMobile || false,
    loading: 'eager' as const,
    priority: true,
  };

  return (
    <nav className="navbar-bar">
      <Box className="navbar-bar__container">
        {/* LEFT - Unified Logo */}
        <div className="navbar-bar__left">
          <Logo {...logoProps} className="navbar-bar__logo" />
        </div>

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