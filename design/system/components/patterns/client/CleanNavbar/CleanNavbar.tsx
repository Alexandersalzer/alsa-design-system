'use client';

import React, { useEffect, useState } from 'react';
import { Typography } from '../../../../../system/components/primitives/Typography';
import { Button } from '../../../../../system/components/primitives/Button';
import { TextLink } from '../../../../../system/components/primitives/TextLink';
import { Section } from '../../../../../system/layout/frames/section/Section';
import { Container } from '../../../../../system/layout/frames/container/Container';
import { Cluster } from '../../../../../system/layout/utilities/cluster/Cluster';
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
  maxWidth = '1000px',
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
        boxShadow: elevated ? '0 8px 24px rgba(0,0,0,0.22)' : 'none',
        transition: 'all 0.3s ease',
        paddingTop: 'var(--foundation-space-3)',
        paddingBottom: 'var(--foundation-space-3)',
      }}
    >
      <Container
        maxWidth="2xl"
        style={{ 
          display: 'grid', 
          gridTemplateColumns: 'auto 1fr auto',
          alignItems: 'center',
          columnGap: 'var(--foundation-space-8)'
        }}
      >
          {/* Left - Brand */}
          <div style={{ flexShrink: 0 }}>
            <TextLink
              href={brand.href || '/'}
              variant="brand"
              size="lg"
              weight="bold"
              underline="none"
              onClick={(e) => {
                if (brand.href?.startsWith('#')) {
                  e.preventDefault();
                  go(brand.href);
                }
              }}
            >
            {brand.logoSrc ? (
              <img
                src={brand.logoSrc}
                alt={brand.logoAlt || brand.name || 'Logo'}
                width={brand.width || 32}
                height={brand.height || 32}
                loading="eager"
                decoding="sync"
                style={{
                  display: 'block',
                  width: 'auto',
                  height: '32px',
                  borderRadius: '6px',
                }}
              />
            ) : (
              <Typography variant="body-lg" weight="bold" color="heading">
                {brand.name || 'Företag'}
              </Typography>
              )}
            </TextLink>
          </div>

          {/* Center - Links (desktop) */}
          <div className="desktop-only" style={{ justifySelf: 'center' }}>
            <Cluster
              spacing="lg"
              justify="center"
            >
              {items.map((it) => (
                <TextLink
                  key={it.href + it.label}
                  href={it.href}
                  variant={it.isActive ? 'accent' : 'secondary'}
                  size="md"
                  weight="medium"
                  underline="hover"
                  onClick={(e) => {
                    e.preventDefault();
                    go(it.href);
                  }}
                  style={{
                    padding: 'var(--foundation-space-3) var(--foundation-space-4)',
                    borderRadius: '8px',
                    transition: 'all 0.2s ease',
                  }}
                >
                  {it.label}
                </TextLink>
              ))}
            </Cluster>
          </div>

          {/* Right - CTA (desktop) */}
          {ctaButton && (
            <div className="desktop-only" style={{ justifySelf: 'end', flexShrink: 0 }}>
              <Button
                variant={ctaButton.variant || 'accent'}
                size="md"
                onClick={() => go(ctaButton.href)}
              >
                {ctaButton.text}
              </Button>
            </div>
          )}

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen((v) => !v)}
            style={{
              flexShrink: 0,
              background: 'none',
              border: 'none',
              padding: 'var(--foundation-space-2)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 'var(--foundation-radius-md)',
              transition: 'all 0.2s ease',
              color: 'var(--text-primary)',
              minWidth: '40px',
              height: '40px'
            }}
            className="mobile-only"
            aria-label={mobileOpen ? 'Stäng meny' : 'Öppna meny'}
          >
            <Icon size="md">
              {mobileOpen ? <XMarkIcon /> : <Bars3Icon />}
            </Icon>
          </button>
      </Container>

      {/* Mobile panel */}
      {mobileOpen && (
        <div
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            right: 0,
            backgroundColor: 'var(--surface-card)',
            backdropFilter: 'blur(10px)',
            borderBottom: '1px solid var(--border-subtle)',
            paddingTop: 'var(--foundation-space-4)',
            paddingBottom: 'var(--foundation-space-4)',
            boxShadow: '0 8px 24px rgba(0,0,0,0.22)',
            zIndex: 1001,
            animation: 'slideDown 0.3s ease-out'
          }}
          className="mobile-nav-panel"
        >
          <Container
            maxWidth="2xl"
            style={{ 
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--foundation-space-4)',
              alignItems: 'stretch'
            }}
          >
              {items.map((it) => (
                <TextLink
                  key={'m-' + it.href + it.label}
                  href={it.href}
                  variant={it.isActive ? 'accent' : 'secondary'}
                  size="lg"
                  weight="medium"
                  underline="none"
                  onClick={(e) => {
                    e.preventDefault();
                    setMobileOpen(false);
                    go(it.href);
                  }}
                  style={{
                    padding: 'var(--foundation-space-4) var(--foundation-space-3)',
                    borderRadius: 'var(--foundation-radius-md)',
                    textAlign: 'left',
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid var(--border-subtle)',
                    transition: 'all 0.2s ease',
                    fontSize: '1.1rem',
                    fontWeight: '500'
                  }}
                >
                  {it.label}
                </TextLink>
              ))}

              {ctaButton && (
                <Button
                  variant={ctaButton.variant || 'accent'}
                  size="lg"
                  onClick={() => {
                    setMobileOpen(false);
                    go(ctaButton.href);
                  }}
                  style={{
                    width: '100%',
                    marginTop: 'var(--foundation-space-3)',
                    padding: 'var(--foundation-space-4) var(--foundation-space-3)',
                    fontSize: '1.1rem',
                    fontWeight: '600'
                  }}
                >
                  {ctaButton.text}
                </Button>
              )}
          </Container>
        </div>
      )}

      <style>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
            visibility: hidden;
          }
          to {
            opacity: 1;
            transform: translateY(0);
            visibility: visible;
          }
        }
        
        .mobile-nav-panel {
          animation: slideDown 0.3s ease-out forwards;
          visibility: visible;
        }
      `}</style>
    </Section>
  );
};

export default CleanNavbar;