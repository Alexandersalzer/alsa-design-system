'use client';

import { Section } from '../../components/frames/section';
import { renderShellPattern } from '../../core/render/shells';
import { SectionNode } from '../../core/types/nodes';
import { Typography } from '../../components/Typography/Typography';
import { VStack } from '../../components/layout/vStack/VStack';
import './Footer.css';

interface FooterProps {
  section?: Record<string, SectionNode>;
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

  // Check if any pattern has showTopBorder prop
  const hasTopBorder = Object.values(patterns).some(
    (pattern: any) => pattern?.props?.showTopBorder === true
  );

  // Render patterns using shared renderShellPattern function
  const renderedPatterns = patternOrder
    .map((patternKey) => {
      const pattern = patterns[patternKey];
      return pattern ? renderShellPattern(pattern, patternKey, sectionKey) : null;
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
      <VStack spacing="lg" align="center" className="footer__content">
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