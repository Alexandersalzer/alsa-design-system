// ===============================================
// design/system/components/patterns/client/NavbarSection/NavbarSection.tsx
// MODERN NAVBAR COMPONENT - Built with Blimpify Design System
// ===============================================

import React, { useState } from 'react';
import { MenuIcon, XIcon, ArrowRightIcon } from 'lucide-react';
import { Section } from '../../../../layout/frames/section/Section';
import { Stack } from '../../../../layout/utilities/stack/Stack';
import { Typography } from '../../../primitives/Typography';
import { TextLink } from '../../../primitives/TextLink';
import { Icon } from '../../../primitives/Icon';
import { Button } from '../../../primitives/Button';
import './NavbarSection.css';

// ===== TYPE DEFINITIONS =====

export interface NavbarLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface NavbarSectionProps {
  id?: string;
  className?: string;
  
  // Company info
  companyName?: string;
  logoUrl?: string;
  logoAlt?: string;
  
  // Navigation
  links?: NavbarLink[];
  activeLink?: string;
  
  // CTA buttons
  primaryButton?: {
    text: string;
    href: string;
    onClick?: () => void;
  };
  secondaryButton?: {
    text: string;
    href: string;
    onClick?: () => void;
  };
  
  // Responsive
  showMobileMenu?: boolean;
  onMobileMenuToggle?: (isOpen: boolean) => void;
}

// ===== MAIN NAVBAR COMPONENT =====

