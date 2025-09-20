'use client';

import React, { useState } from 'react';
import { Container } from '../../../../layout/frames/container';
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
    <nav className={`clean-navbar ${className}`}>
      <Container maxWidth="lg" className="clean-navbar__container">
        {/* Logo */}
        <div className="clean-navbar__logo">
          {logo?.src ? (
            <img src={logo.src} alt={logo.alt || 'Logo'} width={logo.width || 40} height={logo.height || 40} />
          ) : (
            <Typography variant="body-lg" weight="bold" color="primary">
              {logo.text}
            </Typography>
          )}
        </div>

        {/* Links */}
        <div className="clean-navbar__links">
          {items.map((item, idx) => (
            <a
              key={idx}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                handleItemClick(item);
              }}
              className={`clean-navbar__link ${item.isActive ? 'clean-navbar__link--active' : ''}`}
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* CTA (desktop only) */}
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

        {/* Hamburger (mobile only) */}
        <button className="clean-navbar__toggle" onClick={() => setMobileOpen(!mobileOpen)}>
          ☰
        </button>
      </Container>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="clean-navbar__mobile-menu">
          {items.map((item, idx) => (
            <a
              key={idx}
              href={item.href}
              onClick={(e) => {
                e.preventDefault();
                handleItemClick(item);
              }}
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
      )}
    </nav>
  );
};

export default CleanNavbar;
