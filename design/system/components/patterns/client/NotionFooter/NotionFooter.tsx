'use client';

import './NotionFooter.css';

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
  isEditingMode?: boolean; // kvar om du använder det uppströms
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
    <footer className="notion-footer" role="contentinfo" aria-label="Sidfot">
      <div className="notion-footer__container">
        <Rhythm unit="lg" align="start" direction="column">
          {/* Huvudinnehåll */}
          <RhythmItem at={1}>
            <div className="notion-footer__grid">
              {/* Företagsinfo (större kolumn) */}
              <section className="footer-col footer-col--company" aria-label="Företagsinformation">
                <Stack spacing="lg">
                  <Typography variant="h4" weight="bold" color="heading" className="footer-company__name">
                    {companyName}
                  </Typography>

                  <Typography variant="body-md" color="secondary" className="footer-company__desc">
                    {companyDescription}
                  </Typography>

                  <Stack spacing="sm" className="footer-company__contact">
                    <Cluster spacing="sm" align="center">
                      <Icon color="secondary" className="footer-icon">
                        <PhoneIcon />
                      </Icon>
                      <Typography variant="body-sm" color="secondary">{phone}</Typography>
                    </Cluster>
                    <Cluster spacing="sm" align="center">
                      <Icon color="secondary" className="footer-icon">
                        <EnvelopeIcon />
                      </Icon>
                      <Typography variant="body-sm" color="secondary">{email}</Typography>
                    </Cluster>
                    <Cluster spacing="sm" align="center">
                      <Icon color="secondary" className="footer-icon">
                        <MapPinIcon />
                      </Icon>
                      <Typography variant="body-sm" color="secondary">{address}</Typography>
                    </Cluster>
                  </Stack>
                </Stack>
              </section>

              {/* Tjänster */}
              <nav className="footer-col" aria-label={services.title}>
                <Typography
                  variant="body-md"
                  weight="semibold"
                  color="heading"
                  className="footer-heading"
                >
                  {services.title}
                </Typography>
                <ul className="footer-list">
                  {services.links.map((link, i) => (
                    <li key={i}>
                      <a className="footer-link" href={link.href}>{link.label}</a>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Juridiskt */}
              <nav className="footer-col" aria-label={legal.title}>
                <Typography
                  variant="body-md"
                  weight="semibold"
                  color="heading"
                  className="footer-heading"
                >
                  {legal.title}
                </Typography>
                <ul className="footer-list">
                  {legal.links.map((link, i) => (
                    <li key={i}>
                      <a className="footer-link" href={link.href}>{link.label}</a>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          </RhythmItem>

          {/* Nederkant */}
          <RhythmItem at={3}>
            <div className="notion-footer__bottom">
              <div className="footer-bottom__copy">
                <Typography variant="body-sm" color="tertiary">{copyright}</Typography>
                <span className="footer-dot" aria-hidden="true" />
                <Typography variant="body-sm" color="tertiary">Alla rättigheter förbehållna</Typography>
              </div>

              <div className="footer-bottom__cta">
                <Button
                  variant="accent"
                  size="sm"
                  rightIcon={<Icon color="inverse"><ArrowRightIcon /></Icon>}
                  onClick={() => (window.location.href = ctaHref)}
                >
                  {ctaText}
                </Button>
              </div>
            </div>
          </RhythmItem>
        </Rhythm>
      </div>
    </footer>
  );
};

export { NotionFooter };