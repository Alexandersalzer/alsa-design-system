import React from 'react';
import { Button } from '../../../../../system/components/primitives/Button';
import { Typography } from '../../../../../system/components/primitives/Typography';
import { Container } from '../../../../../system/layout/frames/container/Container';
import { Section } from '../../../../../system/layout/frames/section/Section';
import { Linkedin, Instagram, Mail, Phone } from 'lucide-react';
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
    <footer id={id} className={`footer-section ${className || ''}`}>
      <div className="footer-container">
        {/* Main footer content */}
        <div className="footer-grid">
          {/* Company info column */}
          <div className="footer-company">
            <div className="footer-logo">
              <h2 className="footer-company-name">
                {companyName}
              </h2>
            </div>
            <p className="footer-description">
              {description}
            </p>
          </div>

          {/* Links columns */}
          {columns.map((column, index) => (
            <div key={index} className="footer-column">
              <h4 className="footer-column-title">
                {column.title}
              </h4>
              <nav>
                <ul className="footer-links">
                  {column.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <a
                        href={link.href}
                        target={link.external ? '_blank' : undefined}
                        rel={link.external ? 'noopener noreferrer' : undefined}
                        className="footer-link"
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
          <div className="footer-contact">
            <h4 className="footer-column-title">
              Kontakta oss
            </h4>
            
            <div className="footer-contact-info">
              {/* Email */}
              <div className="footer-contact-item">
                <Mail size={16} className="footer-contact-icon" />
                <a
                  href={`mailto:${email}`}
                  className="footer-contact-link"
                >
                  {email}
                </a>
              </div>

              {/* Phone */}
              <div className="footer-contact-item">
                <Phone size={16} className="footer-contact-icon" />
                <a
                  href={`tel:${phone}`}
                  className="footer-contact-link"
                >
                  {phone}
                </a>
              </div>
            </div>

            {/* Social links */}
            <div className="footer-social">
              <h4 className="footer-column-title">
                Följ oss
              </h4>
              <div className="footer-social-links">
                {socialLinks.map((social, index) => (
                  <a
                    key={index}
                    href={social.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="footer-social-link"
                  >
                    {social.icon}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="footer-bottom">
          <p className="footer-copyright">
            {finalCopyrightText}
          </p>
          <p className="footer-powered-by">
            {poweredByText}
          </p>
        </div>
      </div>
    </footer>
  );
};
