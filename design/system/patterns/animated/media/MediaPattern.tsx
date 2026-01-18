'use client';

import React, { useState, useEffect } from 'react';
import { VideoShowcase } from '../../../components/media/VideoShowcase/VideoShowcase';
import { Image } from '../../../components/media/Image/Image';
import { componentProps, componentPresent } from '../../../core/utils/props';
import { CDN_BASE_URL } from '../../../core/utils/env';
import { getVideoThumbnailUrl, checkThumbnailExists } from '../../../core/utils/media';
import { PatternNode } from '../../../core/types/nodes';

interface MediaPatternProps extends PatternNode {
  sectionKey?: string;
  patternKey?: string;
}

interface VideoWithThumbnailCheckProps {
  videoUrl: string;
  posterUrl?: string;
  componentKey?: string;
  animation?: any;
}

// Component to handle async thumbnail existence check
const VideoWithThumbnailCheck: React.FC<VideoWithThumbnailCheckProps> = ({
  videoUrl,
  posterUrl,
  componentKey,
  animation
}) => {
  const [validPosterUrl, setValidPosterUrl] = useState<string | undefined>(posterUrl);
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    let mounted = true;

    const checkPoster = async () => {
      if (!posterUrl) {
        if (mounted) {
          setValidPosterUrl(undefined);
          setIsChecking(false);
        }
        return;
      }

      // Check if S3 thumbnail exists
      const exists = await checkThumbnailExists(posterUrl);

      if (mounted) {
        // Only use poster if it exists, otherwise undefined to let browser show first frame
        setValidPosterUrl(exists ? posterUrl : undefined);
        setIsChecking(false);
      }
    };

    checkPoster();

    return () => {
      mounted = false;
    };
  }, [posterUrl]);

  // Don't render until we've checked (prevents flashing)
  if (isChecking) {
    return null;
  }

  return (
    <VideoShowcase
      src={videoUrl}
      poster={validPosterUrl}
      autoPlay={false}
      muted={true}
      loop={true}
      controls={false}
      showPlayButton={true}
      variant="elevated"
      size="full"
      aspectRatio="16-9"
      radius="md"
      componentKey={componentKey}
      animation={animation}
    />
  );
};

const MediaPattern = ({ components = {}, sectionKey, patternKey }: MediaPatternProps) => {
  const get = componentProps(components);
  const renderIf = componentPresent(components);

  // If we have a video, render VideoShowcase with async thumbnail check
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

    // Use the VideoWithThumbnailCheck component to handle async checking
    return (
      <VideoWithThumbnailCheck
        videoUrl={videoUrl}
        posterUrl={derivedPosterUrl}
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