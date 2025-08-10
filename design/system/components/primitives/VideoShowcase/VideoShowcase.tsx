// ===============================================
// design/system/components/primitives/VideoShowcase/VideoShowcase.tsx
// VIDEO SHOWCASE PRIMITIVE COMPONENT
// ===============================================

import React, { forwardRef, useRef, useState } from 'react';
import { cn } from '../../../lib/utils';
import './VideoShowcase.css';
import './PlayButton.css';

export interface VideoShowcaseProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  variant?: 'default' | 'rounded' | 'elevated';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  aspectRatio?: '16-9' | '4-3' | '1-1' | 'auto';
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showPlayButton?: boolean;
}

export const VideoShowcase = forwardRef<HTMLVideoElement, VideoShowcaseProps>(({
  className,
  variant = 'elevated',
  size = 'lg',
  aspectRatio = '16-9',
  shadow = 'lg',
  radius = 'lg',
  autoPlay = false,
  muted = true,
  loop = true,
  controls = false,
  playsInline = true,
  showPlayButton = true,
  poster,
  ...props
}, ref) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const combinedRef = (node: HTMLVideoElement) => {
    if (typeof ref === 'function') ref(node);
    else if (ref) ref.current = node;
    videoRef.current = node;
  };

  const videoClasses = cn(
    'video-showcase',
    `video-showcase--${variant}`,
    `video-showcase--${size}`,
    `video-showcase--aspect-${aspectRatio}`,
    `video-showcase--shadow-${shadow}`,
    `video-showcase--radius-${radius}`,
    className
  );

  const handlePlayClick = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  return (
    <div className="video-container" onClick={handlePlayClick}>
      <video
        ref={combinedRef}
        className={videoClasses}
        autoPlay={autoPlay}
        muted={muted}
        loop={loop}
        controls={isPlaying && controls}
        playsInline={playsInline}
        poster={poster}
        {...props}
      />
      {showPlayButton && !isPlaying && (
        <button className="play-button" aria-label="Play video">
          <span className="play-button-icon" />
        </button>
      )}
    </div>
  );
});

VideoShowcase.displayName = 'VideoShowcase'; 