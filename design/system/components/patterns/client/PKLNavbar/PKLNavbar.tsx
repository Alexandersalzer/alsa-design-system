'use client';

import React, { useState, useEffect } from 'react';
import { Typography } from '../../../../../system/components/primitives/Typography';
import { Button } from '../../../../../system/components/primitives/Button';
import { Section } from '../../../../../system/layout/frames/section/Section';
import { Stack } from '../../../../../system/layout/utilities/stack/Stack';

export interface PKLNavbarContent {
  logo?: string;
  logoAlt?: string;
  businessName: string;
  heroTitle: string;
  heroSubtitle: string;
  primaryButtonText: string;
  primaryButtonHref?: string;
  secondaryButtonText: string;
  secondaryButtonHref?: string;
  heroImage?: string;
  navigationLinks?: Array<{
    label: string;
    href: string;
  }>;
}

export interface PKLNavbarProps {
  content: PKLNavbarContent;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
  id?: string;
}

export const PKLNavbar: React.FC<PKLNavbarProps> = ({ 
  content, 
  onPrimaryClick, 
  onSecondaryClick, 
  id = "pkl-navbar" 
}) => {
  const { 
    logo,
    logoAlt,
    businessName,
    heroTitle, 
    heroSubtitle, 
    primaryButtonText,
    primaryButtonHref,
    secondaryButtonText,
    secondaryButtonHref,
    heroImage,
    navigationLinks = []
  } = content;

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Switch to compact mode after scrolling 100px
      setIsScrolled(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handlePrimaryClick = () => {
    if (onPrimaryClick) {
      onPrimaryClick();
    } else if (primaryButtonHref) {
      window.location.href = primaryButtonHref;
    }
  };

  const handleSecondaryClick = () => {
    if (onSecondaryClick) {
      onSecondaryClick();
    } else if (secondaryButtonHref) {
      window.location.href = secondaryButtonHref;
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          /* Sticky Navbar */
          .pkl-sticky-navbar {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 1000;
            height: 80px;
            transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
            pointer-events: none;
          }
          
          .pkl-sticky-navbar.visible {
            pointer-events: all;
          }
          
          .navbar-background {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: var(--surface-card);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            box-shadow: var(--shadow-md);
            opacity: 0;
            transition: opacity 0.3s ease;
          }
          
          .pkl-sticky-navbar.visible .navbar-background {
            opacity: 0.95;
          }
          
          .navbar-inner {
            position: relative;
            z-index: 2;
            height: 100%;
            max-width: var(--size-page-max-width);
            margin: 0 auto;
            padding: 0 var(--foundation-space-6);
            display: flex;
            align-items: center;
            justify-content: space-between;
            opacity: 0;
            transform: translateY(-10px);
            transition: all 0.3s ease;
          }
          
          .pkl-sticky-navbar.visible .navbar-inner {
            opacity: 1;
            transform: translateY(0);
          }
          
          .navbar-logo {
            display: flex;
            align-items: center;
            gap: var(--foundation-space-3);
          }
          
          .navbar-logo img {
            height: 32px;
          }
          
          .navbar-logo-text {
            font-weight: var(--font-weight-semibold);
            font-size: var(--foundation-typography-size-lg);
            color: var(--text-primary);
          }
          
          .navbar-nav {
            display: flex;
            align-items: center;
            gap: var(--foundation-space-6);
          }
          
          .navbar-nav a {
            text-decoration: none;
            font-weight: var(--font-weight-medium);
            font-size: var(--foundation-typography-size-md);
            color: var(--text-primary);
            transition: color 0.2s ease;
          }
          
          .navbar-nav a:hover {
            color: var(--primary-500);
          }
          
          .mobile-menu-button {
            display: none;
            background: none;
            border: none;
            cursor: pointer;
            padding: var(--foundation-space-2);
            color: var(--text-primary);
          }
          
          .mobile-menu {
            display: none;
            position: absolute;
            top: 100%;
            left: 0;
            right: 0;
            background: var(--surface-card);
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            box-shadow: var(--shadow-lg);
            padding: var(--foundation-space-4);
          }
          
          .mobile-menu.open {
            display: block;
          }
          
          .mobile-menu a {
            display: block;
            padding: var(--foundation-space-3);
            text-decoration: none;
            color: var(--text-primary);
            font-weight: var(--font-weight-medium);
            transition: background 0.2s ease;
          }
          
          .mobile-menu a:hover {
            background: var(--surface-muted);
            border-radius: var(--radius-sm);
          }
          
          /* Hero Section */
          .pkl-hero-section {
            position: relative;
            min-height: 60vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
            border-radius: var(--radius-lg);
            overflow: hidden;
            margin-bottom: var(--foundation-space-12);
          }
          
          .hero-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.6) 100%);
          }
          
          .hero-content {
            position: relative;
            z-index: 2;
            max-width: var(--size-page-content-max-width);
            margin: 0 auto;
            padding: var(--foundation-space-12) var(--foundation-space-6);
            text-align: center;
          }
          
          .hero-title {
            margin-bottom: var(--foundation-space-4);
            text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          }
          
          .hero-subtitle {
            margin-bottom: var(--foundation-space-6);
            text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
          }
          
          .hero-actions {
            display: flex;
            gap: var(--foundation-space-4);
            justify-content: center;
            flex-wrap: wrap;
          }
          
          @media (max-width: 768px) {
            .navbar-nav {
              display: none;
            }
            
            .mobile-menu-button {
              display: block;
            }
            
            .hero-actions {
              flex-direction: column;
              width: 100%;
              max-width: 300px;
              margin: 0 auto;
            }
            
            .hero-actions button {
              width: 100%;
            }
          }
        `
      }} />
      
      {/* Sticky Navbar */}
      <nav 
        className={`pkl-sticky-navbar ${isScrolled ? 'visible' : ''}`}
      >
        <div className="navbar-background" />
        
        <div className="navbar-inner">
          {/* Logo */}
          <div className="navbar-logo">
            {logo && (
              <img src={logo} alt={logoAlt || businessName} />
            )}
            <span className="navbar-logo-text">{businessName}</span>
          </div>
          
          {/* Desktop Navigation */}
          <div className="navbar-nav">
            {navigationLinks.map((link, index) => (
              <a key={index} href={link.href}>
                {link.label}
              </a>
            ))}
          </div>
          
          {/* CTA Button */}
          <div>
            <Button 
              variant="primary" 
              size="md"
              onClick={handlePrimaryClick}
            >
              {primaryButtonText}
            </Button>
          </div>
          
          {/* Mobile Menu Button */}
          <button 
            className="mobile-menu-button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {isMobileMenuOpen ? (
                <path d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path d="M3 12h18M3 6h18M3 18h18" />
              )}
            </svg>
          </button>
        </div>
        
        {/* Mobile Menu */}
        {isScrolled && (
          <div className={`mobile-menu ${isMobileMenuOpen ? 'open' : ''}`}>
            {navigationLinks.map((link, index) => (
              <a 
                key={index} 
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                {link.label}
              </a>
            ))}
          </div>
        )}
      </nav>
      
      {/* Hero Section */}
      <Section
        id={id}
        as="section"
        className="pkl-hero-section"
        style={{
          backgroundImage: heroImage ? `url(${heroImage})` : 'none',
        }}
      >
        <div className="hero-overlay" />
        
        <div className="hero-content">
          <Stack spacing="lg" align="center">
            <Typography 
              variant="display-lg" 
              weight="semibold"
              as="h1"
              style={{ color: 'white' }}
              className="hero-title"
            >
              {heroTitle}
            </Typography>
            
            <Typography 
              variant="body-lg"
              style={{ color: 'white', opacity: 0.9 }}
              className="hero-subtitle"
            >
              {heroSubtitle}
            </Typography>
            
            <div className="hero-actions">
              <Button 
                variant="primary" 
                size="lg"
                onClick={handlePrimaryClick}
              >
                {primaryButtonText}
              </Button>
              
              <Button 
                variant="secondary" 
                size="lg"
                onClick={handleSecondaryClick}
              >
                {secondaryButtonText}
              </Button>
            </div>
          </Stack>
        </div>
      </Section>
    </>
  );
};

PKLNavbar.displayName = 'PKLNavbar';
