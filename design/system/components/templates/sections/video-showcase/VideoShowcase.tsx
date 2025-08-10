'use client';

import { Section, Container } from '../../../../../system/layout';
import { Stack } from '../../../../../system/layout/utilities/stack/Stack';
import { Typography } from '../../../../../system/components/primitives/Typography';
import { useContent } from '../../../../../cms/wrappers/content/hooks/useContent';
import { usePathname } from 'next/navigation';

interface VideoShowcaseProps {
  pageSlug?: string;
  templateIndex?: number;
  videoSrc?: string;
  videoPoster?: string;
  title?: string;
  subtitle?: string;
  titleAs?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';
  textAlign?: 'left' | 'center' | 'right';
  maxWidth?: string;
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
  title,
  subtitle,
  titleAs = 'h2',
  textAlign = 'center',
  maxWidth = '800px',
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
  
  // Extract content using generic functions
  const cmsTitle = getBlockContent(videoBlocks, 'title') || '';
  const cmsSubtitle = getBlockContent(videoBlocks, 'subtitle') || '';
  
  // Use CMS content if available, otherwise fallback to props
  const displayTitle = cmsTitle || title;
  const displaySubtitle = cmsSubtitle || subtitle;

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
        <Stack spacing="lg" align="center">
          {/* Title and Subtitle */}
          {displayTitle && (
            <div style={{ textAlign, marginBottom: '2rem' }}>
              <Typography
                variant="h2"
                as={titleAs}
                style={{ 
                  color: 'var(--neutral-1200)',
                  fontWeight: 600,
                  lineHeight: 1.2,
                  marginBottom: '1rem'
                }}
              >
                {displayTitle}
              </Typography>
              {displaySubtitle && (
                <Typography
                  variant="body-lg"
                  as="p"
                  style={{ 
                    color: 'var(--neutral-800)',
                    maxWidth: '600px',
                    margin: '0 auto'
                  }}
                >
                  {displaySubtitle}
                </Typography>
              )}
            </div>
          )}
          
          {/* Video Container */}
          <div 
            style={{
              width: '100%',
              maxWidth: maxWidth,
              position: 'relative',
              borderRadius: '12px',
              overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
              backgroundColor: '#000'
            }}
          >
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
              Din webbläsare stödjer inte video-taggen.
            </video>
          </div>
        </Stack>
      </Container>
    </Section>
  );
}; 