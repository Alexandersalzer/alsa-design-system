'use client';

import React, { useState, useRef, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { Box, HStack, VStack, Button, TextLink, IconButton } from '../../../components';
import { Logo } from '../../../components/media/Logo';
import { MenuIcon, XIcon } from 'lucide-react';
import { FadeIn } from '../../../components/animations/FadeIn/FadeIn';
import { componentProps, componentPresent, patternProps, useMapComponents } from '../../../core/utils/props';
import { CDN_BASE_URL } from '../../../core/utils/env';
import { alignMap } from '../utils';
import './NavbarPill.css';
import { PatternNode } from '../../../core/types/nodes';
import { AnimationConfig } from '../../../core/animations/types';
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
  const pillRef = useRef<HTMLDivElement>(null);
  
  // Extract current locale from pathname
  const currentLocale = pathname.split('/')[1];

  const align = alignMap[getPatternProps().menuAlign] || 'center';
  const mobileAlign = alignMap[getPatternProps().mobileMenuAlign] || align;
  const mobileVariant = getPatternProps().mobileMenuVariant || 'sheet';

  // Animation configuration for drawer items
  const drawerAnimation = getPatternProps().drawerAnimation as AnimationConfig | undefined;
  const enableDrawerAnimation = drawerAnimation && drawerAnimation.type !== 'none';

  // Extract animation settings based on type
  const getAnimationSettings = () => {
    if (!drawerAnimation || drawerAnimation.type === 'none') {
      return { duration: 400, stagger: 50, direction: 'down' as const };
    }

    if (drawerAnimation.type === 'fadeIn') {
      return {
        duration: drawerAnimation.settings?.duration || 400,
        stagger: drawerAnimation.settings?.stagger || 50,
        direction: drawerAnimation.settings?.direction || 'down' as const,
      };
    }

    // Fallback for other animation types
    return { duration: 400, stagger: 50, direction: 'down' as const };
  };

  const { duration: animationDuration, stagger: animationStagger, direction: animationDirection } = getAnimationSettings();

  // Escape key handler - close drawer on Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && mobileOpen) {
        setMobileOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [mobileOpen]);

  // Prevent body scroll when drawer is open
  useEffect(() => {
    if (mobileOpen) {
      const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
      document.body.style.overflow = 'hidden';
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
    }

    return () => {
      document.body.style.overflow = '';
      document.body.style.paddingRight = '';
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
      {/* Backdrop overlay - only when drawer is open (mobile only) */}
      {mobileOpen && (
        <div
          className="navbar-pill-backdrop"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Unified container - pill + drawer share same border */}
      <nav className="navbar-pill" ref={pillRef}>
        <Box className={cn(
          "navbar-pill__unified-wrapper",
          mobileOpen && "navbar-pill__unified-wrapper--expanded"
        )}>
          {/* Top bar - always visible */}
          <div className="navbar-pill__container">
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

            {/* MOBILE TOGGLE */}
            <IconButton
              variant="ghost"
              size="md"
              aria-label="Toggle menu"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="navbar-pill__mobile-toggle"
              icon={mobileOpen ? <XIcon /> : <MenuIcon />}
            />
          </div>

          {/* Mobile drawer content - inside same bordered container */}
          <div className={cn(
            "navbar-pill__drawer-section",
            mobileOpen && "navbar-pill__drawer-section--open",
            `navbar-pill__drawer-section--${mobileVariant}`
          )}>
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
                {renderIf('textlink-menuItem') && mobileOpen && mapComponentIndices('textlink-menuItem')
                  .map((props, i) => {
                    const componentKey = `textlink-menuItem_${i}`;
                    const linkContent = (
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

                    // Wrap with animation if enabled
                    if (enableDrawerAnimation && drawerAnimation?.type === 'fadeIn') {
                      return (
                        <FadeIn
                          key={`link-${i}-${Date.now()}`}
                          direction={animationDirection}
                          duration={animationDuration}
                          delay={i * animationStagger}
                          distance={20}
                          enableScrollTrigger={false}
                        >
                          {linkContent}
                        </FadeIn>
                      );
                    }

                    return linkContent;
                  })}
              </VStack>

              {/* Actions section */}
              <VStack spacing="sm" className="drawer-pill-actions">
                {renderIf('button-secondaryAction') && mobileOpen && (() => {
                  const menuItemsCount = mapComponentIndices('textlink-menuItem').length;
                  const buttonContent = (
                    <Button
                      variant="ghost"
                      href={get('button-secondaryAction').props.href}
                      action={get('button-secondaryAction').props.action}
                      onClick={() => setMobileOpen(false)}
                      className="drawer-pill-button"
                      componentKey={get('button-secondaryAction').key}
                    >
                      {get('button-secondaryAction').props.content}
                    </Button>
                  );

                  if (enableDrawerAnimation && drawerAnimation?.type === 'fadeIn') {
                    return (
                      <FadeIn
                        key={`secondary-button-${Date.now()}`}
                        direction={animationDirection}
                        duration={animationDuration}
                        delay={menuItemsCount * animationStagger}
                        distance={20}
                        enableScrollTrigger={false}
                      >
                        {buttonContent}
                      </FadeIn>
                    );
                  }

                  return buttonContent;
                })()}

                {renderIf('button-primaryAction') && mobileOpen && (() => {
                  const menuItemsCount = mapComponentIndices('textlink-menuItem').length;
                  const secondaryButtonOffset = renderIf('button-secondaryAction') ? 1 : 0;
                  const buttonContent = (
                    <Button
                      variant="accent"
                      href={get('button-primaryAction').props.href}
                      action={get('button-primaryAction').props.action}
                      onClick={() => setMobileOpen(false)}
                      className="drawer-pill-button"
                      componentKey={get('button-primaryAction').key}
                    >
                      {get('button-primaryAction').props.content}
                    </Button>
                  );

                  if (enableDrawerAnimation && drawerAnimation?.type === 'fadeIn') {
                    return (
                      <FadeIn
                        key={`primary-button-${Date.now()}`}
                        direction={animationDirection}
                        duration={animationDuration}
                        delay={(menuItemsCount + secondaryButtonOffset) * animationStagger}
                        distance={20}
                        enableScrollTrigger={false}
                      >
                        {buttonContent}
                      </FadeIn>
                    );
                  }

                  return buttonContent;
                })()}
              </VStack>
            </VStack>
          </div>
        </Box>
      </nav>
    </>
  );
};

export default NavbarPill;