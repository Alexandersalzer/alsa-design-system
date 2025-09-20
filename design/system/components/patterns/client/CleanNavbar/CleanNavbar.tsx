'use client';

import React, { useEffect, useState } from 'react';
import { Container } from '../../../../layout/frames/container';
import { Typography } from '../../../primitives/Typography';
import './CleanNavbar.css';

export interface CleanNavbarProps {
  items?: Array<{ href: string; label: string; isActive?: boolean }>;
  logo?: { src?: string; alt?: string; width?: number; height?: number };
  ctaButton?: { text: string; href: string; variant?: 'primary' | 'secondary' | 'accent' };
  className?: string;
  background?: string;
  blur?: boolean;
  borderRadius?: string;
  padding?: string;
  width?: string;
  maxWidth?: string;
  onItemClick?: (item: { href: string; label: string }) => void;
  onCtaClick?: (href: string) => void;
}

const CleanNavbar = ({
  items = [],
  logo,
  ctaButton,
  className = '',
  background = 'var(--surface-card)',
  blur = true,
  borderRadius = '0 0 12px 12px',
  padding = '0.75rem 1rem',
  width = '95%',
  maxWidth = '1400px',
  onItemClick,
  onCtaClick
}: CleanNavbarProps) => {
  const [isClient, setIsClient] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => { setIsClient(true); }, []);

  const handleItemClick = (item: { href: string; label: string }) => {
    if (item.href.startsWith('#')) {
      const element = document.querySelector(item.href);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = item.href;
    }
    onItemClick?.(item);
    setMobileOpen(false);
  };

  const handleCtaClick = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) element.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.location.href = href;
    }
    onCtaClick?.(href);
    setMobileOpen(false);
  };

  return (
    <nav
      className={`clean-navbar ${className}`}
      style={{
        width,
        maxWidth,
        background,
        backdropFilter: blur ? 'blur(12px)' : 'none',
        borderRadius,
        padding
      }}
    >
      <Container maxWidth="lg" className="clean-navbar__container">
        {/* Logo */}
        <div className="clean-navbar__logo">
          {logo?.src ? (
            <img
              src={logo.src}
              alt={logo.alt || 'Logo'}
              width={logo.width || 40}
              height={logo.height || 40}
            />
          ) : (
            <div
              className="clean-navbar__logo-placeholder"
              style={{ width: logo?.width || 40, height: logo?.height || 40 }}
            >
              <Typography variant="body-md" weight="bold" color="inverse">
                {logo?.alt || 'LOGO'}
              </Typography>
            </div>
          )}
        </div>

        {/* Links */}
        <div className="clean-navbar__links">
          {items.map((item, idx) => (
            <a
              key={idx}
              href={item.href}
              onClick={(e) => { e.preventDefault(); handleItemClick(item); }}
              className={`clean-navbar__link ${item.isActive ? 'clean-navbar__link--active' : ''}`}
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* CTA */}
        {ctaButton && (
          <div className="clean-navbar__cta">
            <button
              onClick={() => handleCtaClick(ctaButton.href)}
              className={`clean-navbar__cta-button clean-navbar__cta-button--${ctaButton.variant || 'primary'}`}
            >
              {ctaButton.text}
            </button>
          </div>
        )}

        {/* Mobile toggle */}
        <button
          className="clean-navbar__toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? "✕" : "☰"}
        </button>
      </Container>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="clean-navbar__mobile-menu">
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
              style={{ width: '100%', marginTop: '1rem' }}
            >
              {ctaButton.text}
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default CleanNavbar;
