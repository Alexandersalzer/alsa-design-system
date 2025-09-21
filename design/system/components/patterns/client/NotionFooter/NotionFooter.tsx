'use client';

import { Typography } from '../../../../../system/components/primitives/Typography';
import { Button } from '../../../../../system/components/primitives/Button';
import { Icon } from '../../../../../system/components/primitives/Icon';
import { Container } from '../../../../../system/layout/frames/container/Container';
import { Stack } from '../../../../../system/layout/utilities/stack/Stack';
import { Cluster } from '../../../../../system/layout/utilities/cluster/Cluster';
import { Rhythm, RhythmItem } from '../../../../../system/layout/utilities/rhythm/Rhythm';
import {
  PhoneIcon,
  EnvelopeIcon,
  MapPinIcon,
  ArrowRightIcon,
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
  content: NotionFooterContent;
  // Editing mode passed from parent component
  isEditingMode?: boolean;
}

const NotionFooter = ({ content, isEditingMode = false }: NotionFooterProps) => {
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
    copyright,
  } = content;

  return (
    <footer 
      role="contentinfo" 
      aria-label="Sidfot"
      style={{
        background: 'var(--surface-default, #0b0b0c)',
        borderTop: '1px solid var(--border-subtle, rgba(255,255,255,0.08))',
        padding: 'var(--foundation-space-16, 4rem) 0 var(--foundation-space-8, 2rem)'
      }}
    >
      <Container maxWidth="lg">
        <Rhythm unit="lg" direction="column">
          {/* Top content */}
          <RhythmItem at={1}>
            <Stack spacing="lg" align="start">
              {/* Company */}
              <Stack spacing="md" align="start">
                <Typography variant="h4" weight="bold" color="heading">
                  {companyName}
                </Typography>

                <Typography variant="body-md" color="secondary">
                  {companyDescription}
                </Typography>

                <Stack spacing="sm" align="start">
                  <Cluster spacing="sm" align="center">
                    <Icon color="secondary"><PhoneIcon /></Icon>
                    <Typography variant="body-sm" color="secondary">{phone}</Typography>
                  </Cluster>
                  <Cluster spacing="sm" align="center">
                    <Icon color="secondary"><EnvelopeIcon /></Icon>
                    <Typography variant="body-sm" color="secondary">{email}</Typography>
                  </Cluster>
                  <Cluster spacing="sm" align="center">
                    <Icon color="secondary"><MapPinIcon /></Icon>
                    <Typography variant="body-sm" color="secondary">{address}</Typography>
                  </Cluster>
                </Stack>
              </Stack>

              {/* Services and Legal in a row */}
              <div style={{ display: 'flex', flexDirection: 'row', gap: 'var(--foundation-space-12, 3rem)' }}>
                {/* Services */}
                <nav aria-label={services.title}>
                  <Stack spacing="md" align="start">
                    <Typography variant="body-md" weight="semibold" color="heading">
                      {services.title}
                    </Typography>
                    <Stack spacing="sm" align="start">
                      {services.links.map((link, i) => (
                        <a 
                          key={i}
                          href={link.href}
                          style={{ 
                            textDecoration: 'none',
                            color: 'var(--text-secondary)',
                            fontSize: 'var(--font-body-sm-size)'
                          }}
                        >
                          {link.label}
                        </a>
                      ))}
                    </Stack>
                  </Stack>
                </nav>

                {/* Legal */}
                <nav aria-label={legal.title}>
                  <Stack spacing="md" align="start">
                    <Typography variant="body-md" weight="semibold" color="heading">
                      {legal.title}
                    </Typography>
                    <Stack spacing="sm" align="start">
                      {legal.links.map((link, i) => (
                        <a 
                          key={i}
                          href={link.href}
                          style={{ 
                            textDecoration: 'none',
                            color: 'var(--text-secondary)',
                            fontSize: 'var(--font-body-sm-size)'
                          }}
                        >
                          {link.label}
                        </a>
                      ))}
                    </Stack>
                  </Stack>
                </nav>
              </div>
            </Stack>
          </RhythmItem>

          {/* Bottom row */}
          <RhythmItem at={3}>
            <Cluster spacing="md" align="center" justify="between">
              <Cluster spacing="sm" align="center">
                <Typography variant="body-sm" color="tertiary">{copyright}</Typography>
                <span style={{ color: 'var(--text-tertiary)', fontSize: '0.5rem' }} aria-hidden="true">•</span>
                <Typography variant="body-sm" color="tertiary">Alla rättigheter förbehållna</Typography>
              </Cluster>

              <Button
                variant="accent"
                size="sm"
                rightIcon={<Icon color="inverse"><ArrowRightIcon /></Icon>}
                onClick={() => (window.location.href = ctaHref)}
              >
                {ctaText}
              </Button>
            </Cluster>
          </RhythmItem>
        </Rhythm>
      </Container>
    </footer>
  );
};

export { NotionFooter };
