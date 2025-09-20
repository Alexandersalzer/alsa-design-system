'use client';

import React, { useEffect, useState } from 'react';
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
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);
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

  // Fallback styles for SSR
  const fallbackStyles = {
    position: 'fixed' as const,
    top: '0',
    left: '50%',
    transform: 'translateX(-50%)',
    width,
    maxWidth,
    zIndex: 1000,
    background,
    backdropFilter: blur ? 'blur(10px)' : 'none',
    borderBottom: '1px solid var(--border-subtle)',
    borderRadius,
    padding,
    overflow: 'hidden'
  };

  return (
    <nav 
      className={isClient ? `clean-navbar ${className}` : className}
      style={isClient ? {
        width,
        maxWidth,
        background,
        backdropFilter: blur ? 'blur(10px)' : 'none',
        borderRadius,
        padding
      } : fallbackStyles}
    >
      <Container 
        maxWidth="lg" 
        className={isClient ? "clean-navbar__container" : undefined}
        style={!isClient ? {
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '0 2rem',
          width: '100%',
          maxWidth: '1400px',
          margin: '0 auto',
          position: 'relative'
        } : undefined}
      >
        {/* Logo - Left Side */}
        <div 
          className={isClient ? "clean-navbar__logo" : undefined}
          style={!isClient ? { flex: '0 0 auto' } : undefined}
        >
          {logo?.src ? (
            <img 
              src={logo.src}
              alt={logo.alt || 'Logo'}
              width={logo.width || 40}
              height={logo.height || 40}
              style={!isClient ? { objectFit: 'contain', cursor: 'pointer' } : undefined}
            />
          ) : (
            <div 
              className={isClient ? "clean-navbar__logo-placeholder" : undefined}
              style={{
                width: logo?.width || 40,
                height: logo?.height || 40,
                ...(!isClient && {
                  background: 'linear-gradient(135deg, var(--accent-500), var(--accent-400))',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                })
              }}
            >
              <Typography variant="body-md" weight="bold" color="inverse">
                {logo?.alt || 'LOGO'}
              </Typography>
            </div>
          )}
        </div>

        {/* Navigation Links - Center */}
        <div 
          className={isClient ? "clean-navbar__links" : undefined}
          style={!isClient ? {
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '2rem',
            flex: '1'
          } : undefined}
        >
          {items.map((item, index) => (
            <a 
              key={index}
              href={item.href} 
              onClick={(e) => {
                e.preventDefault();
                handleItemClick(item);
              }}
              className={isClient ? `clean-navbar__link ${item.isActive ? 'clean-navbar__link--active' : ''}` : undefined}
              style={!isClient ? {
                color: 'var(--text-primary)',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: '500',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                transition: 'all 0.2s ease',
                position: 'relative',
                opacity: item.isActive ? 1 : 0.8
              } : undefined}
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* CTA Button - Right Side */}
        <div 
          className={isClient ? "clean-navbar__cta" : undefined}
          style={!isClient ? { flex: '0 0 auto' } : undefined}
        >
          {ctaButton && (
            <button
              onClick={() => handleCtaClick(ctaButton.href)}
              className={isClient ? `clean-navbar__cta-button clean-navbar__cta-button--${ctaButton.variant || 'primary'}` : undefined}
              style={!isClient ? {
                background: ctaButton.variant === 'accent' ? 'var(--accent-500)' : 
                           ctaButton.variant === 'secondary' ? 'var(--surface-card-hover)' :
                           'var(--primary-500)',
                color: ctaButton.variant === 'accent' ? 'white' : 'var(--text-primary)',
                border: ctaButton.variant === 'secondary' ? '1px solid var(--border-default)' : 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                fontSize: '0.875rem',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                outline: 'none'
              } : undefined}
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
