'use client';

import { Typography } from '../../../../system/components';
import { Button } from '../../../../system/components';
import { Icon } from '../../../../system/components';
import { TextLink } from '../../../../system/components';
import { Container } from '../../../components/frames';
import { Grid } from '../../../components/layout/grid/Grid';
import { VStack } from '../../../components/layout/vStack/VStack';
import { HStack } from '../../../components/layout/hStack/HStack';
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
        background: 'rgba(0, 0, 0, 0.15)',
        backdropFilter: 'blur(20px)',
        borderTop: '1px solid rgba(255, 255, 255, 0.1)',
        padding: 'var(--foundation-space-16, 4rem) 0 var(--foundation-space-8, 2rem)'
      }}
    >
      <Container maxWidth="xl" align="center">
        <VStack spacing="xl">
          {/* Top grid - using Grid utility with responsive behavior */}
          <Grid 
            columns={3} 
            minItemWidth="250px" 
            gap="xl"
            collapseOn="mobile"
          >
            {/* Company */}
            <section aria-label="Företagsinformation">
              <VStack spacing="md" align="start">
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

                <VStack spacing="sm" align="start">
                  <HStack spacing="sm" align="start">
                    <Icon color="secondary" size="sm">
                      <PhoneIcon />
                    </Icon>
                    <Typography variant="body-sm" color="secondary">
                      {phone}
                    </Typography>
                  </HStack>
                  
                  <HStack spacing="sm" align="start">
                    <Icon color="secondary" size="sm">
                      <EnvelopeIcon />
                    </Icon>
                    <Typography variant="body-sm" color="secondary">
                      {email}
                    </Typography>
                  </HStack>
                  
                  <HStack spacing="sm" align="start">
                    <Icon color="secondary" size="sm">
                      <MapPinIcon />
                    </Icon>
                    <Typography variant="body-sm" color="secondary">
                      {address}
                    </Typography>
                  </HStack>
                </VStack>
              </VStack>
            </section>

            {/* Services */}
            <nav aria-label={services.title}>
              <VStack spacing="md" align="start">
                <Typography variant="body-md" weight="semibold" color="heading">
                  {services.title}
                </Typography>
                
                <VStack spacing="sm" align="start">
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
                </VStack>
              </VStack>
            </nav>

            {/* Legal */}
            <nav aria-label={legal.title}>
              <VStack spacing="md" align="start">
                <Typography variant="body-md" weight="semibold" color="heading">
                  {legal.title}
                </Typography>
                
                <VStack spacing="sm" align="start">
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
                </VStack>
              </VStack>
            </nav>
          </Grid>

          {/* Bottom row */}
          <HStack justify="between" align="center" wrap>
            <HStack spacing="sm" align="center">
              <Typography variant="body-sm" color="tertiary">
                {copyright}
              </Typography>
              <Typography variant="body-sm" color="tertiary">
                •
              </Typography>
              <Typography variant="body-sm" color="tertiary">
                Alla rättigheter förbehållna
              </Typography>
            </HStack>

            <Button
              variant="accent"
              size="sm"
              rightIcon={<ArrowRightIcon style={{ width: '16px', height: '16px', color: 'white' }} />}
              onClick={() => (window.location.href = ctaHref)}
            >
              {ctaText}
            </Button>
          </HStack>
        </VStack>
      </Container>
    </footer>
  );
};

export { NotionFooter };