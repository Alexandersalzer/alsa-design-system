'use client';

import React, { useState, useEffect } from 'react';
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
    ctaHref
  } = content;

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Trigger compact mode after scrolling 50px
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
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
            transition: all 0.3s ease-in-out;
            background: var(--surface-page);
          }
          
          .pkl-navbar {
            max-width: var(--size-page-max-width);
            margin: 0 auto;
            padding: ${isScrolled ? 'var(--foundation-space-4)' : 'var(--foundation-space-6)'} var(--foundation-space-6);
            display: flex;
            align-items: center;
            justify-content: space-between;
            transition: all 0.3s ease-in-out;
            border-bottom: 1px solid ${isScrolled ? 'var(--border-light)' : 'transparent'};
            backdrop-filter: ${isScrolled ? 'blur(10px)' : 'none'};
            background: ${isScrolled ? 'rgba(var(--surface-page-rgb), 0.95)' : 'transparent'};
          }
          
          .pkl-navbar-logo {
            display: flex;
            align-items: center;
            gap: var(--foundation-space-3);
            color: var(--text-primary);
            font-size: 1.25rem;
            font-weight: var(--font-weight-bold);
            cursor: pointer;
            transition: all 0.3s ease-in-out;
          }
          
          .pkl-navbar-logo:hover {
            color: var(--primary-500);
          }
          
          .pkl-navbar-logo img {
            height: 32px;
            transition: all 0.3s ease-in-out;
          }
          
          .pkl-navbar-center {
            display: flex;
            align-items: center;
            gap: var(--foundation-space-8);
          }
          
          .pkl-navbar-nav {
            display: flex;
            align-items: center;
            gap: var(--foundation-space-6);
          }
          
          .pkl-navbar-nav-item {
            color: var(--text-primary);
            font-size: var(--foundation-typography-size-md);
            font-weight: var(--font-weight-medium);
            cursor: pointer;
            transition: all 0.2s ease-in-out;
            text-decoration: none;
            position: relative;
          }
          
          .pkl-navbar-nav-item::after {
            content: '';
            position: absolute;
            bottom: -4px;
            left: 0;
            width: 0;
            height: 2px;
            background: var(--primary-500);
            transition: width 0.2s ease-in-out;
          }
          
          .pkl-navbar-nav-item:hover {
            color: var(--primary-500);
          }
          
          .pkl-navbar-nav-item:hover::after {
            width: 100%;
          }
          
          .pkl-navbar-actions {
            display: flex;
            align-items: center;
            gap: var(--foundation-space-4);
          }
          
          @media (max-width: 768px) {
            .pkl-navbar {
              padding: var(--foundation-space-4);
            }
            
            .pkl-navbar-center {
              display: none;
            }
            
            .pkl-navbar-logo {
              font-size: 1.1rem;
            }
          }
        `
      }} />
      
      <nav className="pkl-navbar-container" id={id}>
        <div className="pkl-navbar">
          {/* Logo */}
          <div className="pkl-navbar-logo" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            {logo && <img src={logo} alt={logoText} />}
            <span>{logoText}</span>
          </div>
          
          {/* Center - Navigation */}
          <div className="pkl-navbar-center">
            <div className="pkl-navbar-nav">
              {navigationItems.map((item, index) => (
                <a
                  key={index}
                  className="pkl-navbar-nav-item"
                  onClick={() => handleNavClick(item.href)}
                >
                  {item.label}
                </a>
              ))}
            </div>
          </div>
          
          {/* Right - CTA Button */}
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
      </nav>
    </>
  );
};

PKLNavbar.displayName = 'PKLNavbar';
