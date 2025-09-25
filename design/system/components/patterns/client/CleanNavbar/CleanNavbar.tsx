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
            background: rgba(0, 0, 0, 0.85);
            backdrop-filter: blur(20px);
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .navbar--elevated {
            background: rgba(0, 0, 0, 0.95);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
          }
          .navbar-mobile {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.95);
            backdrop-filter: blur(20px);
            z-index: 1001;
            transform: translateX(-100%);
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            overflow-y: auto;
            opacity: 0;
            visibility: hidden;
          }
          .navbar-mobile.open {
            transform: translateX(0);
            opacity: 1;
            visibility: visible;
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), 
                       opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1),
                       visibility 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .hamburger {
            display: flex;
            flex-direction: column;
            gap: 4px;
            background: none;
            border: none;
            cursor: pointer;
            padding: 8px;
            transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .hamburger:hover {
            transform: scale(1.1);
          }
          .hamburger span {
            width: 24px;
            height: 2px;
            background: var(--primary-white);
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            transform-origin: center;
          }
          .nav-link {
            color: var(--primary-white) !important;
            text-decoration: none;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            position: relative;
          }
          .nav-link * {
            color: var(--primary-white) !important;
          }
          .nav-link:hover {
            color: #64748b !important;
            text-decoration: underline;
            text-decoration-color: #64748b;
            text-underline-offset: 4px;
            text-decoration-thickness: 1px;
          }
          .nav-link:hover * {
            color: #64748b !important;
          }
          .nav-link.active {
            color: var(--accent-500) !important;
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
          maxWidth: '1400px',
          margin: '0 auto',
          padding: '0 var(--foundation-space-6)',
          minHeight: '64px',
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
              className="nav-link"
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
                <Typography variant="h4" weight="bold" color="inverse" style={{ color: 'var(--primary-white)' }}>
                  {brand.name || 'Företag'}
                </Typography>
              )}
            </a>

            {/* Links (desktop) */}
            <div style={{ 
              display: 'none',
              gap: 'var(--foundation-space-6)',
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
                  <Typography variant="body-md" color="inverse" weight={it.isActive ? 'semibold' : 'regular'}>
                    {it.label}
                  </Typography>
                </a>
              ))}
            </div>

            {/* CTA (desktop) */}
            {ctaButton && (
              <div style={{ display: 'none' }} className="desktop-cta">
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => go(ctaButton.href)}
                  style={{
                    background: 'linear-gradient(135deg, #64748b, #475569)',
                    color: 'var(--primary-white)',
                    fontWeight: '600',
                    fontSize: '1rem',
                    border: 'none'
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
            maxWidth: '1400px',
            margin: '0 auto',
            padding: '80px var(--foundation-space-6) var(--foundation-space-8)',
            transform: mobileOpen ? 'translateY(0)' : 'translateY(20px)',
            opacity: mobileOpen ? 1 : 0,
            transition: 'transform 0.3s cubic-bezier(0.4, 0, 0.2, 1) 0.1s, opacity 0.3s cubic-bezier(0.4, 0, 0.2, 1) 0.1s'
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
                variant="secondary"
                size="lg"
                onClick={() => {
                  setMobileOpen(false);
                  go(ctaButton.href);
                }}
                style={{ 
                  width: '100%',
                  background: 'linear-gradient(135deg, #64748b, #475569)',
                  color: 'var(--primary-white)',
                  fontWeight: '600',
                  fontSize: '1.1rem',
                  border: 'none'
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
