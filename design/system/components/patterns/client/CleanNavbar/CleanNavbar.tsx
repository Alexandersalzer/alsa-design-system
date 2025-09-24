'use client';

import React, { useEffect, useState } from 'react';
import { Typography } from '../../../../../system/components/primitives/Typography';
import { Button } from '../../../../../system/components/primitives/Button';
import { Container } from '../../../../../system/layout/frames/container/Container';
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
            background: var(--surface-page);
            border-bottom: 1px solid var(--border-subtle);
            transition: all var(--foundation-duration-fast) var(--foundation-easing-ease-out);
          }
          .navbar--elevated {
            background: var(--surface-page);
            box-shadow: var(--foundation-shadow-lg);
          }
          .navbar-mobile {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: var(--surface-page);
            z-index: 1001;
            transform: translateX(-100%);
            transition: transform var(--foundation-duration-normal) var(--foundation-easing-ease-out);
          }
          .navbar-mobile.open {
            transform: translateX(0);
          }
          .hamburger {
            display: flex;
            flex-direction: column;
            gap: 4px;
            background: none;
            border: none;
            cursor: pointer;
            padding: 8px;
          }
          .hamburger span {
            width: 24px;
            height: 2px;
            background: var(--text-primary);
            transition: all var(--foundation-duration-fast) var(--foundation-easing-ease-out);
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
        <Container maxWidth="xl" align="center">
          <div style={{ 
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
                <Typography variant="h4" weight="bold" color="heading">
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
                  style={{
                    textDecoration: 'none',
                    color: it.isActive ? 'var(--accent-500)' : 'var(--text-primary)',
                    fontWeight: it.isActive ? '600' : '400'
                  }}
                >
                  <Typography variant="body-md" color={it.isActive ? 'accent' : 'primary'}>
                    {it.label}
                  </Typography>
                </a>
              ))}
            </div>

            {/* CTA (desktop) */}
            {ctaButton && (
              <div style={{ display: 'none' }} className="desktop-cta">
                <Button
                  variant={ctaButton.variant || 'accent'}
                  size="sm"
                  onClick={() => go(ctaButton.href)}
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
        </Container>
      </nav>

      {/* Mobile panel */}
      <div
        className={`navbar-mobile ${mobileOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="true"
      >
        <Container maxWidth="xl" align="center">
          <div style={{ paddingTop: '80px', paddingBottom: 'var(--foundation-space-8)' }}>
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
                  style={{
                    textDecoration: 'none',
                    color: it.isActive ? 'var(--accent-500)' : 'var(--text-primary)',
                    fontWeight: it.isActive ? '600' : '400'
                  }}
                >
                  <Typography variant="body-lg" color={it.isActive ? 'accent' : 'primary'}>
                    {it.label}
                  </Typography>
                </a>
              ))}
            </Stack>

            {/* Mobile CTA */}
            {ctaButton && (
              <Button
                variant={ctaButton.variant || 'accent'}
                size="lg"
                onClick={() => {
                  setMobileOpen(false);
                  go(ctaButton.href);
                }}
                style={{ width: '100%' }}
              >
                {ctaButton.text}
              </Button>
            )}
            </Stack>
          </div>
        </Container>
      </div>
    </>
  );
};

export default CleanNavbar;