export const NavbarSection: React.FC<NavbarSectionProps> = ({
  id = "navbar",
  className,
  companyName = "My Company",
  logoUrl,
  logoAlt,
  links = [],
  activeLink,
  primaryButton,
  secondaryButton,
  showMobileMenu = false,
  onMobileMenuToggle
}) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleMobileMenuToggle = () => {
    const newState = !isMobileMenuOpen;
    setIsMobileMenuOpen(newState);
    onMobileMenuToggle?.(newState);
  };

  const handleLinkClick = (link: NavbarLink) => {
    if (link.external) {
      window.open(link.href, '_blank', 'noopener,noreferrer');
    } else if (link.href.startsWith('#')) {
      const element = document.querySelector(link.href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.location.href = link.href;
    }
    setIsMobileMenuOpen(false);
  };

  const handleButtonClick = (button: { href: string; onClick?: () => void }) => {
    if (button.onClick) {
      button.onClick();
    } else if (button.href.startsWith('#')) {
      const element = document.querySelector(button.href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.location.href = button.href;
    }
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      <Section
        id={id}
        as="header"
        className={`navbar-section ${className || ''}`}
        style={{
          backgroundColor: 'var(--surface-default)',
          borderBottom: '1px solid var(--border-subtle)',
          paddingTop: 'var(--foundation-space-sm)',
          paddingBottom: 'var(--foundation-space-sm)',
          position: 'sticky',
          top: 0,
          zIndex: 1000
        }}
      >
        <div style={{
          maxWidth: 'var(--size-page-max-width)',
          margin: '0 auto',
          padding: '0 var(--foundation-space-6)'
        }}>
          <div 
            style={{
              width: '100%',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 'var(--foundation-space-lg)',
              minHeight: '60px'
            }}
          >
            {/* Left Zone - Company Logo */}
            <div style={{ flexShrink: 0 }}>
              <TextLink
                href="/"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  textDecoration: 'none',
                  transition: 'transform 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                {logoUrl ? (
                  <img 
                    src={logoUrl}
                    alt={logoAlt || companyName}
                    style={{
                      height: '40px',
                      width: 'auto'
                    }}
                  />
                ) : (
                  <Typography
                    variant="h3"
                    weight="bold"
                    color="primary"
                    style={{
                      fontSize: '1.5rem',
                      margin: 0,
                      background: 'linear-gradient(135deg, var(--accent-500) 0%, var(--accent-400) 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text'
                    }}
                  >
                    {companyName}
                  </Typography>
                )}
              </TextLink>
            </div>

            {/* Middle Zone - Navigation Links (Desktop) */}
            <div className="navbar-desktop-nav" style={{ display: 'flex', flex: 1, justifyContent: 'center' }}>
              {links.length > 0 ? (
                <nav>
                  <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 'var(--foundation-space-lg)' }}>
                    {links.map((link, index) => (
                      <TextLink
                        key={index}
                        href={link.href}
                        variant="secondary"
                        style={{
                          fontSize: '0.875rem',
                          fontWeight: '500',
                          color: activeLink === link.href ? 'var(--accent-500)' : 'var(--text-primary)',
                          textDecoration: 'none',
                          transition: 'color 0.2s ease',
                          position: 'relative'
                        }}
                        onMouseEnter={(e) => {
                          if (activeLink !== link.href) {
                            e.currentTarget.style.color = 'var(--accent-400)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (activeLink !== link.href) {
                            e.currentTarget.style.color = 'var(--text-primary)';
                          }
                        }}
                        onClick={(e) => {
                          e.preventDefault();
                          handleLinkClick(link);
                        }}
                      >
                        {link.label}
                        {activeLink === link.href && (
                          <div
                            style={{
                              position: 'absolute',
                              bottom: '-8px',
                              left: '50%',
                              transform: 'translateX(-50%)',
                              width: '20px',
                              height: '2px',
                              backgroundColor: 'var(--accent-500)',
                              borderRadius: 'var(--radius-full)'
                            }}
                          />
                        )}
                      </TextLink>
                    ))}
                  </div>
                </nav>
              ) : (
                <div style={{ flex: 1 }} />
              )}
            </div>

            {/* Right Zone - CTA Buttons (Desktop) */}
            <div className="navbar-desktop-cta" style={{ display: 'flex', flexShrink: 0, justifyContent: 'flex-end' }}>
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 'var(--foundation-space-sm)' }}>
                {secondaryButton && (
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleButtonClick(secondaryButton)}
                    style={{
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.875rem',
                      fontWeight: '500'
                    }}
                  >
                    {secondaryButton.text}
                  </Button>
                )}
                {primaryButton && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => handleButtonClick(primaryButton)}
                    style={{
                      borderRadius: 'var(--radius-full)',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      background: 'linear-gradient(135deg, var(--accent-500) 0%, var(--accent-400) 100%)',
                      border: 'none'
                    }}
                  >
                  <Icon size="sm" color="primary">
                    <ArrowRightIcon />
                  </Icon>
                    {primaryButton.text}
                  </Button>
                )}
              </div>
            </div>

            {/* Mobile Menu Button */}
            <div className="navbar-mobile-menu" style={{ display: 'none', flexShrink: 0 }}>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleMobileMenuToggle}
                style={{
                  padding: 'var(--foundation-space-2)',
                  borderRadius: 'var(--radius-md)'
                }}
              >
                <Icon size="md" color="primary">
                  {isMobileMenuOpen ? <XIcon /> : <MenuIcon />}
                </Icon>
              </Button>
            </div>
          </div>
        </div>
      </Section>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div
          className="navbar-mobile-overlay"
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999,
            display: 'none'
          }}
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Mobile Menu */}
      <div
        className="navbar-mobile-menu-content"
        style={{
          position: 'fixed',
          top: '0',
          right: isMobileMenuOpen ? '0' : '-100%',
          width: '280px',
          height: '100vh',
          backgroundColor: 'var(--surface-default)',
          borderLeft: '1px solid var(--border-subtle)',
          zIndex: 1000,
          transition: 'right 0.3s ease',
          display: 'none',
          padding: 'var(--foundation-space-6)',
          boxShadow: 'var(--shadow-lg)'
        }}
      >
        <Stack spacing="xl" align="start">
          {/* Mobile Logo */}
          <div style={{ width: '100%', borderBottom: '1px solid var(--border-subtle)', paddingBottom: 'var(--foundation-space-4)' }}>
            <TextLink
              href="/"
              style={{ textDecoration: 'none' }}
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {logoUrl ? (
                <img 
                  src={logoUrl}
                  alt={logoAlt || companyName}
                  style={{
                    height: '32px',
                    width: 'auto'
                  }}
                />
              ) : (
                <Typography
                  variant="h4"
                  weight="bold"
                  color="primary"
                  style={{
                    margin: 0,
                    background: 'linear-gradient(135deg, var(--accent-500) 0%, var(--accent-400) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    backgroundClip: 'text'
                  }}
                >
                  {companyName}
                </Typography>
              )}
            </TextLink>
          </div>

          {/* Mobile Navigation Links */}
          {links.length > 0 && (
            <nav style={{ width: '100%' }}>
              <Stack spacing="lg" align="start">
                {links.map((link, index) => (
                  <TextLink
                    key={index}
                    href={link.href}
                    variant="secondary"
                    style={{
                      fontSize: '1rem',
                      fontWeight: '500',
                      color: activeLink === link.href ? 'var(--accent-500)' : 'var(--text-primary)',
                      textDecoration: 'none',
                      transition: 'color 0.2s ease',
                      width: '100%',
                      padding: 'var(--foundation-space-2) 0'
                    }}
                    onClick={(e) => {
                      e.preventDefault();
                      handleLinkClick(link);
                    }}
                  >
                    {link.label}
                  </TextLink>
                ))}
              </Stack>
            </nav>
          )}

          {/* Mobile CTA Buttons */}
          <div style={{ width: '100%', marginTop: 'auto', borderTop: '1px solid var(--border-subtle)', paddingTop: 'var(--foundation-space-4)' }}>
            <Stack spacing="sm" align="stretch">
              {secondaryButton && (
                <Button
                  variant="secondary"
                  size="md"
                  onClick={() => handleButtonClick(secondaryButton)}
                  style={{
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    width: '100%'
                  }}
                >
                  {secondaryButton.text}
                </Button>
              )}
              {primaryButton && (
                <Button
                  variant="primary"
                  size="md"
                  onClick={() => handleButtonClick(primaryButton)}
                  style={{
                    borderRadius: 'var(--radius-full)',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    width: '100%',
                    background: 'linear-gradient(135deg, var(--accent-500) 0%, var(--accent-400) 100%)',
                    border: 'none'
                  }}
                >
                  <Icon size="sm" color="primary">
                    <ArrowRightIcon />
                  </Icon>
                  {primaryButton.text}
                </Button>
              )}
            </Stack>
          </div>
        </Stack>
      </div>
    </>
  );
};

NavbarSection.displayName = 'NavbarSection';
