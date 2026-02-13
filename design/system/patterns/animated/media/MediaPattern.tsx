'use client';

import { VideoShowcase } from '../../../components/media/VideoShowcase/VideoShowcase';
import { Image } from '../../../components/media/Image/Image';
import { componentProps, componentPresent } from '../../../core/utils/props';
import { CDN_BASE_URL, resolveCdnImageUrl } from '../../../core/utils/env';
import { getVideoThumbnailUrl } from '../../../core/utils/media';
import { PatternNode } from '../../../core/types/nodes';

interface MediaPatternProps extends PatternNode {
  sectionKey?: string;
  patternKey?: string;
}

const MediaPattern = ({ components = {}, props = {}, sectionKey, patternKey }: MediaPatternProps) => {
  // Get pattern-level props for layout control
  const {
    overflow = false,           // Enable overflow/spill effect
    spillAmount = 120,          // How much to spill in pixels
    spillDirection = 'right',   // Direction: 'right' | 'left' | 'top' | 'bottom'
    maxWidth,                   // Max width of media container
    marginTop,                  // Push down from top
    marginRight,                // Push from right
    marginBottom,               // Push from bottom  
    marginLeft,                 // Push from left
    align = 'center',           // Alignment: 'start' | 'center' | 'end'
  } = props as {
    overflow?: boolean;
    spillAmount?: number;
    spillDirection?: 'right' | 'left' | 'top' | 'bottom';
    maxWidth?: string;
    marginTop?: string;
    marginRight?: string;
    marginBottom?: string;
    marginLeft?: string;
    align?: 'start' | 'center' | 'end';
  };

  // Calculate overflow styles
  const getOverflowStyles = (): React.CSSProperties => {
    if (!overflow) return {};
    
    switch (spillDirection) {
      case 'right':
        return {
          width: `calc(100% + ${spillAmount}px)`,
          marginRight: `-${spillAmount}px`,
        };
      case 'left':
        return {
          width: `calc(100% + ${spillAmount}px)`,
          marginLeft: `-${spillAmount}px`,
        };
      case 'top':
        return {
          marginTop: `-${spillAmount}px`,
        };
      case 'bottom':
        return {
          marginBottom: `-${spillAmount}px`,
        };
      default:
        return {};
    }
  };
  const get = componentProps(components);
  const renderIf = componentPresent(components);

  // If we have a video, render VideoShowcase
  if (renderIf('video') && get('video').props.src) {
    const videoProps = get('video').props;
    const videoUrl = `${CDN_BASE_URL}${videoProps.src}`;

    // Priority 1: Use hardcoded poster if provided
    let derivedPosterUrl = videoProps.poster ? `${CDN_BASE_URL}${videoProps.poster}` : undefined;

    // Priority 2: Auto-derive thumbnail from video path
    // Backend stores thumbnails at: user-{id}/thumbnails/{video-name}.jpg
    if (!derivedPosterUrl) {
      derivedPosterUrl = getVideoThumbnailUrl(videoUrl);
    }

    // Just pass the poster URL - browser will show first frame if poster 404s
    return (
      <VideoShowcase
        src={videoUrl}
        poster={derivedPosterUrl}
        autoPlay={false}
        muted={true}
        loop={true}
        controls={false}
        showPlayButton={true}
        variant="elevated"
        size="full"
        aspectRatio="16-9"
        radius="md"
        componentKey={get('video').key}
        animation={videoProps.animation}
      />
    );
  }
  
  // If we have an image, render Image
  if (renderIf('image') && get('image').props.imageSrc) {
    const imageProps = get('image').props;
    const overflowStyles = getOverflowStyles();
    
    // Container styles for positioning
    const containerStyles: React.CSSProperties = {
      position: 'relative',
      overflow: 'visible',
      ...overflowStyles,
      ...(maxWidth && { maxWidth }),
      ...(marginTop && { marginTop }),
      ...(marginRight && { marginRight }),
      ...(marginBottom && { marginBottom }),
      ...(marginLeft && { marginLeft }),
      ...(align === 'end' && { marginLeft: 'auto' }),
      ...(align === 'start' && { marginRight: 'auto' }),
      ...(align === 'center' && { marginLeft: 'auto', marginRight: 'auto' }),
    };

    return (
      <div style={containerStyles}>
        <Image
          src={resolveCdnImageUrl(imageProps.imageSrc)}
          alt={imageProps.alt || 'Media image'}
          width="100%"
          height={imageProps.height || 'auto'}
          objectFit={imageProps.objectFit || 'contain'}
          objectPosition={imageProps.objectPosition || 'center'}
          radius={imageProps.radius || 'md'}
          loading="eager"
          priority={true}
          aspectRatio={imageProps.aspectRatio}
          className="media-pattern-image"
          componentKey={get('image').key}
        />
      </div>
    );
  }

  // Fallback if neither is provided
  return null;
};

MediaPattern.displayName = 'MediaPattern';

export default MediaPattern;