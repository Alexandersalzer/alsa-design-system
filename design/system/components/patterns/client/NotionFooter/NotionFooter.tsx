'use client';

import { Typography } from '../../../../../system/components/primitives/Typography';
import { Button } from '../../../../../system/components/primitives/Button';
import { Icon } from '../../../../../system/components/primitives/Icon';
import { TextLink } from '../../../../../system/components/primitives/TextLink';
import { Container } from '../../../../../system/layout/frames/container/Container';
import { Grid } from '../../../../../system/layout/utilities/grid/Grid';
import { Stack } from '../../../../../system/layout/utilities/stack/Stack';
import { Cluster } from '../../../../../system/layout/utilities/cluster/Cluster';
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
}

const NotionFooter = ({ content }: NotionFooterProps) => {
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
      <Container maxWidth="xl" align="center">
        <Stack spacing="xl">
          {/* Top grid - using Grid utility with responsive behavior */}
          <Grid 
            columns={3} 
            minItemWidth="250px" 
            gap="xl"
            collapseOn="mobile"
          >
            {/* Company */}
            <section aria-label="Företagsinformation">
              <Stack spacing="md" align="start">
                <Typography 
                  variant="h4" 
                  weight="bold" 
                  color="heading"
                  style={{ textAlign: 'left' }}
                >
                  {companyName}
                </Typography>

                <Typography 
                  variant="body-md" 
                  color="secondary"
                  style={{ textAlign: 'left' }}
                >
                  {companyDescription}
                </Typography>

                <Stack spacing="sm" align="start">
                  <Cluster spacing="sm" align="start">
                    <Icon color="secondary" size="sm">
                      <PhoneIcon />
                    </Icon>
                    <Typography variant="body-sm" color="secondary">
                      {phone}
                    </Typography>
                  </Cluster>
                  
                  <Cluster spacing="sm" align="start">
                    <Icon color="secondary" size="sm">
                      <EnvelopeIcon />
                    </Icon>
                    <Typography variant="body-sm" color="secondary">
                      {email}
                    </Typography>
                  </Cluster>
                  
                  <Cluster spacing="sm" align="start">
                    <Icon color="secondary" size="sm">
                      <MapPinIcon />
                    </Icon>
                    <Typography variant="body-sm" color="secondary">
                      {address}
                    </Typography>
                  </Cluster>
                </Stack>
              </Stack>
            </section>

            {/* Services */}
            <nav aria-label={services.title}>
              <Stack spacing="md" align="start">
                <Typography variant="body-md" weight="semibold" color="heading">
                  {services.title}
                </Typography>
                
                <Stack spacing="sm" align="start">
                  {services.links.map((link, index) => (
                    <TextLink 
                      key={index}
                      href={link.href}
                      variant="secondary"
                      size="sm"
                      underline="hover"
                    >
                      {link.label}
                    </TextLink>
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
                  {legal.links.map((link, index) => (
                    <TextLink 
                      key={index}
                      href={link.href}
                      variant="secondary"
                      size="sm"
                      underline="hover"
                    >
                      {link.label}
                    </TextLink>
                  ))}
                </Stack>
              </Stack>
            </nav>
          </Grid>

          {/* Bottom row */}
          <Cluster justify="between" align="center" wrap>
            <Cluster spacing="sm" align="center">
              <Typography variant="body-sm" color="tertiary">
                {copyright}
              </Typography>
              <Typography variant="body-sm" color="tertiary">
                •
              </Typography>
              <Typography variant="body-sm" color="tertiary">
                Alla rättigheter förbehållna
              </Typography>
            </Cluster>

            <Button
              variant="accent"
              color="secondary"
              size="sm"
              rightIcon={<Icon color="inverse" size="sm"><ArrowRightIcon /></Icon>}
              onClick={() => (window.location.href = ctaHref)}
            >
              {ctaText}
            </Button>
          </Cluster>
        </Stack>
      </Container>
    </footer>
  );
};

export { NotionFooter };