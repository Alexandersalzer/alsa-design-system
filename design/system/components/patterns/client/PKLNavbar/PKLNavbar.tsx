'use client';

import React, { useState, useEffect } from 'react';
import { Typography } from '../../../../../system/components/primitives/Typography';
import { Button } from '../../../../../system/components/primitives/Button';

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
          .pkl-navbar {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 1000;
            transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
          }
          
          .pkl-navbar.expanded {
            height: 60vh;
            min-height: 500px;
          }
          
          .pkl-navbar.compact {
            height: 80px;
            backdrop-filter: blur(10px);
            -webkit-backdrop-filter: blur(10px);
            box-shadow: var(--shadow-md);
          }
          
          .navbar-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            transition: opacity 0.4s ease;
          }
          
          .navbar-overlay.expanded {
            background: linear-gradient(to bottom, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.6) 100%);
            opacity: 1;
          }
          
          .navbar-overlay.compact {
            background: var(--surface-card);
            opacity: 0.95;
          }
          
          .navbar-content {
            position: relative;
            z-index: 2;
            height: 100%;
            max-width: var(--size-page-max-width);
            margin: 0 auto;
            padding: 0 var(--foundation-space-6);
            display: flex;
            flex-direction: column;
            transition: all 0.4s ease;
          }
          
          /* Expanded State - Hero Mode */
          .navbar-content.expanded {
            justify-content: space-between;
            padding-top: var(--foundation-space-6);
            padding-bottom: var(--foundation-space-12);
          }
          
          .navbar-top {
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: all 0.4s ease;
          }
          
          .navbar-logo {
            display: flex;
            align-items: center;
            gap: var(--foundation-space-3);
            transition: all 0.4s ease;
          }
          
          .navbar-logo img {
            transition: all 0.4s ease;
          }
          
          .navbar-content.expanded .navbar-logo img {
            height: 48px;
          }
          
          .navbar-content.compact .navbar-logo img {
            height: 32px;
          }
          
          .navbar-logo-text {
            font-weight: var(--font-weight-semibold);
            transition: all 0.4s ease;
          }
          
          .navbar-content.expanded .navbar-logo-text {
            font-size: var(--foundation-typography-size-xl);
            color: white;
          }
          
          .navbar-content.compact .navbar-logo-text {
            font-size: var(--foundation-typography-size-lg);
            color: var(--text-primary);
          }
          
          /* Navigation Links */
          .navbar-nav {
            display: flex;
            align-items: center;
            gap: var(--foundation-space-6);
            transition: all 0.4s ease;
          }
          
          .navbar-content.expanded .navbar-nav {
            opacity: 0;
            pointer-events: none;
          }
          
          .navbar-content.compact .navbar-nav {
            opacity: 1;
            pointer-events: all;
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
          
          /* Hero Content */
          .navbar-hero {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            flex: 1;
            transition: all 0.4s ease;
          }
          
          .navbar-content.expanded .navbar-hero {
            opacity: 1;
            transform: translateY(0);
          }
          
          .navbar-content.compact .navbar-hero {
            opacity: 0;
            transform: translateY(-20px);
            pointer-events: none;
            position: absolute;
          }
          
          .navbar-hero-title {
            margin-bottom: var(--foundation-space-4);
            max-width: var(--size-page-content-max-width);
          }
          
          .navbar-hero-subtitle {
            margin-bottom: var(--foundation-space-6);
            max-width: var(--size-page-narrow-max-width);
          }
          
          .navbar-hero-actions {
            display: flex;
            gap: var(--foundation-space-4);
            justify-content: center;
            flex-wrap: wrap;
          }
          
          /* Compact State - CTA Button */
          .navbar-cta {
            transition: all 0.4s ease;
          }
          
          .navbar-content.expanded .navbar-cta {
            opacity: 0;
            pointer-events: none;
          }
          
          .navbar-content.compact .navbar-cta {
            opacity: 1;
            pointer-events: all;
          }
          
          /* Mobile Menu */
          .mobile-menu-button {
            display: none;
            background: none;
            border: none;
            cursor: pointer;
            padding: var(--foundation-space-2);
            color: var(--text-primary);
          }
          
          .navbar-content.expanded .mobile-menu-button {
            color: white;
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
          
          /* Responsive */
          @media (max-width: 768px) {
            .pkl-navbar.expanded {
              height: 70vh;
              min-height: 400px;
            }
            
            .navbar-nav {
              display: none;
            }
            
            .mobile-menu-button {
              display: block;
            }
            
            .navbar-hero-actions {
              flex-direction: column;
              width: 100%;
              max-width: 300px;
            }
            
            .navbar-hero-actions button {
              width: 100%;
            }
          }
          
          /* Smooth text shadows for readability */
          .text-with-shadow {
            text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
          }
        `
      }} />
      
      <nav 
        id={id}
        className={`pkl-navbar ${isScrolled ? 'compact' : 'expanded'}`}
        style={{
          backgroundImage: heroImage && !isScrolled ? `url(${heroImage})` : 'none',
        }}
      >
        <div className={`navbar-overlay ${isScrolled ? 'compact' : 'expanded'}`} />
        
        <div className={`navbar-content ${isScrolled ? 'compact' : 'expanded'}`}>
          {/* Top Bar */}
          <div className="navbar-top">
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
            
            {/* Compact CTA */}
            <div className="navbar-cta">
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
          
          {/* Hero Content (Expanded State) */}
          <div className="navbar-hero">
            <div className="navbar-hero-title">
              <Typography 
                variant="display-lg" 
                weight="semibold"
                as="h1"
                style={{ color: 'white' }}
                className="text-with-shadow"
              >
                {heroTitle}
              </Typography>
            </div>
            
            <div className="navbar-hero-subtitle">
              <Typography 
                variant="body-lg"
                style={{ color: 'white', opacity: 0.9 }}
                className="text-with-shadow"
              >
                {heroSubtitle}
              </Typography>
            </div>
            
            <div className="navbar-hero-actions">
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
          </div>
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
      
      {/* Spacer to prevent content jump */}
      <div style={{ height: isScrolled ? '80px' : '60vh', minHeight: isScrolled ? '80px' : '500px' }} />
    </>
  );
};

PKLNavbar.displayName = 'PKLNavbar';
