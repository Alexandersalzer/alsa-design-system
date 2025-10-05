import React from 'react';
import { Button } from '../../../../../system/components/primitives/Button';
import { Typography } from '../../../../../system/components/primitives/Typography';
import { Container } from '../../../../../system/layout/frames/container/Container';
import { Section } from '../../../../../system/layout/frames/section/Section';
import { Linkedin, Instagram, Mail, Phone } from 'lucide-react';

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

export interface SocialLink {
  platform: 'linkedin' | 'instagram';
  href: string;
  icon: React.ReactNode;
}

export interface FooterSectionProps {
  id?: string;
  className?: string;
  
  // Company info
  companyName?: string;
  description?: string;
  
  // Footer columns
  columns?: FooterColumn[];
  
  // Contact info
  email?: string;
  phone?: string;
  
  // Social links
  socialLinks?: SocialLink[];
  
  // Copyright
  copyrightText?: string;
  poweredByText?: string;
}

// ===== DEFAULT DATA =====

const defaultColumns: FooterColumn[] = [
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
      { label: 'Om oss', href: '/about' },
      { label: 'Våra tjänster', href: '/services' },
      { label: 'Kundreferenser', href: '/references' },
      { label: 'Jobba med oss', href: '/careers' }
    ]
  },
  {
    title: 'Support',
    links: [
      { label: 'Vanliga frågor', href: '/faq' },
      { label: 'Kontakta oss', href: '/contact' },
      { label: 'Supportcenter', href: '/support' },
      { label: 'Tekniska frågor', href: '/technical' }
    ]
  }
];

const defaultSocialLinks: SocialLink[] = [
  {
    platform: 'linkedin',
    href: 'https://linkedin.com/company/blimpify-im',
    icon: <Linkedin size={20} />
  },
  {
    platform: 'instagram',
    href: 'https://instagram.com/blimpify_im',
    icon: <Instagram size={20} />
  }
];

// ===== MAIN FOOTER SECTION COMPONENT =====

