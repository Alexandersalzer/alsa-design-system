'use client';

import { Section, Container } from '../../../../../system/layout';
import { SpinningBanner } from '../../../../../system/components/patterns/client/spinning-banner';
import { Typography } from '../../../../../system/components/primitives/Typography';
import { useContent } from '../../../../../cms/wrappers/content/hooks/useContent';
import { usePathname } from 'next/navigation';

interface SpinningBannerWTitleProps {
  pageSlug?: string;
  templateIndex?: number;
  titleAs?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  unit?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  textAlign?: 'left' | 'center' | 'right';
  speed?: number;
  direction?: 'left' | 'right';
  logos?: Array<{
    src: string;
    alt: string;
    width?: number;
    height?: number;
  }>;
}

export const SpinningBannerWTitle: React.FC<SpinningBannerWTitleProps> = ({
  pageSlug,
  templateIndex = 0,
  titleAs = 'h2',
  unit = 'lg',
  textAlign = 'center',
  speed = 20,
  direction = 'left',
  logos
}) => {
  const { getPageTemplate, getTemplateBlocks, getBlockContent } = useContent();
  const pathname = usePathname();
  
  // Determine which page slug to use
  const currentSlug = pageSlug || pathname.replace('/', '') || 'home';
  
  // Get specific spinning banner template by index
  const spinningBannerTemplate = getPageTemplate(currentSlug, 'spinningBanner', templateIndex);
  
  // Get blocks from spinning banner pattern
  const spinningBannerBlocks = getTemplateBlocks(spinningBannerTemplate, 'spinningBanner');
  
  // Extract content using generic functions
  const title = getBlockContent(spinningBannerBlocks, 'title') || '';
  const subtitle = getBlockContent(spinningBannerBlocks, 'subtitle') || '';
  
  // Default logos if none provided
  const defaultLogos = [
    { src: '/images/sections/kjlogo.jpg', alt: 'KJ Marketing Logo', width: 60, height: 60 }
  ];

  return (
    <Section 
      id="spinning-banner-section" 
      style={{ 
        paddingTop: 'var(--foundation-space-16, 4rem)',
        paddingBottom: 'var(--foundation-space-16, 4rem)'
      }}
    >
      <Container align="center">
        {title && (
          <div style={{ marginBottom: 'var(--foundation-space-12, 3rem)', textAlign }}>
            <Typography
              variant="h2"
              as={titleAs}
              style={{ 
                color: 'var(--neutral-1200)',
                fontWeight: 600,
                lineHeight: 1.2
              }}
            >
              {title}
            </Typography>
            {subtitle && (
              <Typography
                variant="body-lg"
                as="p"
                style={{ 
                  color: 'var(--neutral-800)',
                  maxWidth: '600px',
                  margin: '0 auto',
                  marginTop: 'var(--foundation-space-4, 1rem)'
                }}
              >
                {subtitle}
              </Typography>
            )}
          </div>
        )}
        
        <SpinningBanner
          logos={logos || defaultLogos}
          speed={speed}
          direction={direction}
        />
      </Container>
    </Section>
  );
}; 