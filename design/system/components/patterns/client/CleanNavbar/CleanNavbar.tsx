'use client';

import React, { useEffect, useState } from 'react';
import { Button } from '../../../../../system/components/primitives/Button';
import { Typography } from '../../../../../system/components/primitives/Typography';
import { Icon } from '../../../../../system/components/primitives/Icon';
import { Container } from '../../../../../system/layout/frames/container';
import { Section } from '../../../../../system/layout/frames/section';
import { Bars3Icon } from '@heroicons/react/24/outline';
import './CleanNavbar.css';

export interface NavItem {
  href: string;
  label: string;
  isActive?: boolean;
}

export interface BrandConfig {
  /** Antingen textnamn ... */
  name?: string;
  /** ... eller logobild */
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
  /** max bredd på innerspår (default 1400px) */
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
    <Section
      as="nav"
      position="fixed"
      className={[
        'clean-navbar',
        elevated ? 'clean-navbar--elevated' : '',
        className,
      ].join(' ')}
      style={{ top: 0, left: 0, right: 0, zIndex: 1000 }}
      data-clean-navbar
    >
      <Container
        maxWidth="xl"
        align="center"
        className="clean-navbar__inner"
      >
        {/* Brand */}
        <a
          className="clean-navbar__brand"
          href={brand.href || '/'}
          onClick={(e) => {
            if (brand.href?.startsWith('#')) {
              e.preventDefault();
              go(brand.href);
            }
          }}
          aria-label={brand.name || brand.logoAlt || 'Hem'}
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
              variant="label-md"
              color="primary"
              weight="bold"
              className="brand-text"
            >
              {brand.name || 'Företag'}
            </Typography>
          )}
        </a>

        {/* Links (desktop) */}
        <div className="clean-navbar__links" role="navigation" aria-label="Huvudmeny">
          {items.map((it) => (
            <a
              key={it.href + it.label}
              href={it.href}
              className={`clean-navbar__link ${it.isActive ? 'is-active' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                go(it.href);
              }}
            >
              <Typography
                variant="label-sm"
                color={it.isActive ? "primary" : "secondary"}
                weight="medium"
              >
                {it.label}
              </Typography>
            </a>
          ))}
        </div>

        {/* CTA (desktop) */}
        {ctaButton && (
          <div className="clean-navbar__cta">
            <Button
              variant={ctaButton.variant || 'accent'}
              size="md"
              onClick={() => go(ctaButton.href)}
            >
              {ctaButton.text}
            </Button>
          </div>
        )}

        {/* Hamburger */}
        <Button
          variant="ghost"
          size="sm"
          className="clean-navbar__toggle"
          aria-label="Öppna meny"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
        >
          <Icon size="md" color="primary">
            <Bars3Icon />
          </Icon>
        </Button>
      </Container>

      {/* Mobile panel */}
      <div
        className={`clean-navbar__mobile ${mobileOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="false"
      >
        <Container
          maxWidth="xl"
          align="center"
          className="clean-navbar__mobile-inner"
        >
          <div className="clean-navbar__mobile-links">
            {items.map((it) => (
              <a
                key={'m-' + it.href + it.label}
                href={it.href}
                className="clean-navbar__mobile-link"
                onClick={(e) => {
                  e.preventDefault();
                  setMobileOpen(false);
                  go(it.href);
                }}
              >
                <Typography
                  variant="body-md"
                  color={it.isActive ? "primary" : "secondary"}
                  weight="medium"
                >
                  {it.label}
                </Typography>
              </a>
            ))}
          </div>

          {ctaButton && (
            <Button
              variant={ctaButton.variant || 'accent'}
              size="md"
              className="clean-navbar__cta-button--mobile"
              onClick={() => {
                setMobileOpen(false);
                go(ctaButton.href);
              }}
            >
              {ctaButton.text}
            </Button>
          )}
        </Container>
      </div>
    </Section>
  );
};

export default CleanNavbar;
