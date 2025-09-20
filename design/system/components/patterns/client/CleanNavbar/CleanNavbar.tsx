'use client';

import React from 'react';
import { Container } from '../../../../layout/frames/container';
import { Typography } from '../../../primitives/Typography';
import './CleanNavbar.css';

export interface CleanNavbarProps {
  /** Navigation items */
  items?: Array<{
    href: string;
    label: string;
    isActive?: boolean;
  }>;
  /** Logo configuration */
  logo?: {
    src?: string;
    alt?: string;
    width?: number;
    height?: number;
  };
  /** CTA button configuration */
  ctaButton?: {
    text: string;
    href: string;
    variant?: 'primary' | 'secondary' | 'accent';
  };
  /** Custom className for the navbar */
  className?: string;
  /** Background color - defaults to surface-card */
  background?: string;
  /** Whether to show blur effect */
  blur?: boolean;
  /** Border radius - defaults to 0 0 12px 12px */
  borderRadius?: string;
  /** Padding - defaults to 1.75rem 0 */
  padding?: string;
  /** Width - defaults to 95% */
  width?: string;
  /** Max width - defaults to 1400px */
  maxWidth?: string;
  /** Click handler for navigation items */
  onItemClick?: (item: { href: string; label: string }) => void;
  /** Click handler for CTA button */
  onCtaClick?: (href: string) => void;
}

export const CleanNavbar = ({
  items = [],
  logo,
  ctaButton,
  className = '',
  background = 'var(--surface-card)',
  blur = true,
  borderRadius = '0 0 12px 12px',
  padding = '1.75rem 0',
  width = '95%',
  maxWidth = '1400px',
  onItemClick,
  onCtaClick
}: CleanNavbarProps) => {
  const handleItemClick = (item: { href: string; label: string }) => {
    if (item.href.startsWith('#')) {
      // Smooth scroll to section
      const element = document.querySelector(item.href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Regular navigation
      window.location.href = item.href;
    }
    onItemClick?.(item);
  };

  const handleCtaClick = (href: string) => {
    if (href.startsWith('#')) {
      // Smooth scroll to section
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // Regular navigation
      window.location.href = href;
    }
    onCtaClick?.(href);
  };

  return (
    <nav 
      className={`clean-navbar ${className}`}
      style={{
        width,
        maxWidth,
        background,
        backdropFilter: blur ? 'blur(10px)' : 'none',
        borderRadius,
        padding
      }}
    >
      <Container maxWidth="lg" className="clean-navbar__container">
        {/* Logo - Left Side */}
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
              style={{
                width: logo?.width || 40,
                height: logo?.height || 40
              }}
            >
              <Typography variant="body-md" weight="bold" color="inverse">
                {logo?.alt || 'LOGO'}
              </Typography>
            </div>
          )}
        </div>

        {/* Navigation Links - Center */}
        <div className="clean-navbar__links">
          {items.map((item, index) => (
            <a 
              key={index}
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

        {/* CTA Button - Right Side */}
        <div className="clean-navbar__cta">
          {ctaButton && (
            <button
              onClick={() => handleCtaClick(ctaButton.href)}
              className={`clean-navbar__cta-button clean-navbar__cta-button--${ctaButton.variant || 'primary'}`}
            >
              {ctaButton.text}
            </button>
          )}
        </div>
      </Container>
    </nav>
  );
};

export default CleanNavbar;
