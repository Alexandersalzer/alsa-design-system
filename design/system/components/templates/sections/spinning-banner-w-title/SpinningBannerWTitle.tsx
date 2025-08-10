'use client';

import { Section, Container } from '../../../../../system/layout';
import { Stack } from '../../../../../system/layout/utilities/stack/Stack';
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
  speed = 30,
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
  
  // Default logos if none provided - all 10 logos from kjlogos directory
  const defaultLogos = [
    { src: '/images/kjlogos/huellogo.png', alt: 'Huel Logo' },
    { src: '/images/kjlogos/fazerlogo.png', alt: 'Fazer Logo' },
    { src: '/images/kjlogos/wolt.png', alt: 'Wolt Logo' },
    { src: '/images/kjlogos/tradera.png', alt: 'Tradera Logo' },
    { src: '/images/kjlogos/philips.png', alt: 'Philips Logo' },
    { src: '/images/kjlogos/skyshowtime.png', alt: 'SkyShowtime Logo' },
    { src: '/images/kjlogos/aftonbladet.png', alt: 'Aftonbladet Logo' },
    { src: '/images/kjlogos/benandjerrylogo.png', alt: 'Ben & Jerry\'s Logo' },
    { src: '/images/kjlogos/mindler.png', alt: 'Mindler Logo' },
    { src: '/images/kjlogos/swiffer.png', alt: 'Swiffer Logo' }
  ];

  return (
    <Section 
      id="spinning-banner-section" 
      style={{ 
        marginTop: '-6rem', // Increased negative margin for tighter spacing
        paddingTop: 'var(--foundation-space-4, 1rem)', // Further reduced padding
        paddingBottom: 'var(--foundation-space-16, 4rem)'
      }}
    >
      <Container align="center" maxWidth="lg">
        <Stack spacing="xs" align="center">
          {/* Portfolio Title */}
          <Typography
            variant="label-xs"
            uppercase
            weight="regular"
            align="center"
            color="tertiary"
          >
            EN LITEN DEL AV MIN PORTFÖLJ
          </Typography>
                     
          {/* Spinning Banner */}
          <SpinningBanner
            logos={logos || defaultLogos}
            speed={speed}
            direction={direction}
          />
        </Stack>
      </Container>
    </Section>
  );
}; 