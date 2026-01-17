// ===============================================
// design/system/components/primitives/VideoShowcase/VideoShowcase.tsx
// VIDEO SHOWCASE PRIMITIVE COMPONENT
// ===============================================

import React, { forwardRef, useRef, useState } from 'react';
import { cn } from '../../../utils/cn';
import { Component } from '../../frames/component/Component';
import { Spinner } from '../../feedback/Spinner/Spinner';
import { Skeleton } from '../../feedback/LoadingSkeleton/LoadingSkeleton';
import { FadeIn } from '../../animations/FadeIn/FadeIn';
import { SlideIn } from '../../animations/SlideIn/SlideIn';
import { Opacity } from '../../animations/Opacity/Opacity';
import { Scale } from '../../animations/Scale/Scale';
import { AnimationConfig } from '../../../core/animations/types';
import './VideoShowcase.css';
import './PlayButton.css';

export interface VideoShowcaseProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  variant?: 'default' | 'rounded' | 'elevated';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  aspectRatio?: '16-9' | '4-3' | '1-1' | 'auto';
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showPlayButton?: boolean;
  /** Loading indicator type - 'skeleton' (default) fills the space with pulsing effect, 'spinner' shows centered spinner */
  loadingType?: 'skeleton' | 'spinner';
  componentKey?: string;
  /** Animation configuration following centralized animation system */
  animation?: AnimationConfig;
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
  loadingType = 'skeleton',
  poster,
  componentKey,
  animation,
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

  const videoContent = (
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
          {loadingType === 'skeleton' ? (
            <Skeleton
              width="100%"
              height="100%"
              variant="pulse"
              shape="rect"
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                borderRadius: 'inherit'
              }}
            />
          ) : (
            <Spinner size="sm" />
          )}
        </div>
      )}
      {showPlayButton && !isPlaying && !isLoading && (
        <button className="play-button" aria-label="Play video">
          <span className="play-button-icon" />
        </button>
      )}
    </div>
  );

  // Map EasingType to CSS easing string
  const mapEasing = (easing?: string): 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear' => {
    switch (easing) {
      case 'easeIn': return 'ease-in';
      case 'easeOut': return 'ease-out';
      case 'easeInOut': return 'ease-in-out';
      case 'linear': return 'linear';
      default: return 'ease-out';
    }
  };

  // Render with animation wrapper if configured
  const renderWithAnimation = () => {
    if (!animation || animation.type === 'none') {
      return videoContent;
    }

    if (animation.type === 'fadeIn') {
      const settings = animation.settings || {};
      return (
        <FadeIn
          direction={settings.direction || 'up'}
          duration={settings.duration || 800}
          delay={settings.delay || 0}
          distance={20}
          enableScrollTrigger={settings.enableScrollTrigger ?? false}
          triggerOffset={settings.triggerOffset || 100}
        >
          {videoContent}
        </FadeIn>
      );
    }

    if (animation.type === 'opacity') {
      const settings = animation.settings || {};
      return (
        <Opacity
          duration={settings.duration || 800}
          delay={settings.delay || 0}
          easing={mapEasing(settings.easing)}
          enableScrollTrigger={settings.enableScrollTrigger ?? false}
          triggerOffset={settings.triggerOffset || 100}
        >
          {videoContent}
        </Opacity>
      );
    }

    if (animation.type === 'slideIn') {
      const settings = animation.settings || {};
      return (
        <SlideIn
          direction={settings.direction || 'up'}
          duration={settings.duration || 800}
          delay={settings.delay || 0}
          distance={settings.distance || 20}
          easing={mapEasing(settings.easing)}
          enableScrollTrigger={settings.enableScrollTrigger ?? false}
          triggerOffset={settings.triggerOffset || 100}
        >
          {videoContent}
        </SlideIn>
      );
    }

    if (animation.type === 'scale') {
      const settings = animation.settings || {};
      return (
        <Scale
          from={settings.from || 0.8}
          to={settings.to || 1}
          duration={settings.duration || 800}
          delay={settings.delay || 0}
          easing={mapEasing(settings.easing)}
          enableScrollTrigger={settings.enableScrollTrigger ?? false}
          triggerOffset={settings.triggerOffset || 100}
        >
          {videoContent}
        </Scale>
      );
    }

    return videoContent;
  };

  return (
    <Component componentKey={componentKey}>
      {renderWithAnimation()}
    </Component>
  );
});

VideoShowcase.displayName = 'VideoShowcase'; 