'use client';

import { Section, Container } from '../../../../../system/layout';
import { SpinningCarousel, CarouselImage } from '../../../../../system/components/patterns/client/spinning-carousel';
import { useContent } from '../../../../../cms/wrappers/content/hooks/useContent';
import { usePathname } from 'next/navigation';

interface SpinningCarouselShowcaseProps {
  pageSlug?: string;
  templateIndex?: number;
  
  // Carousel configuration
  images?: CarouselImage[];
  speed?: number;
  direction?: 'left' | 'right';
  
  // Image styling
  imageWidth?: string;
  imageHeight?: string;
  imageBorderRadius?: string;
  
  // Container styling
  carouselHeight?: string;
  backgroundColor?: string;
  carouselPadding?: string;
  gap?: string;
  
  // Fade edges
  enableFadeEdges?: boolean;
  fadeWidth?: string;
  
  // Animation behavior
  duplicateCount?: number;
  
  // Layout configuration
  containerAlign?: 'left' | 'center' | 'right';
  containerMaxWidth?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  sectionPadding?: string;
  
  // Interactive
  onImageClick?: (image: CarouselImage) => void;
}

export const SpinningCarouselShowcase: React.FC<SpinningCarouselShowcaseProps> = ({
  pageSlug,
  templateIndex = 0,
  
  // Default images - all thumbnails from public/images/thumbnails
  images = [
    { src: '/images/thumbnails/dayinthelife.png', alt: 'Day in the life UGC video', title: 'Day in the Life' },
    { src: '/images/thumbnails/dog.png', alt: 'Dog UGC video', title: 'Pet Content' },
    { src: '/images/thumbnails/gardenugc.png', alt: 'Garden UGC video', title: 'Garden Content' },
    { src: '/images/thumbnails/herboxa.png', alt: 'Herboxa UGC video', title: 'Product Review' },
    { src: '/images/thumbnails/instagramad.png', alt: 'Instagram ad', title: 'Instagram Ad' },
    { src: '/images/thumbnails/interviewvoxpop.png', alt: 'Interview vox pop', title: 'Interview Style' },
    { src: '/images/thumbnails/offer-swap-ad.png', alt: 'Offer swap ad', title: 'Promotional Ad' },
    { src: '/images/thumbnails/oldintro.png', alt: 'Old intro video', title: 'Intro Video' },
    { src: '/images/thumbnails/oliveoilugc.png', alt: 'Olive oil UGC', title: 'Food Content' },
    { src: '/images/thumbnails/one of my clients tiktok.png', alt: 'Client TikTok', title: 'TikTok Content' },
    { src: '/images/thumbnails/perfume.png', alt: 'Perfume UGC', title: 'Beauty Content' },
    { src: '/images/thumbnails/realestate.png', alt: 'Real estate content', title: 'Real Estate' }
  ],
  
  // Carousel defaults - matching KJ Marketing style exactly
  speed = 50, // Slightly faster for smaller images
  direction = 'left',
  
  imageWidth = '200px', // Match KJ Marketing carousel
  imageHeight = '120px', // Match KJ Marketing carousel  
  imageBorderRadius = '8px',
  
  carouselHeight = 'auto',
  backgroundColor = 'transparent',
  carouselPadding = '0',
  gap = '16px', // Smaller gap like KJ Marketing
  
  enableFadeEdges = true,
  fadeWidth = '100px', // Smaller fade width
  
  duplicateCount = 5, // More duplicates for smaller items
  
  // Layout defaults
  containerAlign = 'center',
  containerMaxWidth = 'full',
  sectionPadding = '3rem 0', // Slightly less padding
  
  onImageClick
}) => {
  const { getPageTemplate, getTemplateBlocks, getBlockContent } = useContent();
  const pathname = usePathname();
  
  // Determine which page slug to use
  const currentSlug = pageSlug || pathname.replace('/', '') || 'home';
  
  // Get specific carousel template by index
  const carouselTemplate = getPageTemplate(currentSlug, 'carouselShowcase', templateIndex);
  
  // Get blocks from carousel pattern
  const carouselBlocks = getTemplateBlocks(carouselTemplate, 'carouselShowcase');

  const handleImageClick = (image: CarouselImage) => {
    if (onImageClick) {
      onImageClick(image);
    } else {
      // Default action - could open modal, navigate, etc.
      console.log('Carousel image clicked:', image.title || image.alt);
    }
  };

  return (
    <Section 
      id="spinning-carousel-showcase-section" 
      height="auto"
    >
      <Container 
        align={containerAlign}
        maxWidth="lg"
        style={{ 
          padding: sectionPadding
        }}
      >
        <SpinningCarousel
          images={images}
          speed={speed}
          direction={direction}
          
          imageWidth={imageWidth}
          imageHeight={imageHeight}
          imageBorderRadius={imageBorderRadius}
          
          containerHeight={carouselHeight}
          backgroundColor={backgroundColor}
          padding={carouselPadding}
          gap={gap}
          
          enableFadeEdges={enableFadeEdges}
          fadeWidth={fadeWidth}
          
          duplicateCount={duplicateCount}
          
          onImageClick={handleImageClick}
        />
      </Container>
    </Section>
  );
}; 