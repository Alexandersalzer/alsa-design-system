'use client';

import React, { useEffect, useState } from 'react';
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
    <nav
      className={[
        'clean-navbar',
        elevated ? 'clean-navbar--elevated' : '',
        className,
      ].join(' ')}
      data-clean-navbar
    >
      <div className="clean-navbar__inner" style={{ maxWidth }}>
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
            <span className="brand-text">{brand.name || 'Företag'}</span>
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
              {it.label}
            </a>
          ))}
        </div>

        {/* CTA (desktop) */}
        {ctaButton && (
          <div className="clean-navbar__cta">
            <button
              className={`clean-navbar__cta-button clean-navbar__cta-button--${
                ctaButton.variant || 'accent'
              }`}
              onClick={() => go(ctaButton.href)}
            >
              {ctaButton.text}
            </button>
          </div>
        )}

        {/* Hamburger */}
        <button
          className="clean-navbar__toggle"
          aria-label="Öppna meny"
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>
      </div>

      {/* Mobile panel */}
      <div
        className={`clean-navbar__mobile ${mobileOpen ? 'open' : ''}`}
        role="dialog"
        aria-modal="false"
      >
        <div className="clean-navbar__mobile-inner" style={{ maxWidth }}>
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
                {it.label}
              </a>
            ))}
          </div>

          {ctaButton && (
            <button
              className={`clean-navbar__cta-button clean-navbar__cta-button--${
                ctaButton.variant || 'accent'
              } clean-navbar__cta-button--mobile`}
              onClick={() => {
                setMobileOpen(false);
                go(ctaButton.href);
              }}
            >
              {ctaButton.text}
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default CleanNavbar;
