import React from 'react';
import { MailIcon, PhoneIcon, LinkedinIcon, InstagramIcon } from 'lucide-react';
import { Section } from '../../../../layout/frames/section/Section';
import { Container } from '../../../../layout/frames/container/Container';
import { Stack } from '../../../../layout/utilities/stack/Stack';
import { Cluster } from '../../../../layout/utilities/cluster/Cluster';
import { Typography } from '../../../primitives/Typography';
import { TextLink } from '../../../primitives/TextLink';
import { Icon } from '../../../primitives/Icon';
import { Button } from '../../../primitives/Button';

export interface FooterLink {
  label: string;
  href: string;
}

export interface FooterColumn {
  title: string;
  links: FooterLink[];
}

export interface SocialLink {
  platform: string;
  href: string;
  icon: React.ReactNode;
}

export interface FooterSectionProps {
  id?: string;
  className?: string;
  companyName?: string;
  companyDescription?: string;
  columns?: FooterColumn[];
  email?: string;
  phone?: string;
  socialLinks?: SocialLink[];
  ctaTitle?: string;
  ctaDescription?: string;
  ctaButtonText?: string;
  ctaButtonHref?: string;
  copyrightText?: string;
  poweredByText?: string;
  backgroundImageUrl?: string;
}

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
  poweredByText = "Powered by Blimpify IM",
  backgroundImageUrl
}) => {
  const currentYear = new Date().getFullYear();
  const defaultCopyright = `© ${currentYear} ${companyName}. Alla rättigheter reserverade.`;

  return (
    <Section
      id={id}
      as="footer"
      className={className}
    >
      <Container maxWidth="lg">
        <Stack spacing="xl" align="start">
          
          {/* Main Content Grid */}
          <Cluster spacing="xl" wrap>
              
            {/* Column 1: Company Info */}
            <Stack spacing="md" align="start">
              <Typography variant="h3" weight="bold" color="primary">
                {companyName}
              </Typography>
              <Typography variant="body-sm" color="secondary">
                {companyDescription}
              </Typography>
            </Stack>
              
            {/* Columns 2-4: Navigation Links */}
            {columns.map((column, index) => (
              <Stack key={index} spacing="sm" align="start">
                <Typography variant="h4" weight="semibold" color="primary">
                  {column.title}
                </Typography>
                
                {column.links.map((link, linkIndex) => (
                  <TextLink key={linkIndex} href={link.href} variant="secondary">
                    {link.label}
                  </TextLink>
                ))}
              </Stack>
            ))}
              
            {/* Column 5: Contact & Social */}
            <Stack spacing="sm" align="start">
              <Typography variant="h4" weight="semibold" color="primary">
                Kontakt
              </Typography>
              
              {/* Email */}
              <Cluster spacing="sm" align="center">
                <Icon size="sm" color="secondary"><MailIcon /></Icon>
                <TextLink href={`mailto:${email}`} variant="secondary">
                  {email}
                </TextLink>
              </Cluster>
              
              {/* Phone */}
              <Cluster spacing="sm" align="center">
                <Icon size="sm" color="secondary"><PhoneIcon /></Icon>
                <TextLink href={`tel:${phone}`} variant="secondary">
                  {phone}
                </TextLink>
              </Cluster>
              
              {/* Social Links */}
              <Typography variant="body-sm" weight="semibold" color="primary">
                Följ oss
              </Typography>
              
              <Cluster spacing="md">
                {socialLinks.map((social, index) => (
                  <TextLink key={index} href={social.href}>
                    {social.icon}
                  </TextLink>
                ))}
              </Cluster>
            </Stack>

          </Cluster>
          
          {/* CTA Section */}
          <Cluster spacing="lg" justify="between" wrap>
            <Stack spacing="sm">
              <Typography variant="h3" weight="bold" color="primary">
                {ctaTitle}
              </Typography>
              <Typography variant="body-md" color="secondary">
                {ctaDescription}
              </Typography>
            </Stack>
            
            <Button variant="primary" size="lg">
              {ctaButtonText}
            </Button>
          </Cluster>
          
          {/* Bottom Bar */}
          <Stack spacing="lg">
            <hr style={{ border: 'none', height: '1px', backgroundColor: 'var(--border-subtle)' }} />
            
            <Cluster spacing="md" justify="between" wrap>
              <Typography variant="body-sm" color="secondary">
                {copyrightText || defaultCopyright}
              </Typography>
              <Typography variant="body-sm" color="secondary">
                {poweredByText}
              </Typography>
            </Cluster>
          </Stack>

        </Stack>
      </Container>
    </Section>
  );
};