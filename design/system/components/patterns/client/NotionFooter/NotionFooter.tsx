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
import './NotionFooter.css';

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
  isEditingMode?: boolean;
  content: NotionFooterContent;
}

const NotionFooter = ({ isEditingMode = false, content }: NotionFooterProps) => {
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
    <footer className="notion-footer">
      <div className="notion-footer-container">
        <Rhythm unit="lg" align="start" direction="column">
          
          {/* Main Footer Content */}
          <RhythmItem at={1}>
            <div className="notion-footer-grid">
              
              {/* Company Info */}
              <div className="footer-company">
                <Stack spacing="lg">
                  <Typography variant="h4" weight="bold" color="heading" className="footer-company-name">
                    {companyName}
                  </Typography>
                  <Typography variant="body-md" color="secondary" className="footer-company-desc">
                    {companyDescription}
                  </Typography>

                  <Stack spacing="sm">
                    <Cluster spacing="sm" align="center">
                      <Icon color="secondary" className="footer-icon">
                        <PhoneIcon />
                      </Icon>
                      <Typography variant="body-sm" color="secondary">
                        {phone}
                      </Typography>
                    </Cluster>
                    <Cluster spacing="sm" align="center">
                      <Icon color="secondary" className="footer-icon">
                        <EnvelopeIcon />
                      </Icon>
                      <Typography variant="body-sm" color="secondary">
                        {email}
                      </Typography>
                    </Cluster>
                    <Cluster spacing="sm" align="center">
                      <Icon color="secondary" className="footer-icon">
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
                  <Typography variant="body-md" weight="semibold" color="heading" className="footer-heading">
                    {services.title}
                  </Typography>
                  <Stack spacing="sm">
                    {services.links.map((link, index) => (
                      <a key={index} href={link.href} className="footer-link">
                        {link.label}
                      </a>
                    ))}
                  </Stack>
                </Stack>
              </div>
              
              {/* Legal */}
              <div>
                <Stack spacing="lg">
                  <Typography variant="body-md" weight="semibold" color="heading" className="footer-heading">
                    {legal.title}
                  </Typography>
                  <Stack spacing="sm">
                    {legal.links.map((link, index) => (
                      <a key={index} href={link.href} className="footer-link">
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
            <div className="footer-bottom">
              <Cluster spacing="md" align="center" className="footer-copy">
                <Typography variant="body-sm" color="tertiary">
                  {copyright}
                </Typography>
                <div className="footer-dot" />
                <Typography variant="body-sm" color="tertiary">
                  Alla rättigheter förbehållna
                </Typography>
              </Cluster>
              
              <Button 
                variant="accent" 
                size="sm"
                rightIcon={<Icon color="inverse"><ArrowRightIcon /></Icon>}
                className="footer-cta"
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
