// ===============================================
// design/system/components/patterns/client/FooterSection/FooterSection.tsx
// MODERN FOOTER COMPONENT - Built with Blimpify Design System
// ===============================================

import React from 'react';
import { MailIcon, PhoneIcon, LinkedinIcon, InstagramIcon } from 'lucide-react';
import { Section } from '../../../../layout/frames/section/Section';
import { Container } from '../../../../layout/frames/container/Container';
import { Stack } from '../../../../layout/utilities/stack/Stack';
import { Typography } from '../../../primitives/Typography';
import { TextLink } from '../../../primitives/TextLink';
import { Icon } from '../../../primitives/Icon';
import { Logo } from '../../../primitives/Logo';
import { Button } from '../../../primitives/Button';
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
}

// ===== MAIN FOOTER COMPONENT =====

export const FooterSection: React.FC<FooterSectionProps> = ({
  id = "footer",
  className,
  companyName = "Jaksenvest Global AB",
  companyDescription = "Vi hjälper dig att få den ersättning du förtjänar. Professionell juridisk rådgivning för skadeståndsärenden.",
  columns = [
    {
      title: "Tjänster",
      links: [
        { label: "Skadeståndsberäkning", href: "#tjanster" },
        { label: "Juridisk rådgivning", href: "#tjanster" },
        { label: "Kostnadsfri konsultation", href: "#contact" },
        { label: "No Win, No Fee", href: "#stats" }
      ]
    },
    {
      title: "Juridiskt",
      links: [
        { label: "Integritetspolicy", href: "#" },
        { label: "Användarvillkor", href: "#" },
        { label: "Cookie-policy", href: "#" },
        { label: "Om oss", href: "#om-oss" }
      ]
    },
    {
      title: "Support",
      links: [
        { label: "Vanliga frågor", href: "#faq" },
        { label: "Kontakta oss", href: "#contact" }
      ]
    }
  ],
  email = "kontakt@jaksenvest.se",
  phone = "08-123 456 78",
  socialLinks = [
    {
      platform: "linkedin",
      href: "https://linkedin.com/company/jaksenvest-global-ab",
      icon: <Icon size="sm" color="secondary"><LinkedinIcon /></Icon>
    },
    {
      platform: "instagram", 
      href: "https://instagram.com/jaksenvest_global",
      icon: <Icon size="sm" color="secondary"><InstagramIcon /></Icon>
    }
  ],
  ctaTitle = "Behöver du hjälp?",
  ctaDescription = "Kontakta oss idag för kostnadsfri konsultation och få hjälp med ditt skadeståndsärende.",
  ctaButtonText = "Boka konsultation",
  ctaButtonHref = "#contact",
  copyrightText,
  poweredByText = "Powered by Blimpify IM"
}) => {
  const currentYear = new Date().getFullYear();
  const defaultCopyright = `© ${currentYear} ${companyName}. Alla rättigheter reserverade.`;

  return (
    <Section 
      id={id}
      as="footer"
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
        <div 
          style={{
            background: 'var(--surface-primary)',
            borderRadius: 'var(--radius-lg)',
            padding: 'var(--foundation-space-8)',
            boxShadow: 'var(--shadow-md)',
            border: '1px solid var(--border-subtle)',
            position: 'relative',
            overflow: 'hidden'
          }}
        >
          {/* Background Image with Fade */}
          <div 
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '200px',
              backgroundImage: 'url("/images/footer-bg.jpg")',
              backgroundSize: 'cover',
              backgroundPosition: 'center bottom',
              backgroundRepeat: 'no-repeat',
              maskImage: 'linear-gradient(to top, black 0%, transparent 100%)',
              WebkitMaskImage: 'linear-gradient(to top, black 0%, transparent 100%)',
              opacity: 0.3,
              zIndex: 1
            }}
          />
          <div style={{ position: 'relative', zIndex: 2 }}>
            <Stack spacing="xl" align="start">
          
          {/* Main Content Grid */}
          <div className="footer-main-content">
            <div 
              style={{ 
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: 'var(--foundation-space-xl)',
                width: '100%'
              }}
            >
              
              {/* Column 1: Company Info */}
              <div style={{ maxWidth: '280px' }}>
                <Stack spacing="md" align="start">
                  <Logo 
                    src="/logos/blimpify-logo.svg" 
                    alt="Blimpify Logo" 
                    size="md"
                  />
                  <Typography 
                    variant="body-sm"
                    color="secondary"
                    style={{ 
                      lineHeight: '1.6',
                      maxWidth: '280px'
                    }}
                  >
                    {companyDescription}
                  </Typography>
                </Stack>
              </div>
              
              {/* Columns 2-4: Navigation Links */}
              {columns.map((column, index) => (
                <div key={index}>
                  <Stack spacing="md" align="start">
                    <Typography 
                      variant="h3" 
                      weight="semibold"
                      color="primary"
                      style={{ margin: 0, fontSize: '1rem' }}
                    >
                      {column.title}
                    </Typography>
                  
                  <Stack spacing="sm" align="start">
                    {column.links.map((link, linkIndex) => (
                      <TextLink
                        key={linkIndex}
                        href={link.href}
                        variant="secondary"
                        style={{
                          fontSize: 'var(--foundation-typography-font-size-body-sm)',
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
                  </Stack>
                  </Stack>
                </div>
              ))}
              
              {/* Column 5: Contact & Social */}
              <div>
                <Stack spacing="md" align="start">
                  <Typography 
                    variant="h3" 
                    weight="semibold"
                    color="primary"
                    style={{ margin: 0, fontSize: '1rem' }}
                  >
                    Kontakt
                  </Typography>
                
                  <Stack spacing="sm" align="start">
                    {/* Email */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--foundation-space-sm)' }}>
                      <Icon size="sm" color="secondary"><MailIcon /></Icon>
                      <TextLink
                        href={`mailto:${email}`}
                        variant="secondary"
                        style={{
                          fontSize: 'var(--foundation-typography-font-size-body-sm)',
                          color: 'var(--text-secondary)',
                          textDecoration: 'none'
                        }}
                      >
                        {email}
                      </TextLink>
                    </div>
                    
                    {/* Phone */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--foundation-space-sm)' }}>
                      <Icon size="sm" color="secondary"><PhoneIcon /></Icon>
                      <TextLink
                        href={`tel:${phone}`}
                        variant="secondary"
                        style={{
                          fontSize: 'var(--foundation-typography-font-size-body-sm)',
                          color: 'var(--text-secondary)',
                          textDecoration: 'none'
                        }}
                      >
                        {phone}
                      </TextLink>
                    </div>
                  
                    {/* Social Links */}
                    <div style={{ marginTop: 'var(--foundation-space-md)' }}>
                      <Stack spacing="sm" align="start">
                        <Typography 
                          variant="body-sm"
                          weight="semibold"
                          color="primary"
                          style={{ margin: 0 }}
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
                      </Stack>
                    </div>
                  </Stack>
                </Stack>
              </div>
              
            </div>
          </div>
          
          {/* CTA Section */}
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
                <Typography 
                  variant="h3" 
                  weight="bold"
                  color="primary"
                  style={{ margin: 0, marginBottom: 'var(--foundation-space-sm)' }}
                >
                  {ctaTitle}
                </Typography>
                
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
              </div>
              
              <div style={{ flexShrink: 0 }}>
                <Button 
                  variant="primary"
                  size="lg"
                  onClick={() => {
                    if (ctaButtonHref) {
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
                    }
                  }}
                >
                  {ctaButtonText}
                </Button>
              </div>
            </div>
          </div>
          
          {/* Bottom Bar */}
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
              <Typography 
                variant="body-sm"
                color="secondary"
                style={{ margin: 0 }}
              >
                {copyrightText || defaultCopyright}
              </Typography>
              
              <Typography 
                variant="body-sm"
                color="secondary"
                style={{ margin: 0 }}
              >
                {poweredByText}
              </Typography>
            </div>
          </div>

            </Stack>
          </div>
        </div>
      </div>
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
