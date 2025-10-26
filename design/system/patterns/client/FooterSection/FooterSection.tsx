// ===============================================
// design/system/components/patterns/client/FooterSection/FooterSection.tsx
// MODERN FOOTER COMPONENT - Built with Blimpify Design System
// ===============================================

import React from 'react';
import { Section } from '../../../components';
import { VStack } from '../../../components/layout';
import { Typography } from '../../../components/primitives/Typography';
import { TextLink } from '../../../components';
import { Icon } from '../../../components/primitives/media';
import { Button } from '../../../components';
import './FooterSection.css';

// ===== TYPE DEFINITIONS =====

export interface FooterLink {
  label: string;
  href: string;
  external?: boolean;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export interface FooterSectionProps {
  id?: string;
  className?: string;
  
  // Company info
  companyName?: string;
  companyDescription?: string;
  
  // Columns
  columns?: FooterColumn[];
  
  // Contact info
  email?: string;
  phone?: string;
  
  // Social links
  socialLinks?: Array<{
    platform: string;
    href: string;
    icon: React.ReactNode;
  }>;
  
  // CTA Section
  ctaTitle?: string;
  ctaDescription?: string;
  ctaButtonText?: string;
  ctaButtonHref?: string;
  
  // Bottom bar
  copyrightText?: string;
  poweredByText?: string;
  
  // Background image
  backgroundImageUrl?: string;
}

// ===== MAIN FOOTER COMPONENT =====

export const FooterSection: React.FC<FooterSectionProps> = ({
  id = "footer",
  className,
  companyName,
  companyDescription,
  columns = [],
  email,
  phone,
  socialLinks = [],
  ctaTitle,
  ctaDescription,
  ctaButtonText,
  ctaButtonHref,
  copyrightText,
  poweredByText,
  backgroundImageUrl
}) => {
  const currentYear = new Date().getFullYear();
  const defaultCopyright = `© ${currentYear} ${companyName}. Alla rättigheter reserverade.`;

  return (
    <Section 
      id={id}
      className={`footer-section ${className || ''}`}
      style={{
        backgroundColor: 'var(--surface-default)',
        paddingTop: 'var(--foundation-space-24)',
        paddingBottom: 'var(--foundation-space-16)'
      }}
    >
      <div style={{ 
        maxWidth: 'var(--size-page-max-width)',
        margin: '0 auto',
        padding: '0 var(--foundation-space-6)'
      }}>
        <div style={{ 
          background: 'var(--surface-primary)',
          borderRadius: 'var(--radius-lg)',
          padding: 'var(--foundation-space-8)',
          boxShadow: 'var(--shadow-md)',
          border: '1px solid var(--border-subtle)',
          position: 'relative',
          overflow: 'hidden'
        }}>
          {/* Background Image with Fade */}
          {backgroundImageUrl && (
            <div 
              style={{
                position: 'absolute',
                bottom: 0,
                left: 0,
                right: 0,
                height: '300px',
                backgroundImage: `url("${backgroundImageUrl}")`,
                backgroundSize: 'cover',
                backgroundPosition: 'center bottom',
                backgroundRepeat: 'no-repeat',
                maskImage: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
                WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 50%, transparent 100%)',
                opacity: 0.4,
                zIndex: 1
              }}
            />
          )}
          <div style={{ position: 'relative', zIndex: 2 }}>
            <VStack spacing="xl" align="start">
          
          {/* Main Content Grid */}
          <div className="footer-main-content">
            <div 
              style={{ 
                display: 'flex',
                flexDirection: 'row',
                gap: 'var(--foundation-space-xl)',
                width: '100%',
                flexWrap: 'wrap',
                alignItems: 'flex-start'
              }}
            >
              
              {/* Column 1: Company Info */}
              {(companyName || companyDescription) && (
                <div style={{ flex: '1', minWidth: '280px' }}>
                  <VStack spacing="md" align="start">
                    {companyName && (
                      <Typography
                        variant="h3"
                        weight="bold"
                        color="primary"
                        style={{
                          margin: 0,
                          fontSize: '1.25rem'
                        }}
                      >
                        {companyName}
                      </Typography>
                    )}
                    {companyDescription && (
                      <Typography 
                        variant="body-xs"
                        color="secondary"
                        style={{
                          lineHeight: '1.5',
                          maxWidth: '280px',
                          fontSize: '0.75rem'
                        }}
                      >
                        {companyDescription}
                      </Typography>
                    )}
                  </VStack>
                </div>
              )}
              
              {/* Columns 2-4: Navigation Links */}
              {columns.map((column, index) => (
                <div key={index} style={{ flex: '1', minWidth: '200px' }}>
                  <VStack spacing="sm" align="start">
                               <Typography
                                 variant="h4"
                                 weight="semibold"
                                 color="primary"
                                 style={{ margin: 0, fontSize: '0.75rem' }}
                               >
                                 {column.title}
                               </Typography>
                    
                    {column.links.map((link, linkIndex) => (
                      <TextLink
                        key={linkIndex}
                        href={link.href}
                        variant="secondary"
                        style={{
                          fontSize: '0.65rem',
                          color: 'var(--text-secondary)',
                          textDecoration: 'none',
                          transition: 'color 0.2s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = 'var(--text-primary)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = 'var(--text-secondary)';
                        }}
                      >
                        {link.label}
                      </TextLink>
                    ))}
                  </VStack>
                </div>
              ))}
              
              {/* Column 5: Social Links Only */}
              {socialLinks.length > 0 && (
                <div style={{ flex: '1', minWidth: '200px' }}>
                  <VStack spacing="sm" align="start">
                    <Typography
                      variant="body-xs"
                      weight="semibold"
                      color="primary"
                      style={{ margin: 0, fontSize: '0.65rem' }}
                    >
                      Följ oss
                    </Typography>

                    <div style={{ display: 'flex', gap: 'var(--foundation-space-md)', alignItems: 'center' }}>
                      {socialLinks.map((social, index) => (
                        <TextLink
                          key={index}
                          href={social.href}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '32px',
                            height: '32px',
                            borderRadius: 'var(--radius-md)',
                            backgroundColor: 'var(--surface-subtle)',
                            transition: 'all 0.2s ease',
                            textDecoration: 'none'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--surface-secondary)';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'var(--surface-subtle)';
                            e.currentTarget.style.transform = 'translateY(0)';
                          }}
                        >
                          {social.icon}
                        </TextLink>
                      ))}
                    </div>
                  </VStack>
                </div>
              )}
              
            </div>
          </div>
          
          {/* CTA Section */}
          {(ctaTitle || ctaDescription || ctaButtonText) && (
            <div className="footer-cta-section" style={{ width: '100%', marginTop: 'var(--foundation-space-24)' }}>
              <div 
                style={{
                  background: 'var(--surface-primary)',
                  borderRadius: 'var(--radius-lg)',
                  padding: 'var(--foundation-space-8)',
                  boxShadow: 'var(--shadow-md)',
                  border: '1px solid var(--border-subtle)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: 'var(--foundation-space-8)',
                  flexWrap: 'wrap'
                }}
              >
                <div style={{ flex: 1, minWidth: '300px' }}>
                  {ctaTitle && (
                    <Typography 
                      variant="h3" 
                      weight="bold"
                      color="primary"
                      style={{ margin: 0, marginBottom: 'var(--foundation-space-sm)' }}
                    >
                      {ctaTitle}
                    </Typography>
                  )}
                  
                  {ctaDescription && (
                    <Typography 
                      variant="body-md"
                      color="secondary"
                      style={{ 
                        margin: 0,
                        lineHeight: '1.6'
                      }}
                    >
                      {ctaDescription}
                    </Typography>
                  )}
                </div>
                
                {ctaButtonText && ctaButtonHref && (
                  <div style={{ flexShrink: 0 }}>
                    <Button 
                      variant="primary"
                      size="lg"
                      onClick={() => {
                        if (ctaButtonHref.startsWith('#')) {
                          // Scroll to section
                          const element = document.querySelector(ctaButtonHref);
                          if (element) {
                            element.scrollIntoView({ behavior: 'smooth' });
                          }
                        } else {
                          // Navigate to page
                          window.location.href = ctaButtonHref;
                        }
                      }}
                    >
                      {ctaButtonText}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Bottom Bar */}
          {(copyrightText || poweredByText || companyName) && (
            <div className="footer-bottom-bar" style={{ width: '100%' }}>
              {/* Divider */}
              <div 
                style={{
                  height: '1px',
                  backgroundColor: 'var(--border-subtle)',
                  marginBottom: 'var(--foundation-space-lg)'
                }}
              />
              
              {/* Bottom Content */}
              <div style={{ 
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                flexWrap: 'wrap',
                gap: 'var(--foundation-space-md)'
              }}>
                {(copyrightText || companyName) && (
                  <Typography 
                    variant="body-sm"
                    color="secondary"
                    style={{ margin: 0 }}
                  >
                    {copyrightText || defaultCopyright}
                  </Typography>
                )}
                
                {poweredByText && (
                  <Typography 
                    variant="body-sm"
                    color="secondary"
                    style={{ margin: 0 }}
                  >
                    {poweredByText}
                  </Typography>
                )}
              </div>
            </div>
          )}

            </VStack>
          </div> {/* End of z-index 2 wrapper */}
        </div> {/* End of card wrapper */}
      </div> {/* End of outer padding div */}
    </Section>
  );
};

FooterSection.displayName = 'FooterSection';

// ===== USAGE EXAMPLE =====
/*
<FooterSection 
  companyName="Jaksenvest Global AB"
  companyDescription="Vi hjälper dig att få den ersättning du förtjänar. Professionell juridisk rådgivning för skadeståndsärenden."
  email="kontakt@jaksenvest.se"
  phone="08-123 456 78"
  columns={[
    {
      title: 'Juridik',
      links: [
        { label: 'Integritetspolicy', href: '/privacy' },
        { label: 'Användarvillkor', href: '/terms' },
        { label: 'Cookiepolicy', href: '/cookies' },
        { label: 'GDPR & Datahantering', href: '/gdpr' }
      ]
    },
    {
      title: 'Företaget',
      links: [
        { label: 'Om oss', href: '#om-oss' },
        { label: 'Våra tjänster', href: '#features' },
        { label: 'Kundreferenser', href: '#testimonials' },
        { label: 'Jobba med oss', href: '/careers' }
      ]
    },
    {
      title: 'Support',
      links: [
        { label: 'Vanliga frågor', href: '#faq' },
        { label: 'Kontakta oss', href: '#contact' },
        { label: 'Supportcenter', href: '/support' },
        { label: 'Tekniska frågor', href: '/technical' }
      ]
    }
  ]}
  socialLinks={[
    {
      platform: 'linkedin',
      href: 'https://linkedin.com/company/jaksenvest-global-ab',
      icon: <Icon name="linkedin" size="sm" color="text-secondary" />
    },
    {
      platform: 'instagram',
      href: 'https://instagram.com/jaksenvest_global',
      icon: <Icon name="instagram" size="sm" color="text-secondary" />
    }
  ]}
  copyrightText="© 2024 Jaksenvest Global AB. Alla rättigheter reserverade."
  poweredByText="Powered by Blimpify IM"
/>
*/
