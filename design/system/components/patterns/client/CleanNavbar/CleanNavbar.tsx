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
}

export const CleanNavbar = ({
  items = [],
  className = '',
  background = 'var(--surface-card)',
  blur = true,
  borderRadius = '0 0 12px 12px',
  padding = '1.75rem 0',
  width = '95%',
  maxWidth = '1400px',
  onItemClick
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
        justifyContent: 'center', 
        alignItems: 'center',
        padding: '0 2rem',
        width: '100%',
        maxWidth: '1400px',
        margin: '0 auto',
        position: 'relative'
      }}>
        {/* Navigation Links - Centered */}
        <div 
          className="navbar-links"
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            gap: '2rem',
            width: '100%'
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
      </Container>
    </nav>
  );
};

export default CleanNavbar;
