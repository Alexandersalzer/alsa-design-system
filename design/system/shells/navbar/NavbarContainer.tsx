/**
 * NavbarContainer Component
 * 
 * Wrapper component for layout-driven navbar rendering.
 * Handles navbar-specific functionality:
 * - Mobile hamburger menu
 * - Drawer animation
 * - Hide on scroll
 * - Responsive layout switching
 */

'use client';

import React, { useState, useEffect } from 'react';
import { HStack, VStack } from '../../components/layout';
import { IconButton } from '../../components/actions/IconButton';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import './NavbarContainer.css';

interface NavbarContainerProps {
  children: React.ReactNode;
  mobileMenu: React.ReactNode;
  menuAlign?: 'left' | 'center' | 'right';
  mobileMenuAlign?: 'left' | 'center' | 'right';
  backgroundVariant?: 'default' | 'blur' | 'solid';
  showBorder?: boolean;
  hideOnScroll?: boolean;
  drawerAnimation?: {
    type: 'fadeIn' | 'slideIn';
    settings?: {
      direction?: 'down' | 'up' | 'left' | 'right';
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
  showBorder = false,
  hideOnScroll = false,
  drawerAnimation = { type: 'fadeIn', settings: { duration: 400, stagger: 50 } }
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  // Hide on scroll logic
  useEffect(() => {
    if (!hideOnScroll) return;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsHidden(currentScrollY > lastScrollY && currentScrollY > 100);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [hideOnScroll, lastScrollY]);

  // Close mobile menu on resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  return (
    <>
      {/* Desktop/Tablet Navbar */}
      <div
        className={`navbar-container navbar-container--${backgroundVariant} ${
          showBorder ? 'navbar-container--bordered' : ''
        } ${isHidden ? 'navbar-container--hidden' : ''}`}
      >
        <HStack
          spacing="md"
          align="center"
          justify="between"
          className="navbar-container__content"
        >
          {/* Desktop Content */}
          <div className="navbar-container__desktop">
            {children}
          </div>

          {/* Mobile Hamburger */}
          <IconButton
            icon={<Bars3Icon />}
            variant="ghost"
            size="md"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="navbar-container__hamburger"
            aria-label="Toggle menu"
          />
        </HStack>
      </div>

      {/* Mobile Drawer Menu */}
      {isMobileMenuOpen && (
        <>
          <div
            className={`navbar-drawer navbar-drawer--${drawerAnimation.type} navbar-drawer--align-${mobileMenuAlign}`}
            style={{
              animationDuration: `${drawerAnimation.settings?.duration || 400}ms`,
            }}
          >
            <div className="navbar-drawer__header">
              <IconButton
                icon={<XMarkIcon />}
                variant="ghost"
                size="md"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close menu"
              />
            </div>
            
            <div className="navbar-drawer__content">
              {mobileMenu}
            </div>
          </div>

          {/* Overlay */}
          <div
            className="navbar-drawer__overlay"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        </>
      )}
    </>
  );
};