export const FooterSection: React.FC<FooterSectionProps> = ({
  id = "footer",
  className,
  companyName = "Blimpify IM",
  description = "Vi bygger moderna hemsidor och digitala lösningar för företag inom skadeståndsrätt, juridik och servicebranscher.",
  columns = defaultColumns,
  email = "info@blimpify-im.com",
  phone = "+46 70-123 45 67",
  socialLinks = defaultSocialLinks,
  copyrightText,
  poweredByText = "Powered by Blimpify IM"
}) => {
  const currentYear = new Date().getFullYear();
  const finalCopyrightText = copyrightText || `© ${currentYear} ${companyName}. Alla rättigheter reserverade.`;

  return (
    <Section 
      id={id}
      as="footer"
      className={className}
      style={{
        backgroundColor: 'var(--surface-subtle)',
        borderTop: '1px solid var(--border-subtle)'
      }}
    >
      <Container maxWidth="xl" style={{ padding: 'var(--foundation-space-16) var(--foundation-space-6)' }}>
        {/* Main footer content */}
        <div 
          className="footer-grid"
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: 'var(--foundation-space-8)',
            marginBottom: 'var(--foundation-space-12)'
          }}
        >
          {/* Company info column */}
          <div style={{ gridColumn: '1 / -1' }}>
            <div style={{ marginBottom: 'var(--foundation-space-6)' }}>
              <Typography 
                variant="h2"
                weight="bold"
                style={{ 
                  color: 'var(--text-primary)',
                  fontSize: '1.5rem',
                  margin: 0
                }}
              >
                {companyName}
              </Typography>
            </div>
            <Typography 
              variant="body-md"
              style={{ 
                color: 'var(--text-secondary)',
                lineHeight: '1.6',
                maxWidth: '400px'
              }}
            >
              {description}
            </Typography>
          </div>

          {/* Links columns */}
          {columns.map((column, index) => (
            <div key={index} style={{ gridColumn: '1' }}>
              <Typography 
                variant="h4"
                weight="semibold"
                style={{ 
                  color: 'var(--text-primary)',
                  marginBottom: 'var(--foundation-space-4)',
                  fontSize: '1rem'
                }}
              >
                {column.title}
              </Typography>
              <nav>
                <ul style={{ 
                  listStyle: 'none', 
                  padding: 0, 
                  margin: 0,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 'var(--foundation-space-3)'
                }}>
                  {column.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href={link.href}
                        target={link.external ? '_blank' : undefined}
                        rel={link.external ? 'noopener noreferrer' : undefined}
                        style={{
                          color: 'var(--text-secondary)',
                          textDecoration: 'none',
                          fontSize: '0.875rem',
                          lineHeight: '1.5',
                          transition: 'color 0.2s ease',
                          display: 'inline-block'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.color = 'var(--text-primary)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.color = 'var(--text-secondary)';
                        }}
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          ))}

          {/* Social & Contact column */}
          <div style={{ gridColumn: '1' }}>
            <Typography 
              variant="h4"
              weight="semibold"
              style={{ 
                color: 'var(--text-primary)',
                marginBottom: 'var(--foundation-space-4)',
                fontSize: '1rem'
              }}
            >
              Kontakta oss
            </Typography>
            
            <div style={{ 
              display: 'flex',
              flexDirection: 'column',
              gap: 'var(--foundation-space-4)',
              marginBottom: 'var(--foundation-space-6)'
            }}>
              {/* Email */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--foundation-space-3)' }}>
                <Mail size={16} style={{ color: 'var(--text-secondary)' }} />
                <a
                  href={`mailto:${email}`}
                  style={{
                    color: 'var(--text-secondary)',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }}
                >
                  {email}
                </a>
              </div>

              {/* Phone */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--foundation-space-3)' }}>
                <Phone size={16} style={{ color: 'var(--text-secondary)' }} />
                <a
                  href={`tel:${phone}`}
                  style={{
                    color: 'var(--text-secondary)',
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    transition: 'color 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = 'var(--text-primary)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--text-secondary)';
                  }}
                >
                  {phone}
                </a>
              </div>
            </div>

            {/* Social links */}
            <div>
              <Typography 
                variant="h4"
                weight="semibold"
                style={{ 
                  color: 'var(--text-primary)',
                  marginBottom: 'var(--foundation-space-4)',
                  fontSize: '1rem'
                }}
              >
                Följ oss
              </Typography>
              <div style={{ 
                display: 'flex',
                gap: 'var(--foundation-space-3)'
              }}>
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '40px',
                      height: '40px',
                      borderRadius: 'var(--radius-md)',
                      backgroundColor: 'var(--surface-primary)',
                      color: 'var(--text-secondary)',
                      textDecoration: 'none',
                      transition: 'all 0.2s ease',
                      border: '1px solid var(--border-subtle)'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--surface-secondary)';
                      e.currentTarget.style.color = 'var(--text-primary)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = 'var(--surface-primary)';
                      e.currentTarget.style.color = 'var(--text-secondary)';
                    }}
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: '1px solid var(--border-subtle)',
          paddingTop: 'var(--foundation-space-6)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--foundation-space-4)',
          alignItems: 'center',
          textAlign: 'center'
        }}>
          <Typography 
            variant="body-sm"
            style={{ 
              color: 'var(--text-secondary)',
              margin: 0
            }}
          >
            {finalCopyrightText}
          </Typography>
          <Typography 
            variant="body-xs"
            style={{ 
              color: 'var(--text-tertiary)',
              margin: 0
            }}
          >
            {poweredByText}
          </Typography>
        </div>
      </Container>

      {/* Responsive styles */}
      <style>{`
        @media (min-width: 768px) {
          .footer-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        
        @media (min-width: 1024px) {
          .footer-grid {
            grid-template-columns: 2fr 1fr 1fr 1fr 1fr !important;
          }
        }
      `}</style>
    </Section>
  );
};
