'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Box, HStack, VStack, Button, TextLink, IconButton } from '../../../components';
import { Logo } from '../../../components/media/Logo';
import { MenuIcon, XIcon } from 'lucide-react';
import Drawer from '../../../components/overlays/Drawer/Drawer';
import { componentProps, componentPresent, patternProps, useMapComponents } from '../../../core/utils/props';
import { CDN_BASE_URL } from '../../../core/utils/env';
import { alignMap } from '../utils';
import './NavbarPill.css';
import { PatternNode } from '../../../core/types/nodes';
import { cn } from '../../../utils/cn';

interface NavbarPillProps extends PatternNode {
  sectionKey?: string;
  patternKey?: string;
}

const NavbarPill = ({ components = {}, sectionKey, patternKey, ...patternNode }: NavbarPillProps) => {
  const get = componentProps(components);
  const getPatternProps = patternProps({ components, ...patternNode });
  const renderIf = componentPresent(components);
  const mapComponentIndices = useMapComponents(components);
  const pathname = usePathname();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [pillMetrics, setPillMetrics] = useState({ top: 0, left: 0, width: 0 });
  const pillRef = useRef<HTMLDivElement>(null);
  
  // Extract current locale from pathname
  const currentLocale = pathname.split('/')[1];

  const align = alignMap[getPatternProps().menuAlign] || 'center';
  const mobileAlign = alignMap[getPatternProps().mobileMenuAlign] || align;
  const mobileVariant = getPatternProps().mobileMenuVariant || 'sheet';

  // Calculate pill dimensions for drawer positioning
  useEffect(() => {
    const updateMetrics = () => {
      if (pillRef.current) {
        const rect = pillRef.current.getBoundingClientRect();
        setPillMetrics({
          top: rect.top + (rect.height / 2),
          left: rect.left,
          width: rect.width,
        });
      }
    };

    updateMetrics();
    window.addEventListener('resize', updateMetrics);
    window.addEventListener('scroll', updateMetrics);
    
    return () => {
      window.removeEventListener('resize', updateMetrics);
      window.removeEventListener('scroll', updateMetrics);
    };
  }, [mobileOpen]);

  // Auto-close drawer when screen becomes desktop size
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
    componentKey: renderIf('logo') ? get('logo').key : undefined,
    textComponentKey: renderIf('typography-businessName') ? get('typography-businessName').key : undefined,
  };

  return (
    <>
      <nav className="navbar-pill">
        <Box ref={pillRef} className="navbar-pill__container">
          {/* LEFT - Unified Logo */}
          <div className="navbar-pill__left">
            <Logo {...logoProps} className="navbar-pill__logo" />
          </div>

          {/* MIDDLE - Desktop only */}
          {renderIf('textlink-menuItem') && (
            <HStack
              className={`navbar-pill__middle navbar-pill__middle--${align}`}
              spacing="lg"
            >
              {mapComponentIndices('textlink-menuItem')
                .slice(0, getPatternProps().maxMenuItems)
                .map((props, i) => {
                  const componentKey = `textlink-menuItem_${i}`;
                  return (
                    <TextLink
                      key={i}
                      href={props.href || '/'}
                      size="md"
                      underline="hover"
                      componentKey={componentKey}
                    >
                      {props.content}
                    </TextLink>
                  );
                })}
            </HStack>
          )}

          {/* RIGHT - Desktop only */}
          <HStack spacing="sm" className="navbar-pill__right">
            {renderIf('button-secondaryAction') && (
              <Button variant="ghost" href={get('button-secondaryAction').props.href} componentKey={get('button-secondaryAction').key}>
                {get('button-secondaryAction').props.content}
              </Button>
            )}
            {renderIf('button-primaryAction') && (
              <Button variant="accent" href={get('button-primaryAction').props.href} componentKey={get('button-primaryAction').key}>
                {get('button-primaryAction').props.content}
              </Button>
            )}
          </HStack>

          {/* MOBILE TOGGLE */}
          <IconButton
            variant="ghost"
            size="md"
            aria-label="Toggle menu"
            onClick={() => setMobileOpen(!mobileOpen)}
            className="navbar-pill__mobile-toggle"
            icon={mobileOpen ? <XIcon /> : <MenuIcon />}
          />
        </Box>
      </nav>

      {/* MOBILE DRAWER */}
      <Drawer
        isOpen={mobileOpen}
        onClose={() => setMobileOpen(false)}
        showCloseButton={false}
        preventScroll={true}
        type="pill"
        className={`drawer-variant-pill-${mobileVariant}`}
        style={{
          top: `${pillMetrics.top}px`,
          left: `${pillMetrics.left}px`,
          width: `${pillMetrics.width}px`,
        }}
      >
        <VStack
          spacing="md"
          align="stretch"
          className={cn(
            "drawer-pill-content",
            `drawer-align-${mobileAlign}`
          )}
        >
          {/* Links section */}
          <VStack spacing="md" align="stretch" className="drawer-pill-links">
            {renderIf('textlink-menuItem') && mapComponentIndices('textlink-menuItem')
              .map((props, i) => {
                const componentKey = `textlink-menuItem_${i}`;
                return (
                  <TextLink
                    key={i}
                    href={props.href || '/'}
                    onClick={() => setMobileOpen(false)}
                    className="drawer-pill-link"
                    componentKey={componentKey}
                  >
                    {props.content}
                  </TextLink>
                );
              })}
          </VStack>

          {/* Actions section */}
          <VStack spacing="sm" className="drawer-pill-actions">
            {renderIf('button-secondaryAction') && (
              <Button
                variant="ghost"
                href={get('button-secondaryAction').props.href}
                onClick={() => setMobileOpen(false)}
                className="drawer-pill-button"
                componentKey={get('button-secondaryAction').key}
              >
                {get('button-secondaryAction').props.content}
              </Button>
            )}
            {renderIf('button-primaryAction') && (
              <Button
                variant="accent"
                href={get('button-primaryAction').props.href}
                onClick={() => setMobileOpen(false)}
                className="drawer-pill-button"
                componentKey={get('button-primaryAction').key}
              >
                {get('button-primaryAction').props.content}
              </Button>
            )}
          </VStack>
        </VStack>
      </Drawer>
    </>
  );
};

export default NavbarPill;