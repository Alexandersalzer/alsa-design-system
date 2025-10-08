'use client';

import React from 'react';
import { Typography } from '../../../../../system/components/primitives/Typography';
import { Section } from '../../../../../system/layout/frames/section/Section';
import { Stack } from '../../../../../system/layout/utilities/stack/Stack';
import { Grid } from '../../../../../system/layout/utilities/grid/Grid';

export interface PKLFooterLink {
  label: string;
  href: string;
}

export interface PKLSocialLink {
  name: string;
  href: string;
  icon: React.ReactElement;
}

export interface PKLFooterContent {
  logo?: React.ReactElement;
  companyName?: string;
  description: string;
  links: PKLFooterLink[];
  support: PKLFooterLink[];
  social: PKLSocialLink[];
  copyright: string;
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
    companyName = "PKL Consulting",
    description, 
    links,
    support,
    social,
    copyright
  } = content;

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          .pkl-footer-container {
            max-width: var(--size-page-max-width);
            margin: 0 auto;
            padding: 0 var(--foundation-space-6);
          }
          
          .footer-brand {
            max-width: 280px;
          }
          
          .footer-logo {
            margin-bottom: var(--foundation-space-4);
          }
          
          .footer-description {
            color: var(--text-secondary);
            line-height: 1.6;
          }
          
          .footer-column {
            display: flex;
            flex-direction: column;
            gap: var(--foundation-space-4);
          }
          
          .footer-column-title {
            color: var(--primary-500);
            font-weight: var(--font-weight-medium);
            margin-bottom: var(--foundation-space-2);
            font-size: var(--foundation-typography-size-sm);
            text-transform: uppercase;
            letter-spacing: 0.05em;
          }
          
          .footer-links {
            display: flex;
            flex-direction: column;
            gap: var(--foundation-space-3);
          }
          
          .footer-link {
            color: var(--text-primary);
            text-decoration: none;
            font-size: var(--foundation-typography-size-sm);
            transition: color var(--foundation-motion-fast);
            cursor: pointer;
            width: fit-content;
          }
          
          .footer-link:hover {
            color: var(--primary-500);
            text-decoration: underline;
            text-decoration-thickness: 1px;
            text-underline-offset: 2px;
          }
          
          .social-icons {
            display: flex;
            gap: var(--foundation-space-4);
            margin-top: var(--foundation-space-2);
          }
          
          .social-icon {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 40px;
            height: 40px;
            border-radius: var(--radius-md);
            background-color: var(--surface-subtle);
            color: var(--text-primary);
            transition: all var(--foundation-motion-fast);
            cursor: pointer;
          }
          
          .social-icon:hover {
            background-color: var(--primary-500);
            color: white;
            transform: translateY(-2px);
          }
          
          .social-icon svg {
            width: 20px;
            height: 20px;
          }
          
          .footer-bottom {
            border-top: 1px solid var(--border-light);
            padding-top: var(--foundation-space-6);
            margin-top: var(--foundation-space-12);
          }
          
          .footer-copyright {
            color: var(--text-tertiary);
            font-size: var(--foundation-typography-size-xs);
            text-align: left;
          }
          
          @media (max-width: 768px) {
            .footer-brand {
              max-width: 100%;
            }
            
            .footer-column {
              gap: var(--foundation-space-3);
            }
            
            .footer-bottom {
              text-align: center;
            }
            
            .footer-copyright {
              text-align: center;
            }
          }
        `
      }} />
      
      <Section
        id={id}
        as="footer"
        style={{
          backgroundColor: 'var(--surface-muted)',
          paddingTop: 'var(--foundation-space-12)',
          paddingBottom: 'var(--foundation-space-8)'
        }}
      >
        <div className="pkl-footer-container">
          {/* Main Footer Content */}
          <Grid 
            columns={4} 
            gap="lg" 
            collapseOn="tablet"
            minItemWidth="200px"
          >
            {/* Column 1: Brand */}
            <div className="footer-brand">
              <div className="footer-logo">
                {logo || (
                  <Typography 
                    variant="h4" 
                    weight="semibold"
                    color="primary"
                    as="div"
                  >
                    {companyName}
                  </Typography>
                )}
              </div>
              <Typography 
                variant="body-sm"
                className="footer-description"
              >
                {description}
              </Typography>
            </div>
            
            {/* Column 2: Links */}
            <div className="footer-column">
              <div className="footer-column-title">Links</div>
              <div className="footer-links">
                {links.map((link, index) => (
                  <a 
                    key={index}
                    href={link.href}
                    className="footer-link"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
            
            {/* Column 3: Support */}
            <div className="footer-column">
              <div className="footer-column-title">Support</div>
              <div className="footer-links">
                {support.map((link, index) => (
                  <a 
                    key={index}
                    href={link.href}
                    className="footer-link"
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            </div>
            
            {/* Column 4: Connect */}
            <div className="footer-column">
              <div className="footer-column-title">Connect</div>
              <Typography 
                variant="body-sm"
                color="secondary"
                style={{ marginBottom: 'var(--foundation-space-2)' }}
              >
                Follow Us
              </Typography>
              <div className="social-icons">
                {social.map((socialLink, index) => (
                  <a
                    key={index}
                    href={socialLink.href}
                    className="social-icon"
                    aria-label={socialLink.name}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {socialLink.icon}
                  </a>
                ))}
              </div>
            </div>
          </Grid>
          
          {/* Bottom Bar */}
          <div className="footer-bottom">
            <Typography 
              variant="body-xs"
              className="footer-copyright"
            >
              {copyright}
            </Typography>
          </div>
        </div>
      </Section>
    </>
  );
};

PKLFooter.displayName = 'PKLFooter';
