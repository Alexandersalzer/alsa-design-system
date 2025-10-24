'use client';

import React from 'react';
import { Typography } from '../../../../../system/components/primitives/Typography';
import { Button } from '../../../../../system/components/primitives/Button';
import { VStack } from '../../../layout';
import { Grid } from '../../../layout';

export interface PKLFooterContent {
  logo?: string;
  logoText?: string;
  tagline?: string;
  
  // Navigation columns
  columns: Array<{
    title: string;
    links: Array<{
      label: string;
      href: string;
    }>;
  }>;
  
  // Contact info
  contactInfo?: {
    email?: string;
    phone?: string;
    address?: string;
  };
  
  // Social links
  socialLinks?: Array<{
    label: string;
    href: string;
    icon?: React.ReactNode;
  }>;
  
  // Bottom text
  copyrightText?: string;
  bottomLinks?: Array<{
    label: string;
    href: string;
  }>;
}

export interface PKLFooterProps {
  content: PKLFooterContent;
  id?: string;
}

export const PKLFooter: React.FC<PKLFooterProps> = ({ 
  content, 
  id = "pkl-footer" 
}) => {
  const { 
    logo,
    logoText = "PKL",
    tagline,
    columns,
    contactInfo,
    socialLinks,
    copyrightText,
    bottomLinks
  } = content;

  return (
    <>
      <style>{`
        .pkl-footer-container {
          width: 100%;
          padding: var(--foundation-space-4);
          background: var(--surface-page);
        }
        
        .pkl-footer {
          position: relative;
          width: 100%;
          max-width: var(--size-page-max-width);
          margin: 0 auto;
          border-radius: var(--radius-lg);
          overflow: hidden;
          background: var(--surface-muted);
          box-shadow: var(--shadow-lg);
        }
        
        .pkl-footer-content {
          position: relative;
          z-index: 2;
          padding: var(--foundation-space-12) var(--foundation-space-10);
        }
        
        .pkl-footer-brand {
          display: flex;
          flex-direction: column;
          gap: var(--foundation-space-4);
        }
        
        .pkl-footer-logo {
          display: flex;
          align-items: center;
          gap: var(--foundation-space-3);
          color: var(--text-primary);
          font-size: var(--foundation-typography-size-sm);
          font-weight: var(--font-weight-semibold);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        
        .pkl-footer-logo img {
          height: 40px;
        }
        
        .pkl-footer-tagline {
          color: var(--text-secondary);
          max-width: 280px;
          font-size: var(--foundation-typography-size-sm);
          line-height: 1.6;
        }
        
        .pkl-footer-column {
          display: flex;
          flex-direction: column;
          gap: var(--foundation-space-4);
        }
        
        .pkl-footer-column-title {
          color: var(--text-primary);
          font-weight: var(--font-weight-semibold);
          font-size: var(--foundation-typography-size-sm);
          text-transform: uppercase;
          letter-spacing: 0.05em;
          margin-bottom: var(--foundation-space-2);
        }
        
        .pkl-footer-links {
          display: flex;
          flex-direction: column;
          gap: var(--foundation-space-3);
        }
        
        .pkl-footer-link {
          color: white !important;
          font-size: var(--foundation-typography-size-xs);
          text-decoration: none;
          transition: color 0.2s ease, opacity 0.2s ease;
          cursor: pointer;
          opacity: 0.8;
        }
        
        .pkl-footer-link:hover {
          color: white !important;
          opacity: 1;
        }
        
        .pkl-footer-contact {
          display: flex;
          flex-direction: column;
          gap: var(--foundation-space-2);
        }
        
        .pkl-footer-contact-item {
          color: var(--text-secondary);
          font-size: var(--foundation-typography-size-xs);
          line-height: 1.6;
          display: flex;
          flex-direction: column;
          gap: var(--foundation-space-1);
        }
        
        .pkl-footer-contact-item strong {
          color: var(--text-tertiary);
          font-weight: var(--font-weight-medium);
          font-size: var(--foundation-typography-size-xs);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
        
        .pkl-footer-social {
          display: flex;
          gap: var(--foundation-space-4);
          margin-top: var(--foundation-space-6);
        }
        
        .pkl-footer-social-link {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: var(--radius-md);
          background: var(--surface-subtle);
          color: var(--text-secondary) !important;
          transition: all 0.2s ease;
          text-decoration: none;
        }
        
        .pkl-footer-social-link:hover {
          background: var(--accent-500);
          color: white !important;
          transform: translateY(-2px);
        }
        
        .pkl-footer-bottom {
          margin-top: var(--foundation-space-8);
          padding-top: var(--foundation-space-6);
          border-top: 1px solid var(--border-light);
          display: flex;
          justify-content: space-between;
          align-items: center;
          flex-wrap: wrap;
          gap: var(--foundation-space-4);
        }
        
        .pkl-footer-copyright {
          color: var(--text-tertiary);
          font-size: var(--foundation-typography-size-xs);
        }
        
        .pkl-footer-bottom-links {
          display: flex;
          gap: var(--foundation-space-4);
        }
        
        .pkl-footer-bottom-link {
          color: white !important;
          font-size: var(--foundation-typography-size-xs);
          text-decoration: none;
          transition: opacity 0.2s ease;
          opacity: 0.7;
        }
        
        .pkl-footer-bottom-link:hover {
          color: white !important;
          opacity: 1;
        }
        
        @media (max-width: 768px) {
          .pkl-footer-content {
            padding: var(--foundation-space-10) var(--foundation-space-6);
          }
          
          .pkl-footer-grid {
            gap: var(--foundation-space-10) !important;
          }
          
          .pkl-footer-bottom {
            flex-direction: column;
            align-items: flex-start;
            gap: var(--foundation-space-4);
          }
          
          .pkl-footer-brand {
            padding-bottom: var(--foundation-space-8);
            border-bottom: 1px solid var(--border-light);
            width: 100%;
            margin-bottom: var(--foundation-space-4);
          }
          
          .pkl-footer-column {
            width: 100%;
            padding-bottom: var(--foundation-space-6);
            border-bottom: 1px solid var(--border-light);
          }
          
          .pkl-footer-column:last-of-type {
            border-bottom: none;
          }
          
          .pkl-footer-bottom-links {
            flex-wrap: wrap;
            gap: var(--foundation-space-4);
          }
        }
      `}</style>

      <footer id={id} className="pkl-footer-container">
        <div className="pkl-footer">
          <div className="pkl-footer-content">
            <Grid 
              columns="auto-fit"
              minItemWidth="250px"
              gap="xl"
              className="pkl-footer-grid"
            >
              {/* Brand Column */}
              <div className="pkl-footer-brand">
                <div className="pkl-footer-logo">
                  {logo && <img src={logo} alt={logoText} />}
                  {logoText}
                </div>
                {tagline && (
                  <Typography variant="body-sm" color="secondary" className="pkl-footer-tagline">
                    {tagline}
                  </Typography>
                )}
                {contactInfo && (
                  <div className="pkl-footer-contact">
                    {contactInfo.email && (
                      <div className="pkl-footer-contact-item">
                        <strong>Email:</strong> {contactInfo.email}
                      </div>
                    )}
                    {contactInfo.phone && (
                      <div className="pkl-footer-contact-item">
                        <strong>Phone:</strong> {contactInfo.phone}
                      </div>
                    )}
                    {contactInfo.address && (
                      <div className="pkl-footer-contact-item">
                        <strong>Address:</strong> {contactInfo.address}
                      </div>
                    )}
                  </div>
                )}
                {socialLinks && socialLinks.length > 0 && (
                  <div className="pkl-footer-social">
                    {socialLinks.map((social, index) => (
                      <a
                        key={index}
                        href={social.href}
                        className="pkl-footer-social-link"
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={social.label}
                      >
                        {social.icon}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Navigation Columns */}
              {columns.map((column, index) => (
                <div key={index} className="pkl-footer-column">
                  <div className="pkl-footer-column-title">
                    {column.title}
                  </div>
                  <div className="pkl-footer-links">
                    {column.links.map((link, linkIndex) => (
                      <a
                        key={linkIndex}
                        href={link.href}
                        className="pkl-footer-link"
                      >
                        {link.label}
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </Grid>

            {/* Bottom Section */}
            <div className="pkl-footer-bottom">
              <div className="pkl-footer-copyright">
                {copyrightText || `© ${new Date().getFullYear()} ${logoText}. All rights reserved.`}
              </div>
              {bottomLinks && bottomLinks.length > 0 && (
                <div className="pkl-footer-bottom-links">
                  {bottomLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.href}
                      className="pkl-footer-bottom-link"
                    >
                      {link.label}
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </footer>
    </>
  );
};

