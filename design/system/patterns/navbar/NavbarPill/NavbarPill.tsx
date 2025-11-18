'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Box, HStack, VStack, Button, TextLink, IconButton } from '../../../components';
import { LogoImage } from '../../../components/media/Image';
import { MenuIcon, XIcon } from 'lucide-react';
import Drawer from '../../../components/overlays/Drawer/Drawer';
import { useComponentProps, componentPresent, usePatternProps, useMapComponents, CDN_BASE_URL } from '../../../core/utils/helpers';
import { alignMap } from '../utils';
import './NavbarPill.css';
import { PatternNode } from '../../../core/types/nodes';
import { cn } from '../../../lib/utils';

const NavbarPill = (patternNode: PatternNode) => {
  const { components = {} } = patternNode;
  const getComponent = useComponentProps(components);
  const getPatternProps = usePatternProps(patternNode);
  const renderIf = componentPresent(components);
  const mapComponentIndices = useMapComponents(components);

  const [mobileOpen, setMobileOpen] = useState(false);
  const [pillMetrics, setPillMetrics] = useState({ top: 0, left: 0, width: 0 });
  const pillRef = useRef<HTMLDivElement>(null);

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

  return (
    <>
      <nav className="navbar-pill">
        <Box ref={pillRef} className="navbar-pill__container">
          {/* LEFT */}
          <HStack align="center" spacing="sm" className="navbar-pill__left">
            {renderIf('logo') && (
              <LogoImage
                src={`${CDN_BASE_URL}${getComponent('logo').src}`}
                alt={getComponent('logo').alt || 'Logo'}
                width={getComponent('logo').width || 40}
                height={getComponent('logo').height || 40}
                className="navbar-pill__logo"
                loading="eager"
                priority={true}
              />
            )}
            {renderIf('typography', 'businessName') && (
              <TextLink href="/" className="navbar-pill__brand">
                {getComponent('typography', 'businessName').content}
              </TextLink>
            )}
          </HStack>

          {/* MIDDLE - Desktop only */}
          {renderIf('textlink', 'menuItem') && (
            <HStack
              className={`navbar-pill__middle navbar-pill__middle--${align}`}
              spacing="lg"
            >
              {mapComponentIndices('textlink', 'menuItem')
                .slice(0, getPatternProps().maxMenuItems)
                .map((props, i) => (
                <TextLink
                  key={i}
                  href={props.href || '/'}
                  size="md"
                  underline="hover"
                >
                  {props.content}
                </TextLink>
              ))}
            </HStack>
          )}

          {/* RIGHT - Desktop only */}
          <HStack spacing="sm" className="navbar-pill__right">
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
            {renderIf('textlink', 'menuItem') && mapComponentIndices('textlink', 'menuItem')
              .map((props, i) => (
              <TextLink
                key={i}
                href={props.href || '/'}
                onClick={() => setMobileOpen(false)}
                className="drawer-pill-link"
              >
                {props.content}
              </TextLink>
            ))}
          </VStack>

          {/* Actions section */}
          <VStack spacing="sm" className="drawer-pill-actions">
            {renderIf('button', 'secondaryAction') && (
              <Button
                variant="ghost"
                href={getComponent('button', 'secondaryAction').href}
                onClick={() => setMobileOpen(false)}
                className="drawer-pill-button"
              >
                {getComponent('button', 'secondaryAction').content}
              </Button>
            )}
            {renderIf('button', 'primaryAction') && (
              <Button
                variant="primary"
                href={getComponent('button', 'primaryAction').href}
                onClick={() => setMobileOpen(false)}
                className="drawer-pill-button"
              >
                {getComponent('button', 'primaryAction').content}
              </Button>
            )}
          </VStack>
        </VStack>
      </Drawer>
    </>
  );
};

export default NavbarPill;