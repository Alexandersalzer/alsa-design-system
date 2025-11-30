'use client';

import { VideoShowcase } from '../../../components/media/VideoShowcase/VideoShowcase';
import { Image } from '../../../components/media/Image/Image';
import { useComponentProps, CDN_BASE_URL } from '../../../core/utils/helpers';
import { PatternNode } from '../../../core/types/nodes';

const MediaPattern = ({ components = {} }: PatternNode) => {
  const get = useComponentProps(components);
  
  // Check if we have a video or image component
  const videoComponent = get('video');
  const imageComponent = get('image');
  
  // If we have a video, render VideoShowcase
  if (videoComponent?.src) {
    return (
      <VideoShowcase
        src={`${CDN_BASE_URL}${videoComponent.src}`}
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
  
  // If we have an image, render Image
  if (imageComponent?.imageSrc) {
    return (
      <Image
        src={`${CDN_BASE_URL}${imageComponent.imageSrc}`}
        alt={imageComponent.alt || 'Media image'}
        width="100%"
        height="auto"
        objectFit="cover"
        radius="md"
        loading="eager"
        priority={true}
        aspectRatio="16/9"
        className="media-pattern-image"
      />
    );
  }
  
  // Fallback if neither is provided
  return null;
};

MediaPattern.displayName = 'MediaPattern';

export default MediaPattern;