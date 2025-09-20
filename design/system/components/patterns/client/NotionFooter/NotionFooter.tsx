'use client';

import { Typography } from '../../../../../system/components/primitives/Typography';
import { Button } from '../../../../../system/components/primitives/Button';
import { Icon } from '../../../../../system/components/primitives/Icon';
import { Stack } from '../../../../../system/layout/utilities/stack/Stack';
import { Cluster } from '../../../../../system/layout/utilities/cluster/Cluster';
import { Rhythm, RhythmItem } from '../../../../../system/layout/utilities/rhythm/Rhythm';
import { 
  PhoneIcon, 
  EnvelopeIcon, 
  MapPinIcon, 
  ArrowRightIcon 
} from '@heroicons/react/24/outline';

interface FooterLink {
  label: string;
  href: string;
}

interface FooterSection {
  title: string;
  links: FooterLink[];
}

interface NotionFooterContent {
  companyName: string;
  companyDescription: string;
  phone: string;
  email: string;
  address: string;
  services: FooterSection;
  legal: FooterSection;
  ctaText: string;
  ctaHref: string;
  copyright: string;
}

interface NotionFooterProps {
  // Editing mode passed from parent component
  isEditingMode?: boolean;
  // Content from CMS - required
  content: NotionFooterContent;
}

