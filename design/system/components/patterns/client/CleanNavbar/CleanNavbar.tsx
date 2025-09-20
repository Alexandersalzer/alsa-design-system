'use client';

import React from 'react';
import { Container } from '../../../../layout/frames/container';
import { Typography } from '../../../primitives/Typography';

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
      style={{
        position: 'fixed',
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
      }}
      className={className}
    >
      <Container maxWidth="lg" style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        padding: '0 2rem',
        width: '100%',
        maxWidth: '1400px',
        margin: '0 auto',
        position: 'relative'
      }}>
        {/* Logo - Left Side */}
        <div style={{ flex: '0 0 auto' }}>
          {logo?.src ? (
            <img 
              src={logo.src}
              alt={logo.alt || 'Logo'}
              width={logo.width || 40}
              height={logo.height || 40}
              style={{
                objectFit: 'contain',
                cursor: 'pointer'
              }}
            />
          ) : (
            <div 
              style={{
                width: logo?.width || 40,
                height: logo?.height || 40,
                background: 'linear-gradient(135deg, var(--accent-500), var(--accent-400))',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer'
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
          className="navbar-links"
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            gap: '2rem',
            flex: '1'
          }}
        >
          {items.map((item, index) => (
            <a 
              key={index}
              href={item.href} 
              onClick={(e) => {
                e.preventDefault();
                handleItemClick(item);
              }}
              style={{ 
                color: 'var(--text-primary)', 
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: '500',
                padding: '0.5rem 1rem',
                borderRadius: '8px',
                transition: 'all 0.2s ease',
                position: 'relative',
                opacity: item.isActive ? 1 : 0.8
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#ffffff';
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                e.currentTarget.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = 'var(--text-primary)';
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* CTA Button - Right Side */}
        <div style={{ flex: '0 0 auto' }}>
          {ctaButton && (
            <button
              onClick={() => handleCtaClick(ctaButton.href)}
              style={{
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
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
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
