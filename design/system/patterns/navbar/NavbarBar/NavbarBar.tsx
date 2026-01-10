'use client';

import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '../../../utils/cn';
import { Box, HStack, VStack, Button, TextLink, IconButton } from '../../../components';
import { Logo } from '../../../components/media/Logo';
import { MenuIcon, XIcon } from 'lucide-react';
import Drawer from '../../../components/overlays/Drawer/Drawer';
import { componentProps, componentPresent, patternProps, useMapComponents } from '../../../core/utils/props';
import { CDN_BASE_URL } from '../../../core/utils/env';
import { alignMap } from '../utils';
import './NavbarBar.css';
import { PatternNode } from '../../../core/types/nodes';

interface NavbarBarProps extends PatternNode {
  sectionKey?: string;
  patternKey?: string;
}

const NavbarBar = ({ components = {}, sectionKey, patternKey, ...patternNode }: NavbarBarProps) => {
    const get = componentProps(components);
    const getPatternProps = patternProps({ components, ...patternNode });
    const renderIf = componentPresent(components);
    const mapComponentIndices = useMapComponents(components);
    const pathname = usePathname();

  const [mobileOpen, setMobileOpen] = useState(false);
  
  // Extract current locale from pathname
  const currentLocale = pathname.split('/')[1];


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

  // Build logo props with componentKey
  const logoProps = {
    src: renderIf('logo') && get('logo').props.src ? `${CDN_BASE_URL}${get('logo').props.src}` : undefined,
    alt: renderIf('logo') ? (get('logo').props.alt || 'Logo') : undefined,
    text: renderIf('typography-businessName') ? get('typography-businessName').props.content : undefined,
    href: `/${currentLocale}`,
    width: renderIf('logo') ? (get('logo').props.width || 40) : undefined,
    height: renderIf('logo') ? (get('logo').props.height || 40) : undefined,
    color: renderIf('logo') ? (get('logo').props.color || 'auto') : 'auto' as const,
    textSize: renderIf('typography-businessName') ? (get('typography-businessName').props.size || 'lg') : 'lg' as const,
    textWeight: renderIf('typography-businessName') ? (get('typography-businessName').props.weight || 'extrabold') : 'extrabold' as const,
    textTransform: renderIf('typography-businessName') ? (get('typography-businessName').props.transform || 'none') : 'none' as const,
    textSpacing: renderIf('typography-businessName') ? (get('typography-businessName').props.spacing || 'normal') : 'normal' as const,
    textGradient: renderIf('typography-businessName') ? (get('typography-businessName').props.gradient || false) : false,
    gap: renderIf('logo') && renderIf('typography-businessName') ? (getPatternProps().logoGap || 'sm') : 'sm' as const,
    hideTextOnMobile: getPatternProps().hideLogoTextOnMobile || false,
    loading: 'eager' as const,
    priority: true,
    componentKey: renderIf('logo') ? get('logo').key : undefined,
    textComponentKey: renderIf('typography-businessName') ? get('typography-businessName').key : undefined,
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
          {renderIf('textlink-menuItem') && (
            <HStack className={`navbar-bar__middle navbar-bar__middle--${desktopAlign}`} spacing="lg">
              {mapComponentIndices('textlink-menuItem')
              .slice(0, getPatternProps().maxMenuItems)
              .map((props, i) => {
                const componentKey = `textlink-menuItem_${i}`;
                return (
                  <TextLink key={i} href={props.href} size="md" underline="hover" componentKey={componentKey}>
                    {props.content}
                  </TextLink>
                );
              })}
            </HStack>
          )}

          <HStack spacing="sm" className="navbar-bar__right">
            {renderIf('button-secondaryAction') && (
              <Button variant="ghost" href={get('button-secondaryAction').props.href} action={get('button-secondaryAction').props.action} componentKey={get('button-secondaryAction').key}>
                {get('button-secondaryAction').props.content}
              </Button>
            )}
            {renderIf('button-primaryAction') && (
              <Button variant="accent" href={get('button-primaryAction').props.href} action={get('button-primaryAction').props.action} componentKey={get('button-primaryAction').key}>
                {get('button-primaryAction').props.content}
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
          {renderIf('textlink-menuItem') && mapComponentIndices('textlink-menuItem')
            .map((props, i) => {
              const componentKey = `textlink-menuItem_${i}`;
              return (
                <TextLink
                  key={i}
                  href={props.href}
                  onClick={() => setMobileOpen(false)}
                  className="drawer-navbar-link"
                  componentKey={componentKey}
                >
                  {props.content}
                </TextLink>
              );
            })}

          <VStack spacing="sm" className="drawer-navbar-actions">
            {renderIf('button-secondaryAction') && (
              <Button
                variant="ghost"
                href={get('button-secondaryAction').props.href}
                action={get('button-secondaryAction').props.action}
                onClick={() => setMobileOpen(false)}
                className="drawer-navbar-button"
                componentKey={get('button-secondaryAction').key}
              >
                {get('button-secondaryAction').props.content}
              </Button>
            )}
            {renderIf('button-primaryAction') && (
              <Button
                variant="accent"
                href={get('button-primaryAction').props.href}
                action={get('button-primaryAction').props.action}
                onClick={() => setMobileOpen(false)}
                className="drawer-navbar-button"
                componentKey={get('button-primaryAction').key}
              >
                {get('button-primaryAction').props.content}
              </Button>
            )}
          </VStack>
        </VStack>
      </Drawer>
    </nav>
  );
};

export default NavbarBar;