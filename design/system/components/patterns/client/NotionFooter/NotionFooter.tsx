'use client';

import './NotionFooter.css';

import { Typography } from '../../../../../system/components/primitives/Typography';
import { Button } from '../../../../../system/components/primitives/Button';
import { Icon } from '../../../../../system/components/primitives/Icon';
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
    <footer className="notion-footer" role="contentinfo" aria-label="Sidfot">
      <div className="notion-footer__container">
        {/* Top grid */}
        <div className="notion-footer__grid">
          {/* Company */}
          <section className="footer-col footer-col--company" aria-label="Företagsinformation">
            <Typography variant="h4" weight="bold" color="heading" className="footer-company__name">
              {companyName}
            </Typography>

            <Typography variant="body-md" color="secondary" className="footer-company__desc">
              {companyDescription}
            </Typography>

            <ul className="footer-contact">
              <li>
                <Icon color="secondary" className="footer-icon"><PhoneIcon /></Icon>
                <Typography variant="body-sm" color="secondary">{phone}</Typography>
              </li>
              <li>
                <Icon color="secondary" className="footer-icon"><EnvelopeIcon /></Icon>
                <Typography variant="body-sm" color="secondary">{email}</Typography>
              </li>
              <li>
                <Icon color="secondary" className="footer-icon"><MapPinIcon /></Icon>
                <Typography variant="body-sm" color="secondary">{address}</Typography>
              </li>
            </ul>
          </section>

          {/* Services */}
          <nav className="footer-col" aria-label={services.title}>
            <Typography variant="body-md" weight="semibold" color="heading" className="footer-heading">
              {services.title}
            </Typography>
            <ul className="footer-list">
              {services.links.map((l, i) => (
                <li key={i}><a className="footer-link" href={l.href}>{l.label}</a></li>
              ))}
            </ul>
          </nav>

          {/* Legal */}
          <nav className="footer-col" aria-label={legal.title}>
            <Typography variant="body-md" weight="semibold" color="heading" className="footer-heading">
              {legal.title}
            </Typography>
            <ul className="footer-list">
              {legal.links.map((l, i) => (
                <li key={i}><a className="footer-link" href={l.href}>{l.label}</a></li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Bottom row */}
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
      </div>
    </footer>
  );
};

export { NotionFooter };
