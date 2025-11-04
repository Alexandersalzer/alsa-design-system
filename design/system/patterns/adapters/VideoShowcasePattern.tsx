'use client';

import { VideoShowcase } from '../../components/media/VideoShowcase/VideoShowcase';

interface VideoShowcasePatternProps {
  type: string;
  components?: Record<string, {
    type: string;
    content: any;
  }>;
  [key: string]: any;
}

export function VideoShowcasePattern({ components, ...props }: VideoShowcasePatternProps) {
  if (!components) return null;

  // Extract video component
  const videoComponent = Object.values(components).find((c: any) => c.type === 'video') as any;
  
  if (!videoComponent?.content?.src) return null;

  return (
    <VideoShowcase
      src={videoComponent.content.src}
      poster={videoComponent.content.poster || ''}
      autoPlay={false}
      muted={true}
      loop={true}
      controls={false}
      showPlayButton={true}
      variant="elevated"
      size="full"
      aspectRatio="16-9"
      radius="md"
    />
  );
}