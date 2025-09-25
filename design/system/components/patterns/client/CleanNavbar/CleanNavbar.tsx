'use client';

import React, { useEffect, useState } from 'react';
import { Typography } from '../../../../../system/components/primitives/Typography';
import { Button } from '../../../../../system/components/primitives/Button';
import { Cluster } from '../../../../../system/layout/utilities/cluster/Cluster';
import { Stack } from '../../../../../system/layout/utilities/stack/Stack';

export interface NavItem {
  href: string;
  label: string;
  isActive?: boolean;
}

export interface BrandConfig {
  name?: string;
  logoSrc?: string;
  logoAlt?: string;
  href?: string;
  width?: number;
  height?: number;
}

export interface CtaConfig {
  text: string;
  href: string;
  variant?: 'primary' | 'secondary' | 'accent';
}

export interface CleanNavbarProps {
  items?: NavItem[];
  brand?: BrandConfig;
  ctaButton?: CtaConfig;
  className?: string;
  maxWidth?: string;
}

const CleanNavbar: React.FC<CleanNavbarProps> = ({
  items = [],
  brand = { name: 'Företag', href: '/' },
  ctaButton,
  className = '',
  maxWidth = '1400px',
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [elevated, setElevated] = useState(false);

  useEffect(() => {
    const onScroll = () => setElevated(window.scrollY > 4);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const go = (href: string) => {
    if (href.startsWith('#')) {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = href;
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          .navbar {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 1000;
            background: rgba(0, 0, 0, 0.8);
            backdrop-filter: blur(24px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.08);
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .navbar--elevated {
            background: rgba(0, 0, 0, 0.9);
            box-shadow: 0 4px 24px rgba(0, 0, 0, 0.4);
            border-bottom: 1px solid rgba(255, 255, 255, 0.12);
          }
          .navbar-mobile {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.95);
            backdrop-filter: blur(24px);
            z-index: 1001;
            transform: translateX(-100%);
            transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            overflow-y: auto;
            opacity: 0;
            visibility: hidden;
          }
          .navbar-mobile.open {
            transform: translateX(0);
            opacity: 1;
            visibility: visible;
            transition: transform 0.4s cubic-bezier(0.4, 0, 0.2, 1), 
                       opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1),
                       visibility 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .hamburger {
            display: flex;
            flex-direction: column;
            gap: 5px;
            background: none;
            border: none;
            cursor: pointer;
            padding: 12px;
            border-radius: 8px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .hamburger:hover {
            background: rgba(255, 255, 255, 0.1);
            transform: scale(1.05);
          }
          .hamburger span {
            width: 26px;
            height: 3px;
            background: var(--primary-white);
            border-radius: 2px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            transform-origin: center;
          }
          .nav-link {
            color: var(--primary-white) !important;
            text-decoration: none;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
            padding: 8px 16px;
            border-radius: 8px;
            font-weight: 500;
          }
          .nav-link * {
            color: var(--primary-white) !important;
          }
          .nav-link:hover {
            color: var(--primary-white) !important;
            background: rgba(255, 255, 255, 0.1);
            transform: translateY(-1px);
          }
          .nav-link:hover * {
            color: var(--primary-white) !important;
          }
          .nav-link.active {
            color: var(--accent-500) !important;
            background: rgba(99, 102, 241, 0.1);
          }
          .nav-link.active * {
            color: var(--accent-500) !important;
          }
          @media (min-width: 769px) {
            .navbar-mobile {
              display: none;
            }
            .hamburger {
              display: none;
            }
            .desktop-links {
              display: flex !important;
              flex-direction: row;
            }
            .desktop-cta {
              display: block !important;
            }
          }
        `
      }} />
      <nav
        className={`navbar ${elevated ? 'navbar--elevated' : ''} ${className}`}
        role="navigation"
        aria-label="Huvudnavigation"
      >
        <div style={{ 
          maxWidth: '1200px',
          margin: '0 auto',
          padding: 'var(--foundation-space-5) var(--foundation-space-8)',
          minHeight: '88px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          width: '100%'
        }}>
            {/* Brand */}
            <a
              href={brand.href || '/'}
              onClick={(e) => {
                if (brand.href?.startsWith('#')) {
                  e.preventDefault();
                  go(brand.href);
                }
              }}
              aria-label={brand.name || brand.logoAlt || 'Hem'}
              style={{ textDecoration: 'none' }}
            >
              {brand.logoSrc ? (
                <img
                  src={brand.logoSrc}
                  alt={brand.logoAlt || brand.name || 'Logo'}
                  width={brand.width || 28}
                  height={brand.height || 28}
                  loading="eager"
                  decoding="sync"
                />
              ) : (
                <Typography 
                  variant="h3" 
                  weight="bold" 
                  color="inverse"
                  style={{ 
                    color: 'var(--primary-white)', 
                    fontSize: '1.75rem',
                    letterSpacing: '-0.02em',
                    lineHeight: '1.2'
                  }}
                >
                  {brand.name || 'Företag'}
                </Typography>
              )}
            </a>

            {/* Links (desktop) */}
            <div style={{ 
              display: 'none',
              gap: 'var(--foundation-space-2)',
              alignItems: 'center'
            }} className="desktop-links">
              {items.map((it) => (
                <a
                  key={it.href + it.label}
                  href={it.href}
                  onClick={(e) => {
                    e.preventDefault();
                    go(it.href);
                  }}
                  className={`nav-link ${it.isActive ? 'active' : ''}`}
                >
                  <Typography variant="body-lg" color="inverse" weight={it.isActive ? 'semibold' : 'regular'} style={{ fontSize: '1.1rem' }}>
                    {it.label}
                  </Typography>
                </a>
              ))}
            </div>

            {/* CTA (desktop) */}
            {ctaButton && (
              <div style={{ display: 'none' }} className="desktop-cta">
                <Button
                  variant="accent"
                  size="lg"
                  onClick={() => go(ctaButton.href)}
                  style={{
                    fontWeight: '600',
                    fontSize: '1rem',
                    padding: 'var(--foundation-space-3) var(--foundation-space-6)',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(99, 102, 241, 0.3)',
                    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                  }}
                >
                  {ctaButton.text}
                </Button>
              </div>
            )}

            {/* Hamburger */}
            <button
              className="hamburger"
              aria-label="Öppna meny"
              aria-expanded={mobileOpen}
              onClick={() => setMobileOpen((v) => !v)}
            >
              <span />
              <span />
              <span />
            </button>
        </div>
      </nav>

      {/* Mobile panel */}
      <div
        className={`navbar-mobile ${mobileOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
        onClick={(e) => {
          // Stäng menyn om man klickar på backdrop
          if (e.target === e.currentTarget) {
            setMobileOpen(false);
          }
        }}
      >
        {/* Close button - fixed position like hamburger */}
        <button
          onClick={() => setMobileOpen(false)}
          style={{
            position: 'fixed',
            top: '16px',
            right: 'var(--foundation-space-6)',
            background: 'none',
            border: 'none',
            fontSize: '24px',
            cursor: 'pointer',
            padding: '8px',
            color: 'var(--primary-white)',
            zIndex: 1002,
            transform: mobileOpen ? 'scale(1)' : 'scale(0.8)',
            opacity: mobileOpen ? 1 : 0,
            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1) 0.15s, opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1) 0.15s'
          }}
          aria-label="Stäng meny"
        >
          ×
        </button>
        
        <div 
          style={{ 
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '100px var(--foundation-space-8) var(--foundation-space-12)',
            transform: mobileOpen ? 'translateY(0)' : 'translateY(20px)',
            opacity: mobileOpen ? 1 : 0,
            transition: 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1) 0.1s, opacity 0.4s cubic-bezier(0.4, 0, 0.2, 1) 0.1s'
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <Stack spacing="lg">
            {/* Mobile Links */}
            <Stack spacing="md">
              {items.map((it) => (
                <a
                  key={'m-' + it.href + it.label}
                  href={it.href}
                  onClick={(e) => {
                    e.preventDefault();
                    setMobileOpen(false);
                    go(it.href);
                  }}
                  className={`nav-link ${it.isActive ? 'active' : ''}`}
                >
                  <Typography variant="body-lg" color="inverse" weight={it.isActive ? 'semibold' : 'regular'}>
                    {it.label}
                  </Typography>
                </a>
              ))}
            </Stack>

            {/* Mobile CTA */}
            {ctaButton && (
              <Button
                variant="accent"
                size="xl"
                onClick={() => {
                  setMobileOpen(false);
                  go(ctaButton.href);
                }}
                style={{ 
                  width: '100%',
                  fontWeight: '600',
                  fontSize: '1.1rem',
                  padding: 'var(--foundation-space-4) var(--foundation-space-8)',
                  borderRadius: '12px',
                  boxShadow: '0 6px 20px rgba(99, 102, 241, 0.4)',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
                }}
              >
                {ctaButton.text}
              </Button>
            )}
          </Stack>
        </div>
      </div>
    </>
  );
};

export default CleanNavbar;
