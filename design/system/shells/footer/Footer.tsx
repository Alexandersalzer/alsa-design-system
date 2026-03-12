'use client';

import { Section } from '../../components/frames/section';
import { renderShellPattern } from '../../core/render/shells';
import { renderLayoutWithTemplate } from '../../core/render/layouts';
import { Container } from '../../components';
import { SectionNode } from '../../core/types/nodes';
import { Typography } from '../../components/Typography/Typography';
import { VStack } from '../../components/layout/vStack/VStack';
import './Footer.css';

interface FooterProps {
  section?: Record<string, SectionNode>;
}

/** Filter logo/logotext components based on logoDisplay section prop */
function filterByLogoDisplay(
  components: Record<string, any>,
  logoDisplay: string | undefined
): Record<string, any> {
  if (!logoDisplay || logoDisplay === 'both') return components;
  const showLogo = logoDisplay !== 'text' && logoDisplay !== 'none';
  const showLogoText = logoDisplay !== 'logo' && logoDisplay !== 'none';
  return Object.fromEntries(
    Object.entries(components).filter(([, comp]: [string, any]) => {
      if (!showLogo && comp.type === 'logo') return false;
      if (!showLogoText && comp.type === 'logotext') return false;
      return true;
    })
  );
}

const Footer = ({ section }: FooterProps) => {
  if (!section) return null;

  // Get the first (and usually only) footer section
  const footerSection = Object.values(section)[0];
  if (!footerSection?.patterns) return null;

  const { patterns, order, props: sectionProps } = footerSection;
  const patternOrder = order || Object.keys(patterns);

  // Get sectionKey from the first section
  const sectionKey = Object.keys(section)[0];

  // logoDisplay lives on section props
  const logoDisplay = (sectionProps as any)?.logoDisplay;

  // Check if any pattern has showTopBorder prop
  const hasTopBorder = Object.values(patterns).some(
    (pattern: any) => pattern?.props?.showTopBorder === true
  );

  // Render patterns — use layout path with logo filtering when layout exists
  const renderedPatterns = patternOrder
    .map((patternKey) => {
      const pattern = patterns[patternKey] as any;
      if (!pattern) return null;

      if (pattern.layout) {
        // Collect components from all layout items
        let components: Record<string, any> = pattern.components || {};
        if (pattern.layout.items && Array.isArray(pattern.layout.items)) {
          components = pattern.layout.items.reduce((acc: Record<string, any>, item: any) => {
            return item.components ? { ...acc, ...item.components } : acc;
          }, {});
        }

        // Apply logoDisplay filtering
        const filteredComponents = filterByLogoDisplay(components, logoDisplay);

        // Rebuild layout.items with filtered components
        const patchedLayout = {
          ...pattern.layout,
          items: pattern.layout.items?.map((item: any) => ({
            ...item,
            components: Object.fromEntries(
              Object.entries(item.components || {}).filter(([k]) => k in filteredComponents)
            ),
          })),
        };

        const content = renderLayoutWithTemplate(
          patchedLayout,
          filteredComponents,
          sectionKey,
          patternKey
        );

        return (
          <Container
            key={patternKey}
            align="center"
            height="auto"
            noPadding={true}
            patternKey={patternKey}
          >
            {content}
          </Container>
        );
      }

      return renderShellPattern(pattern, patternKey, sectionKey);
    })
    .filter(Boolean);

  if (renderedPatterns.length === 0) return null;

  return (
    <Section
      as="footer"
      sectionKey={sectionKey}
      className={hasTopBorder ? 'footer-with-top-border' : ''}
      {...sectionProps}
    >
      <VStack spacing="xl" align="center" className="footer__content">
        {renderedPatterns}
        
        {/* Blimpify attribution - applies to all footers */}
        <div className="footer__attribution">
          <Typography 
            as="span" 
            variant="body-sm" 
            color="tertiary"
          >
            Made with{' '}
            <a 
              href="https://blimpify-im.com" 
              target="_blank" 
              rel="noopener noreferrer"
              className="footer__attribution-link"
            >
              Blimpify
            </a>
          </Typography>
        </div>
      </VStack>
    </Section>
  );
};

export default Footer;