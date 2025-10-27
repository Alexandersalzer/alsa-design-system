'use client';

import { Section, Container, Block } from '../../../components/frames';
import { VideoShowcase as VideoShowcasePrimitive } from '../../../../system/components';
import { useContent } from '../../../../cms/wrappers/content/hooks/useContent';
import { usePathname } from 'next/navigation';

interface VideoShowcaseSectionProps {
  pageSlug?: string;
  templateIndex?: number;
  videoSrc?: string;
  videoPoster?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
  showPlayButton?: boolean;
}

export const VideoShowcaseSection: React.FC<VideoShowcaseSectionProps> = ({
  pageSlug,
  templateIndex = 0,
  videoSrc = '/images/kjlogos/Intro Video-2.mov',
  videoPoster,
  autoPlay = false,
  muted = true,
  loop = true,
  controls = false,
  showPlayButton = true
}) => {
  const { getPageTemplate, getTemplateBlocks, getBlockContent } = useContent();
  const pathname = usePathname();
  
  // Determine which page slug to use
  const currentSlug = pageSlug || pathname.replace('/', '') || 'home';
  
  // Get specific video showcase template by index
  const videoTemplate = getPageTemplate(currentSlug, 'videoShowcase', templateIndex);
  
  // Get blocks from video showcase pattern
  const videoBlocks = getTemplateBlocks(videoTemplate, 'videoShowcase');

  return (
    <Section 
      id="video-showcase-section" 
      height="auto"
    >
      <Container 
        align="center" 
        maxWidth="lg"
        style={{ 
          paddingTop: '4rem',
          paddingBottom: '4rem'
        }}
      >
        <Block>
          <VideoShowcasePrimitive
            src={videoSrc}
            poster={videoPoster}
            autoPlay={autoPlay}
            muted={muted}
            loop={loop}
            controls={controls}
            showPlayButton={showPlayButton}
            variant="elevated"
            size="full"
            aspectRatio="16-9"
            radius="md"
          />
        </Block>
      </Container>
    </Section>
  );
}; 