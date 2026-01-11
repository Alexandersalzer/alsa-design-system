// ===============================================
// design/system/components/primitives/VideoShowcase/VideoShowcase.tsx
// VIDEO SHOWCASE PRIMITIVE COMPONENT
// ===============================================

import React, { forwardRef, useRef, useState } from 'react';
import { cn } from '../../../utils/cn';
import { Component } from '../../frames/component/Component';
import { Spinner } from '../../feedback/Spinner/Spinner';
import { Skeleton } from '../../feedback/LoadingSkeleton/LoadingSkeleton';
import './VideoShowcase.css';
import './PlayButton.css';

export interface VideoShowcaseProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  variant?: 'default' | 'rounded' | 'elevated';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  aspectRatio?: '16-9' | '4-3' | '1-1' | 'auto';
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showPlayButton?: boolean;
  componentKey?: string;
}

export const VideoShowcase = forwardRef<HTMLVideoElement, VideoShowcaseProps>(({
  className,
  variant = 'elevated',
  size = 'lg',
  aspectRatio = '16-9',
  radius = 'lg',
  autoPlay = false,
  muted: initialMuted = true,
  loop = true,
  controls = false,
  playsInline = true,
  showPlayButton = true,
  poster,
  componentKey,
  ...props
}, ref) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(initialMuted);
  const [isLoading, setIsLoading] = useState(true);
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
    `video-showcase--radius-${radius}`,
    className
  );

  const handlePlayClick = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        videoRef.current.play();
        setIsPlaying(true);
        // Unmute when starting to play
        if (isMuted) {
          videoRef.current.muted = false;
          setIsMuted(false);
        }
      } else {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  const handleLoadedData = () => {
    setIsLoading(false);
  };

  const handleLoadStart = () => {
    setIsLoading(true);
  };

  const handleError = () => {
    setIsLoading(false);
  };

  return (
    <Component componentKey={componentKey}>
      <div
        className={cn(
          "video-container",
          `video-container--radius-${radius}`,
          isLoading && "video-container--loading"
        )}
        onClick={handlePlayClick}
      >
        <video
          ref={combinedRef}
          className={videoClasses}
          autoPlay={autoPlay}
          muted={isMuted}
          loop={loop}
          controls={isPlaying && controls}
          playsInline={playsInline}
          poster={poster}
          onLoadedData={handleLoadedData}
          onLoadStart={handleLoadStart}
          onError={handleError}
          {...props}
        />
        {isLoading && (
          <div className="video-loading-overlay">
            <Spinner size="sm" />
          </div>
        )}
        {showPlayButton && !isPlaying && !isLoading && (
          <button className="play-button" aria-label="Play video">
            <span className="play-button-icon" />
          </button>
        )}
      </div>
    </Component>
  );
});

VideoShowcase.displayName = 'VideoShowcase'; 