const NotionFooter = ({ isEditingMode = false, content }: NotionFooterProps) => {
  // Extract content from props - no defaults, all values must be provided
  const {
    companyName,
    companyDescription,
    phone,
    email,
    address,
    services,
    legal,
    ctaText,
    ctaHref,
    copyright
  } = content;

  return (
    <footer className="notion-footer" style={{ 
      background: 'var(--surface-default)',
      borderTop: '1px solid var(--border-subtle)',
      padding: 'var(--foundation-space-16, 4rem) 0 var(--foundation-space-8, 2rem) 0'
    }}>
      <div style={{
        width: '95%',
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '0 var(--foundation-space-8, 2rem)'
      }}>
        
        <Rhythm unit="lg" align="start" direction="column">
          
          {/* Main Footer Content */}
          <RhythmItem at={1}>
            <div className="footer-grid" style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: 'var(--foundation-space-12, 3rem)'
            }}>
              
              {/* Company Info */}
              <div style={{ maxWidth: '320px' }}>
                <Stack spacing="lg">
                  <Typography 
                    variant="h4" 
                    weight="bold" 
                    color="heading"
                    style={{ fontSize: 'var(--foundation-typography-size-lg, 1.5rem)' }}
                  >
                    {companyName}
                  </Typography>
                  <Typography 
                    variant="body-md" 
                    color="secondary" 
                    style={{ 
                      lineHeight: 'var(--foundation-typography-line-height-relaxed, 1.6)',
                      fontSize: 'var(--foundation-typography-size-sm, 0.95rem)'
                    }}
                  >
                    {companyDescription}
                  </Typography>
                  
                  {/* Contact Info */}
                  <Stack spacing="sm">
                    <Cluster spacing="sm" align="center">
                      <Icon color="secondary" style={{ width: '16px', height: '16px' }}>
                        <PhoneIcon />
                      </Icon>
                      <Typography variant="body-sm" color="secondary">
                        {phone}
                      </Typography>
                    </Cluster>
                    <Cluster spacing="sm" align="center">
                      <Icon color="secondary" style={{ width: '16px', height: '16px' }}>
                        <EnvelopeIcon />
                      </Icon>
                      <Typography variant="body-sm" color="secondary">
                        {email}
                      </Typography>
                    </Cluster>
                    <Cluster spacing="sm" align="center">
                      <Icon color="secondary" style={{ width: '16px', height: '16px' }}>
                        <MapPinIcon />
                      </Icon>
                      <Typography variant="body-sm" color="secondary">
                        {address}
                      </Typography>
                    </Cluster>
                  </Stack>
                </Stack>
              </div>
              
              {/* Services */}
              <div>
                <Stack spacing="lg">
                  <Typography 
                    variant="body-md" 
                    weight="semibold" 
                    color="heading"
                    style={{ 
                      fontSize: 'var(--foundation-typography-size-sm, 0.9rem)',
                      letterSpacing: 'var(--foundation-typography-letter-spacing-wide, 0.025em)'
                    }}
                  >
                    {services.title}
                  </Typography>
                  <Stack spacing="sm">
                    {services.links.map((link, index) => (
                      <a 
                        key={index}
                        href={link.href} 
                        style={{
                          color: 'var(--text-secondary)',
                          textDecoration: 'none',
                          fontSize: 'var(--foundation-typography-size-sm, 0.9rem)',
                          transition: 'color var(--foundation-motion-duration-fast, 0.2s) ease',
                          lineHeight: 'var(--foundation-typography-line-height-normal, 1.4)'
                        }}
                        onMouseEnter={(e) => (e.target as HTMLElement).style.color = 'var(--text-primary)'}
                        onMouseLeave={(e) => (e.target as HTMLElement).style.color = 'var(--text-secondary)'}
                      >
                        {link.label}
                      </a>
                    ))}
                  </Stack>
                </Stack>
              </div>
              
              {/* Legal */}
              <div>
                <Stack spacing="lg">
                  <Typography 
                    variant="body-md" 
                    weight="semibold" 
                    color="heading"
                    style={{ 
                      fontSize: 'var(--foundation-typography-size-sm, 0.9rem)',
                      letterSpacing: 'var(--foundation-typography-letter-spacing-wide, 0.025em)'
                    }}
                  >
                    {legal.title}
                  </Typography>
                  <Stack spacing="sm">
                    {legal.links.map((link, index) => (
                      <a 
                        key={index}
                        href={link.href} 
                        style={{
                          color: 'var(--text-secondary)',
                          textDecoration: 'none',
                          fontSize: 'var(--foundation-typography-size-sm, 0.9rem)',
                          transition: 'color var(--foundation-motion-duration-fast, 0.2s) ease',
                          lineHeight: 'var(--foundation-typography-line-height-normal, 1.4)'
                        }}
                        onMouseEnter={(e) => (e.target as HTMLElement).style.color = 'var(--text-primary)'}
                        onMouseLeave={(e) => (e.target as HTMLElement).style.color = 'var(--text-secondary)'}
                      >
                        {link.label}
                      </a>
                    ))}
                  </Stack>
                </Stack>
              </div>
            </div>
          </RhythmItem>
          
          {/* Bottom Section */}
          <RhythmItem at={3}>
            <div className="footer-bottom" style={{
              borderTop: '1px solid var(--border-subtle)',
              paddingTop: 'var(--foundation-space-8, 2rem)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 'var(--foundation-space-4, 1rem)'
            }}>
              
              {/* Copyright */}
              <Cluster spacing="md" align="center">
                <Typography variant="body-sm" color="tertiary">
                  {copyright}
                </Typography>
                <div style={{
                  width: '4px',
                  height: '4px',
                  borderRadius: '50%',
                  background: 'var(--text-tertiary)'
                }} />
                <Typography variant="body-sm" color="tertiary">
                  Alla rättigheter förbehållna
                </Typography>
              </Cluster>
              
              {/* CTA Button */}
              <Button 
                variant="accent" 
                size="sm"
                rightIcon={<Icon color="inverse"><ArrowRightIcon /></Icon>}
                style={{ 
                  fontSize: 'var(--foundation-typography-size-sm, 0.875rem)',
                  color: 'white'
                }}
                onClick={() => window.location.href = ctaHref}
              >
                {ctaText}
              </Button>
            </div>
          </RhythmItem>
          
        </Rhythm>
      </div>
    </footer>
  );
};

export { NotionFooter };
