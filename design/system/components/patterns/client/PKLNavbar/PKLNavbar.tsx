'use client';

import React, { useState, useEffect } from 'react';
import { Typography } from '../../../../../system/components/primitives/Typography';
import { Button } from '../../../../../system/components/primitives/Button';

export interface PKLNavbarContent {
  logo?: string;
  logoText?: string;
  navigationItems: Array<{
    label: string;
    href: string;
  }>;
  ctaText: string;
  ctaHref?: string;
  heroImage?: string;
  heroTitle?: string;
  heroSubtitle?: string;
}

export interface PKLNavbarProps {
  content: PKLNavbarContent;
  onCtaClick?: () => void;
  id?: string;
}

export const PKLNavbar: React.FC<PKLNavbarProps> = ({ 
  content, 
  onCtaClick,
  id = "pkl-navbar" 
}) => {
  const { 
    logo,
    logoText = "PKL",
    navigationItems,
    ctaText,
    ctaHref,
    heroImage,
    heroTitle,
    heroSubtitle
  } = content;

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    // Check initial scroll position on mount
    setIsScrolled(window.scrollY > 10);
    
    let ticking = false;
    
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          // Trigger shrink immediately when scrolling starts for responsive feel
          setIsScrolled(window.scrollY > 10);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleCtaClick = () => {
    if (onCtaClick) {
      onCtaClick();
    } else if (ctaHref) {
      window.location.href = ctaHref;
    }
  };

  const handleNavClick = (href: string) => {
    if (href.startsWith('#')) {
      const element = document.querySelector(href);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      window.location.href = href;
    }
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          .pkl-navbar-container {
            position: sticky;
            top: 0;
            left: 0;
            right: 0;
            z-index: 1000;
            width: 100%;
            padding: var(--foundation-space-4) var(--foundation-space-4);
            pointer-events: none;
          }
          
          .pkl-navbar {
            position: relative;
            width: 100%;
            max-width: var(--size-page-max-width);
            margin: 0 auto;
            height: ${isScrolled ? '80px' : '60vh'};
            min-height: 80px;
            border-radius: var(--radius-lg);
            overflow: hidden;
            transition: height 1s cubic-bezier(0.22, 0.61, 0.36, 1), 
                        box-shadow 0.8s cubic-bezier(0.22, 0.61, 0.36, 1);
            box-shadow: ${isScrolled ? 'var(--shadow-lg)' : 'var(--shadow-md)'};
            will-change: height;
            pointer-events: auto;
          }
          
          .pkl-navbar-background {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: url('${heroImage}');
            background-size: cover;
            background-position: center;
            background-repeat: no-repeat;
          }
          
          .pkl-navbar-overlay {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: linear-gradient(
              to bottom, 
              rgba(0,0,0,${isScrolled ? '0.7' : '0.4'}) 0%, 
              rgba(0,0,0,${isScrolled ? '0.8' : '0.6'}) 100%
            );
            transition: background 1s cubic-bezier(0.22, 0.61, 0.36, 1);
          }
          
          .pkl-navbar-content {
            position: relative;
            z-index: 2;
            height: 100%;
            display: flex;
            flex-direction: column;
            justify-content: flex-end;
            padding: 0 var(--foundation-space-8) var(--foundation-space-8);
          }
          
          .pkl-navbar-top {
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            display: flex;
            align-items: center;
            justify-content: space-between;
            width: 100%;
            height: 80px;
            padding: 0 var(--foundation-space-8);
            z-index: 10;
          }
          
          .pkl-navbar-logo {
            display: flex;
            align-items: center;
            gap: var(--foundation-space-3);
            color: white;
            font-size: ${isScrolled ? '1.25rem' : '1.5rem'};
            font-weight: var(--font-weight-bold);
            transition: font-size 0.8s cubic-bezier(0.22, 0.61, 0.36, 1);
            cursor: pointer;
          }
          
          .pkl-navbar-logo img {
            height: ${isScrolled ? '32px' : '40px'};
            transition: height 0.8s cubic-bezier(0.22, 0.61, 0.36, 1);
          }
          
          .pkl-navbar-nav {
            display: flex;
            align-items: center;
            gap: var(--foundation-space-6);
          }
          
          .pkl-navbar-nav-item {
            color: white !important;
            font-size: var(--foundation-typography-size-md);
            font-weight: var(--font-weight-medium);
            cursor: pointer;
            transition: opacity 0.2s ease, transform 0.2s ease;
            opacity: 0.9;
            text-decoration: none;
          }
          
          .pkl-navbar-nav-item:hover {
            opacity: 1 !important;
            color: white !important;
            transform: translateY(-2px);
          }
          
          .pkl-navbar-actions {
            display: flex;
            align-items: center;
            gap: var(--foundation-space-4);
          }
          
          .pkl-navbar-hero {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            text-align: center;
            opacity: ${isScrolled ? '0' : '1'};
            transform: translateY(${isScrolled ? '-60px' : '0'}) scale(${isScrolled ? '0.9' : '1'});
            transition: opacity 0.7s cubic-bezier(0.22, 0.61, 0.36, 1),
                        transform 1s cubic-bezier(0.22, 0.61, 0.36, 1);
            pointer-events: ${isScrolled ? 'none' : 'auto'};
            max-width: var(--size-page-content-max-width);
            margin: 0 auto;
            padding-bottom: var(--foundation-space-8);
            will-change: opacity, transform;
          }
          
          .pkl-navbar-hero-title {
            color: white;
            margin-bottom: var(--foundation-space-4);
            text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
          }
          
          .pkl-navbar-hero-subtitle {
            color: white;
            opacity: 0.9;
            margin-bottom: var(--foundation-space-6);
            text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
          }
          
          .pkl-navbar-hero-actions {
            display: flex;
            gap: var(--foundation-space-4);
            justify-content: center;
            flex-wrap: wrap;
          }
          
          @media (max-width: 768px) {
            .pkl-navbar-container {
              padding: var(--foundation-space-2);
            }
            
            .pkl-navbar {
              height: ${isScrolled ? '70px' : '50vh'};
              min-height: 70px;
            }
            
            .pkl-navbar-content {
              padding: var(--foundation-space-4);
            }
            
            .pkl-navbar-nav {
              display: none;
            }
            
            .pkl-navbar-logo {
              font-size: ${isScrolled ? '1.1rem' : '1.25rem'};
            }
            
            .pkl-navbar-hero {
              padding: var(--foundation-space-4) 0;
            }
          }
          
          @media (prefers-reduced-motion: reduce) {
            .pkl-navbar,
            .pkl-navbar-content,
            .pkl-navbar-hero,
            .pkl-navbar-logo,
            .pkl-navbar-logo img,
            .pkl-navbar-overlay {
              transition: none !important;
            }
          }
        `
      }} />
      
      <div className="pkl-navbar-container" id={id}>
        <div className="pkl-navbar">
          {/* Background Image */}
          <div className="pkl-navbar-background" />
          
          {/* Overlay */}
          <div className="pkl-navbar-overlay" />
          
          {/* Content */}
          <div className="pkl-navbar-content">
            {/* Top Bar - Always Visible */}
            <div className="pkl-navbar-top">
              {/* Logo */}
              <div className="pkl-navbar-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                {logo && <img src={logo} alt={logoText} />}
                <span>{logoText}</span>
              </div>
              
              {/* Navigation - Desktop */}
              <nav className="pkl-navbar-nav">
                {navigationItems.map((item, index) => (
                  <a
                    key={index}
                    className="pkl-navbar-nav-item"
                    onClick={() => handleNavClick(item.href)}
                  >
                    {item.label}
                  </a>
                ))}
              </nav>
              
              {/* CTA Button */}
              <div className="pkl-navbar-actions">
                <Button 
                  variant="primary" 
                  size="md"
                  onClick={handleCtaClick}
                >
                  {ctaText}
                </Button>
              </div>
            </div>
            
            {/* Hero Content - Fades Out on Scroll */}
            {(heroTitle || heroSubtitle) && (
              <div className="pkl-navbar-hero">
                {heroTitle && (
                  <Typography
                    variant="display-lg"
                    weight="semibold"
                    as="h1"
                    className="pkl-navbar-hero-title"
                  >
                    {heroTitle}
                  </Typography>
                )}
                
                {heroSubtitle && (
                  <Typography
                    variant="body-lg"
                    className="pkl-navbar-hero-subtitle"
                  >
                    {heroSubtitle}
                  </Typography>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

PKLNavbar.displayName = 'PKLNavbar';
