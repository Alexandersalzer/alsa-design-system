'use client';

import React, { useEffect, useState } from 'react';
import { Typography } from '../../../../../system/components/primitives/Typography';
import { Button } from '../../../../../system/components/primitives/Button';
import { TextLink } from '../../../../../system/components/primitives/TextLink';
import { Section } from '../../../../../system/layout/frames/section/Section';
import { Container } from '../../../../../system/layout/frames/container/Container';
import { Icon } from '../../../../../system/components/primitives/Icon';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

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
  maxWidth = '1200px',
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [elevated, setElevated] = useState(false);

  useEffect(() => {
    const onScroll = () => setElevated(window.scrollY > 4);
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
      className={className}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        backgroundColor: elevated
          ? 'var(--surface-card)'
          : 'rgba(16, 16, 16, 0.85)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid var(--border-subtle)',
        boxShadow: elevated ? '0 4px 12px rgba(0,0,0,0.15)' : 'none',
        transition: 'all 0.3s ease',
      }}
    >
      <Container
        maxWidth={maxWidth === '1000px' ? 'xl' : maxWidth as any}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 'var(--foundation-space-8)',
          flexWrap: 'wrap',
        }}
      >
        {/* Brand */}
        <TextLink
          href={brand.href || '/'}
          underline="none"
          onClick={(e) => {
            if (brand.href?.startsWith('#')) {
              e.preventDefault();
              go(brand.href);
            }
          }}
          style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
        >
          {brand.logoSrc ? (
            <img
              src={brand.logoSrc}
              alt={brand.logoAlt || brand.name || 'Logo'}
              width={brand.width || 32}
              height={brand.height || 32}
              style={{ height: '32px', width: 'auto', borderRadius: '6px' }}
            />
          ) : (
            <Typography variant="body-lg" weight="bold" color="heading">
              {brand.name || 'Företag'}
            </Typography>
          )}
        </TextLink>

        {/* Links – desktop */}
        <ul className="desktop-nav">
          {items.map((it) => (
            <li key={it.href + it.label}>
              <TextLink
                href={it.href}
                variant={it.isActive ? 'accent' : 'secondary'}
                size="md"
                weight="medium"
                underline="hover"
                onClick={(e) => {
                  e.preventDefault();
                  go(it.href);
                }}
              >
                {it.label}
              </TextLink>
            </li>
          ))}
        </ul>

        {/* CTA – desktop */}
        {ctaButton && (
          <div className="desktop-nav">
            <Button
              variant={ctaButton.variant || 'accent'}
              size="md"
              onClick={() => go(ctaButton.href)}
            >
              {ctaButton.text}
            </Button>
          </div>
        )}

        {/* Mobile toggle */}
        <button
          className="mobile-toggle"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? 'Stäng meny' : 'Öppna meny'}
        >
          <Icon>{mobileOpen ? <XMarkIcon /> : <Bars3Icon />}</Icon>
        </button>
      </Container>

      {/* Mobile panel */}
      {mobileOpen && (
        <div className="mobile-nav">
          <ul>
            {items.map((it) => (
              <li key={'m-' + it.href + it.label}>
                <TextLink
                  href={it.href}
                  size="lg"
                  weight="medium"
                  underline="none"
                  onClick={(e) => {
                    e.preventDefault();
                    setMobileOpen(false);
                    go(it.href);
                  }}
                >
                  {it.label}
                </TextLink>
              </li>
            ))}
          </ul>

          {ctaButton && (
            <Button
              variant={ctaButton.variant || 'accent'}
              size="lg"
              onClick={() => {
                setMobileOpen(false);
                go(ctaButton.href);
              }}
              style={{ width: '100%', marginTop: '1rem' }}
            >
              {ctaButton.text}
            </Button>
          )}
        </div>
      )}

      <style>{`
        .desktop-nav {
          display: flex;
          gap: 1.25rem;
          align-items: center;
        }
        .desktop-nav ul {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          gap: 1.25rem;
        }
        .desktop-nav li {
          margin: 0;
        }
        .mobile-toggle {
          display: none;
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 6px;
          color: var(--text-primary);
        }
        .mobile-nav {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          background: var(--surface-card);
          padding: 1rem;
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          border-bottom: 1px solid var(--border-subtle);
        }
        .mobile-nav ul {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        @media (max-width: 768px) {
          .desktop-nav {
            display: none;
          }
          .mobile-toggle {
            display: inline-flex;
          }
        }
      `}</style>
    </Section>
  );
};

export default CleanNavbar;