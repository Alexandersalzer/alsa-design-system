'use client';

import React, { useState } from 'react';
import { Typography } from '../../../primitives/Typography';
import './CleanNavbar.css';

export interface CleanNavbarProps {
  items?: Array<{ href: string; label: string; isActive?: boolean }>;
  logo?: { text?: string; src?: string; alt?: string; width?: number; height?: number };
  ctaButton?: { text: string; href: string; variant?: 'primary' | 'secondary' | 'accent' };
  className?: string;
  onItemClick?: (item: { href: string; label: string }) => void;
  onCtaClick?: (href: string) => void;
}

const CleanNavbar = ({
  items = [],
  logo = { text: 'Företag' },
  ctaButton,
  className = '',
  onItemClick,
  onCtaClick
}: CleanNavbarProps) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const smoothNav = (href: string) => {
    if (href.startsWith('#')) {
      const el = document.querySelector(href);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = href;
    }
  };

  const handleItemClick = (item: { href: string; label: string }) => {
    smoothNav(item.href);
    onItemClick?.(item);
    setMobileOpen(false);
  };

  const handleCtaClick = (href: string) => {
    smoothNav(href);
    onCtaClick?.(href);
    setMobileOpen(false);
  };

  return (
    <nav className={`clean-navbar ${className}`}>
      <div className="clean-navbar__inner">
        {/* Vänster: Logo */}
        <div className="clean-navbar__left">
          <div className="clean-navbar__logo">
            {logo?.src ? (
              <img
                src={logo.src}
                alt={logo.alt || 'Logo'}
                width={logo.width || 40}
                height={logo.height || 40}
              />
            ) : (
              <Typography variant="body-lg" weight="bold" color="primary" style={{ margin: 0 }}>
                {logo.text || logo.alt || 'Företag'}
              </Typography>
            )}
          </div>
        </div>

        {/* Mitten: Länkar (centreras absolut via grid) */}
        <div className="clean-navbar__center">
          <div className="clean-navbar__links">
            {items.map((item, idx) => (
              <a
                key={idx}
                href={item.href}
                onClick={(e) => { e.preventDefault(); handleItemClick(item); }}
                className={`clean-navbar__link ${item.isActive ? 'active' : ''}`}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>

        {/* Höger: CTA (desktop) + Hamburger (mobil) */}
        <div className="clean-navbar__right">
          {ctaButton && (
            <button
              onClick={() => handleCtaClick(ctaButton.href)}
              className={`clean-navbar__cta-button clean-navbar__cta-button--${ctaButton.variant || 'primary'}`}
            >
              {ctaButton.text}
            </button>
          )}

          <button
            className="clean-navbar__toggle"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Öppna meny"
          >
            {mobileOpen ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobilmeny (glider ner under navbar) */}
      <div className={`clean-navbar__mobile ${mobileOpen ? 'open' : ''}`}>
        {items.map((item, idx) => (
          <a
            key={idx}
            href={item.href}
            onClick={(e) => { e.preventDefault(); handleItemClick(item); }}
            className="clean-navbar__mobile-link"
          >
            {item.label}
          </a>
        ))}
        {ctaButton && (
          <button
            onClick={() => handleCtaClick(ctaButton.href)}
            className={`clean-navbar__cta-button clean-navbar__cta-button--${ctaButton.variant || 'primary'}`}
          >
            {ctaButton.text}
          </button>
        )}
      </div>
    </nav>
  );
};

export { CleanNavbar };
export default CleanNavbar;
