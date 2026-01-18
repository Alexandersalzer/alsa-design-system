'use client';

import { VideoShowcase } from '../../../components/media/VideoShowcase/VideoShowcase';
import { Image } from '../../../components/media/Image/Image';
import { componentProps, componentPresent } from '../../../core/utils/props';
import { CDN_BASE_URL } from '../../../core/utils/env';
import { PatternNode } from '../../../core/types/nodes';

interface MediaPatternProps extends PatternNode {
  sectionKey?: string;
  patternKey?: string;
}

const MediaPattern = ({ components = {}, sectionKey, patternKey }: MediaPatternProps) => {
  const get = componentProps(components);
  const renderIf = componentPresent(components);
  
  // If we have a video, render VideoShowcase
  if (renderIf('video') && get('video').props.src) {
    const videoProps = get('video').props;

    // Auto-derive thumbnail from video path if no poster provided
    // Backend stores thumbnails at: user-{id}/thumbnails/{video-name}.jpg
    // Video path example: /2194716412/videos/Intro+Video-2.mov
    // Thumbnail path: /2194716412/thumbnails/Intro+Video-2.jpg
    let posterUrl = videoProps.poster ? `${CDN_BASE_URL}${videoProps.poster}` : undefined;

    if (!posterUrl && videoProps.src) {
      // Derive thumbnail URL from video URL
      const videoPath = videoProps.src;
      const thumbnailPath = videoPath
        .replace('/videos/', '/thumbnails/')
        .replace(/\.(mp4|mov|avi|webm|mkv)$/i, '.jpg');
      posterUrl = `${CDN_BASE_URL}${thumbnailPath}`;
    }

    return (
      <VideoShowcase
        src={`${CDN_BASE_URL}${videoProps.src}`}
        poster={posterUrl}
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
    return (
      <Image
        src={`${CDN_BASE_URL}${get('image').props.imageSrc}`}
        alt={get('image').props.alt || 'Media image'}
        width="100%"
        height="auto"
        objectFit="cover"
        radius="md"
        loading="eager"
        priority={true}
        aspectRatio="16/9"
        className="media-pattern-image"
        componentKey={get('image').key}
      />
    );
  }
  
  // Fallback if neither is provided
  return null;
};

MediaPattern.displayName = 'MediaPattern';

export default MediaPattern;