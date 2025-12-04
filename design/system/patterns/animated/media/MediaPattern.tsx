'use client';

import { VideoShowcase } from '../../../components/media/VideoShowcase/VideoShowcase';
import { Image } from '../../../components/media/Image/Image';
import { componentPropsWithKey, componentPresent } from '../../../core/utils/props';
import { CDN_BASE_URL } from '../../../core/utils/env';
import { PatternNode } from '../../../core/types/nodes';

interface MediaPatternProps extends PatternNode {
  sectionKey?: string;
  patternKey?: string;
}

const MediaPattern = ({ components = {}, sectionKey, patternKey }: MediaPatternProps) => {
  const getWithKey = componentPropsWithKey(components);
  const renderIf = componentPresent(components);
  
  // If we have a video, render VideoShowcase
  if (renderIf('video') && getWithKey('video').props.src) {
    return (
      <VideoShowcase
        src={`${CDN_BASE_URL}${getWithKey('video').props.src}`}
        autoPlay={false}
        muted={true}
        loop={true}
        controls={false}
        showPlayButton={true}
        variant="elevated"
        size="full"
        aspectRatio="16-9"
        radius="md"
        componentKey={getWithKey('video').key}
      />
    );
  }
  
  // If we have an image, render Image
  if (renderIf('image') && getWithKey('image').props.imageSrc) {
    return (
      <Image
        src={`${CDN_BASE_URL}${getWithKey('image').props.imageSrc}`}
        alt={getWithKey('image').props.alt || 'Media image'}
        width="100%"
        height="auto"
        objectFit="cover"
        radius="md"
        loading="eager"
        priority={true}
        aspectRatio="16/9"
        className="media-pattern-image"
        componentKey={getWithKey('image').key}
      />
    );
  }
  
  // Fallback if neither is provided
  return null;
};

MediaPattern.displayName = 'MediaPattern';

export default MediaPattern;