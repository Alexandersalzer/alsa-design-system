/**
 * NavbarContainer Component
 * 
 * Wrapper component for layout-driven navbar rendering.
 * Matches NavbarPill structure exactly:
 * - Unified wrapper with pill border containing both navbar and drawer
 * - Glass/transparent background variants with scroll transitions
 * - Mobile drawer inside same bordered container
 * - Hide on scroll behavior
 * - Escape key handler
 * - Body scroll lock with scrollbar compensation
 */

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { IconButton } from '../../components/actions/IconButton';
import { Menu as MenuIcon, X as XIcon } from 'lucide-react';
import { cn } from '../../utils/cn';
import './NavbarContainer.css';

interface NavbarContainerProps {
  children: React.ReactNode;
  mobileMenu: React.ReactNode;
  menuAlign?: 'left' | 'center' | 'right';
  mobileMenuAlign?: 'left' | 'center' | 'right';
  backgroundVariant?: 'default' | 'glass' | 'glass-transparent' | 'transparent';
  showBorder?: boolean;
  hideOnScroll?: boolean;
  /** 'pill' = rounded pill with border, 'bar' = full-width bar, 'center-pill' = logo left + centered pill + actions right */
  navbarStyle?: 'pill' | 'bar' | 'center-pill';
  /** 'sheet' = short dropdown below the bar (default), 'fullscreen' = takes full viewport height */
  drawerStyle?: 'sheet' | 'fullscreen';
  drawerAnimation?: {
    type: 'fadeIn' | 'none';
    settings?: {
      direction?: 'down' | 'up';
      duration?: number;
      stagger?: number;
    };
  };
}

export const NavbarContainer: React.FC<NavbarContainerProps> = ({
  children,
  mobileMenu,
  menuAlign = 'right',
  mobileMenuAlign = 'left',
  backgroundVariant = 'default',
  showBorder = true,
  hideOnScroll = false,
  navbarStyle = 'bar',
  drawerStyle = 'fullscreen',
  drawerAnimation = { type: 'fadeIn', settings: { duration: 400, stagger: 50 } }
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Handle scroll behavior - both scrolled state and hide on scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 50);

      if (hideOnScroll) {
        if (currentScrollY > lastScrollY && currentScrollY > 100) {
          setIsHidden(true);
        } else {
          setIsHidden(false);
        }
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY, hideOnScroll]);

  // Escape key handler - close drawer on Escape
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isMobileMenuOpen]);

  // Prevent body scroll when drawer is open + compensate for scrollbar width
  useEffect(() => {
    if (isMobileMenuOpen) {
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
  }, [isMobileMenuOpen]);

  // Auto-close drawer when screen becomes desktop size
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        if (window.innerWidth > 1024) {
          setIsMobileMenuOpen(false);
        }
        measureWrapper();
      }, 50);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Measure wrapper bottom so fullscreen drawer can offset below it
  const measureWrapper = () => {
    if (wrapperRef.current) {
      const rect = wrapperRef.current.getBoundingClientRect();
      // Use bottom (distance from top of viewport to bottom of wrapper) so the
      // drawer starts exactly below the pill/bar regardless of margin/offset.
      containerRef.current?.style.setProperty('--navbar-wrapper-height', `${rect.bottom}px`);
    }
  };

  useEffect(() => {
    measureWrapper();
  });

  return (
    <>
      {/* Backdrop overlay - only when drawer is open (mobile only) */}
      {isMobileMenuOpen && (
        <div
          className="navbar-container-backdrop"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Unified container - pill + drawer share same border */}
      <nav
        className={cn(
          "navbar-container",
          hideOnScroll && "navbar-container--hide-on-scroll",
          isHidden && "navbar-container--hidden",
          isMobileMenuOpen && "navbar-container--menu-open"
        )}
        data-navbar-style={navbarStyle}
        ref={containerRef}
      >
        <div
          ref={wrapperRef}
          className={cn(
            "navbar-container__unified-wrapper",
            navbarStyle === 'bar' && "navbar-container__unified-wrapper--bar",
            navbarStyle === 'center-pill' && "navbar-container__unified-wrapper--center-pill",
            isMobileMenuOpen && "navbar-container__unified-wrapper--expanded",
            backgroundVariant !== 'default' && `navbar-container__unified-wrapper--${backgroundVariant}`,
            !showBorder && "navbar-container__unified-wrapper--no-border",
            isScrolled && "navbar-container__unified-wrapper--scrolled"
          )}
        >
          {/* Top bar - always visible */}
          <div className="navbar-container__bar">
            {/* Desktop content */}
            <div
              className={cn(
                "navbar-container__desktop",
                navbarStyle === 'center-pill' && "navbar-container__desktop--center-pill"
              )}
              data-menu-align={menuAlign}
            >
              {children}
            </div>

            {/* Mobile toggle button */}
            <IconButton
              variant="ghost"
              size="md"
              aria-label="Toggle menu"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="navbar-container__mobile-toggle"
              icon={isMobileMenuOpen ? <XIcon /> : <MenuIcon />}
            />
          </div>

          {/* Drawer inside wrapper: sheet always, fullscreen for pill/center-pill */}
          {(drawerStyle !== 'fullscreen' || navbarStyle !== 'bar') && (
            <div className={cn(
              "navbar-container__drawer-section",
              drawerStyle === 'fullscreen'
                ? "navbar-container__drawer-section--fullscreen-pill"
                : "navbar-container__drawer-section--sheet",
              isMobileMenuOpen && "navbar-container__drawer-section--open"
            )}>
              <div className={cn(
                "navbar-container__drawer-content",
                `navbar-container__drawer-content--align-${mobileMenuAlign}`
              )}>
                {mobileMenu}
              </div>
            </div>
          )}
        </div>

        {/* Bar fullscreen drawer — fixed overlay outside wrapper */}
        {drawerStyle === 'fullscreen' && navbarStyle === 'bar' && (
          <div className={cn(
            "navbar-container__drawer-section",
            "navbar-container__drawer-section--fullscreen",
            isMobileMenuOpen && "navbar-container__drawer-section--open"
          )}>
            <div className={cn(
              "navbar-container__drawer-content",
              `navbar-container__drawer-content--align-${mobileMenuAlign}`
            )}>
              {mobileMenu}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};
