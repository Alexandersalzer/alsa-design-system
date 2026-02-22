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
  drawerAnimation = { type: 'fadeIn', settings: { duration: 400, stagger: 50 } }
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

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
      }, 50);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
          isHidden && "navbar-container--hidden"
        )} 
        ref={containerRef}
      >
        <div className={cn(
          "navbar-container__unified-wrapper",
          isMobileMenuOpen && "navbar-container__unified-wrapper--expanded",
          backgroundVariant !== 'default' && `navbar-container__unified-wrapper--${backgroundVariant}`,
          !showBorder && "navbar-container__unified-wrapper--no-border",
          isScrolled && "navbar-container__unified-wrapper--scrolled"
        )}>
          {/* Top bar - always visible */}
          <div className="navbar-container__bar">
            {/* Desktop content */}
            <div className="navbar-container__desktop" data-menu-align={menuAlign}>
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

          {/* Mobile drawer content - inside same bordered container */}
          <div className={cn(
            "navbar-container__drawer-section",
            isMobileMenuOpen && "navbar-container__drawer-section--open"
          )}>
            <div className={cn(
              "navbar-container__drawer-content",
              `navbar-container__drawer-content--align-${mobileMenuAlign}`
            )}>
              {mobileMenu}
            </div>
          </div>
        </div>
      </nav>
    </>
  );
};
