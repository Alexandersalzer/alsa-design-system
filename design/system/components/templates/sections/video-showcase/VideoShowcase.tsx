'use client';

import { Section, Container, Block } from '../../../../../system/layout';
import { useContent } from '../../../../../cms/wrappers/content/hooks/useContent';
import { usePathname } from 'next/navigation';

interface VideoShowcaseProps {
  pageSlug?: string;
  templateIndex?: number;
  videoSrc?: string;
  videoPoster?: string;
  autoPlay?: boolean;
  muted?: boolean;
  loop?: boolean;
  controls?: boolean;
}

export const VideoShowcase: React.FC<VideoShowcaseProps> = ({
  pageSlug,
  templateIndex = 0,
  videoSrc = '/images/kjlogos/Intro Video-2.mov',
  videoPoster,
  autoPlay = true,
  muted = true,
  loop = true,
  controls = true
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
        maxWidth="xl"
        style={{ 
          paddingTop: '4rem',
          paddingBottom: '4rem'
        }}
      >
        <Block>
          <video
            src={videoSrc}
            poster={videoPoster}
            autoPlay={autoPlay}
            muted={muted}
            loop={loop}
            controls={controls}
            playsInline
            style={{
              width: '100%',
              height: 'auto',
              display: 'block'
            }}
          >
          </video>
        </Block>
      </Container>
    </Section>
  );
}; 