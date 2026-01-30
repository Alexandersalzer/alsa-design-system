// ===============================================
// design/system/components/primitives/VideoShowcase/VideoShowcase.tsx
// VIDEO SHOWCASE PRIMITIVE COMPONENT
// ===============================================

import React, { forwardRef, useRef, useState, useId, useEffect, useCallback } from 'react';
import { cn } from '../../../utils/cn';
import { Component } from '../../frames/component/Component';
import { Video } from '../Video/Video';
import { FadeIn } from '../../animations/FadeIn/FadeIn';
import { SlideIn } from '../../animations/SlideIn/SlideIn';
import { Opacity } from '../../animations/Opacity/Opacity';
import { Scale } from '../../animations/Scale/Scale';
import { AnimationConfig } from '../../../core/animations/types';
import { CDN_BASE_URL } from '../../../core/utils/env';
import { getVideoThumbnailUrl } from '../../../core/utils/media';
import './VideoShowcase.css';
import './PlayButton.css';
import './DeviceFrames.css';

// Custom event for pausing other videos when one starts playing
const VIDEO_PLAY_EVENT = 'videoShowcase:play';

interface VideoPlayEventDetail {
  instanceId: string;
}

export interface VideoShowcaseProps extends React.VideoHTMLAttributes<HTMLVideoElement> {
  variant?: 'default' | 'rounded' | 'elevated';
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  aspectRatio?: '16-9' | '9-16' | '4-3' | '4-5' | '1-1' | '2-3' | 'auto';
  /** Object fit behavior - 'cover' crops to fill, 'contain' fits within bounds */
  objectFit?: 'contain' | 'cover' | 'fill' | 'none';
  radius?: 'none' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showPlayButton?: boolean;
  componentKey?: string;
  /** Animation configuration following centralized animation system */
  animation?: AnimationConfig;
  /** Max height for the video */
  maxHeight?: string | number;
  /** Device frame wrapper - adds realistic device mockup around video */
  frame?: 'none' | 'iphone-14-pro' | 'iphone-se' | 'pixel-7';
  /** Frame color (only for certain frames) */
  frameColor?: 'black' | 'white' | 'silver' | 'gold';
  /** Frame size in pixels (controls max-width) */
  frameSize?: number;
}

export const VideoShowcase = forwardRef<HTMLVideoElement, VideoShowcaseProps>(({
  className,
  variant = 'elevated',
  size = 'lg',
  aspectRatio = '16-9',
  objectFit = 'contain',
  radius = 'lg',
  autoPlay = false,
  muted: initialMuted = true,
  loop = true,
  controls = false,
  playsInline = true,
  showPlayButton = true,
  poster,
  componentKey,
  animation,
  maxHeight,
  frame = 'none',
  frameColor = 'black',
  frameSize,
  ...props
}, ref) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(initialMuted);
  const [volume, setVolume] = useState(0.7); // Default 70%
  const [showVolumeIndicator, setShowVolumeIndicator] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const volumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const instanceId = useId();

  // Listen for other videos starting to play and pause this one
  const handleOtherVideoPlay = useCallback((event: Event) => {
    const customEvent = event as CustomEvent<VideoPlayEventDetail>;
    if (customEvent.detail.instanceId !== instanceId && videoRef.current && !videoRef.current.paused) {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  }, [instanceId]);

  useEffect(() => {
    window.addEventListener(VIDEO_PLAY_EVENT, handleOtherVideoPlay);
    return () => {
      window.removeEventListener(VIDEO_PLAY_EVENT, handleOtherVideoPlay);
    };
  }, [handleOtherVideoPlay]);

  // Pause video when it scrolls out of view
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting && videoRef.current && !videoRef.current.paused) {
            videoRef.current.pause();
            setIsPlaying(false);
          }
        });
      },
      { threshold: 0.2 } // Pause when less than 20% visible
    );

    observer.observe(containerRef.current);

    return () => {
      observer.disconnect();
    };
  }, []);

  const videoClasses = cn(
    'video-showcase',
    `video-showcase--${variant}`,
    `video-showcase--${size}`,
    `video-showcase--aspect-${aspectRatio}`,
    `video-showcase--radius-${radius}`,
    className
  );

  // Process video URL and derive poster/thumbnail
  const videoSrc = typeof props.src === 'string' ? props.src : '';
  const videoUrl = videoSrc.startsWith('http') ? videoSrc : `${CDN_BASE_URL}${videoSrc}`;

  // Priority 1: Use hardcoded poster if provided
  let derivedPosterUrl = poster ? (poster.startsWith('http') ? poster : `${CDN_BASE_URL}${poster}`) : undefined;

  // Priority 2: Auto-derive thumbnail from video path
  // Backend stores thumbnails at: user-{id}/thumbnails/{video-name}.jpg
  if (!derivedPosterUrl) {
    derivedPosterUrl = getVideoThumbnailUrl(videoUrl);
  }

  // Find the video element inside the container and control it
  // Also listen to native play/pause events to keep state in sync
  useEffect(() => {
    if (containerRef.current) {
      const videoElement = containerRef.current.querySelector('video');
      if (videoElement) {
        videoRef.current = videoElement;
        
        // Handle native play event (from browser controls)
        const handleNativePlay = () => {
          // Dispatch event to pause all other videos
          window.dispatchEvent(new CustomEvent<VideoPlayEventDetail>(VIDEO_PLAY_EVENT, {
            detail: { instanceId }
          }));
          setIsPlaying(true);
          // Unmute when starting to play
          if (videoElement.muted) {
            videoElement.muted = false;
            setIsMuted(false);
          }
        };
        
        // Handle native pause event (from browser controls)
        const handleNativePause = () => {
          setIsPlaying(false);
        };
        
        videoElement.addEventListener('play', handleNativePlay);
        videoElement.addEventListener('pause', handleNativePause);
        
        return () => {
          videoElement.removeEventListener('play', handleNativePlay);
          videoElement.removeEventListener('pause', handleNativePause);
        };
      }
    }
  }, [instanceId]);

  const handlePlayClick = () => {
    if (videoRef.current) {
      if (videoRef.current.paused) {
        // Dispatch event to pause all other videos
        window.dispatchEvent(new CustomEvent<VideoPlayEventDetail>(VIDEO_PLAY_EVENT, {
          detail: { instanceId }
        }));
        
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

  const handleVolumeChange = (delta: number) => {
    if (videoRef.current) {
      const newVolume = Math.max(0, Math.min(1, volume + delta));
      setVolume(newVolume);
      videoRef.current.volume = newVolume;
      
      // Unmute if volume is increased
      if (newVolume > 0 && isMuted) {
        videoRef.current.muted = false;
        setIsMuted(false);
      }
      
      // Show volume indicator
      setShowVolumeIndicator(true);
      
      // Clear existing timeout
      if (volumeTimeoutRef.current) {
        clearTimeout(volumeTimeoutRef.current);
      }
      
      // Hide indicator after 1.5s
      volumeTimeoutRef.current = setTimeout(() => {
        setShowVolumeIndicator(false);
      }, 1500);
    }
  };

  // Cleanup timeout on unmount
  React.useEffect(() => {
    return () => {
      if (volumeTimeoutRef.current) {
        clearTimeout(volumeTimeoutRef.current);
      }
    };
  }, []);

  const videoContent = (
    <div
      ref={containerRef}
      className={cn(
        "video-container",
        "video-container--clickable",
        `video-container--radius-${radius}`
      )}
    >
      <Video
        src={videoUrl}
        poster={derivedPosterUrl}
        width="100%"
        maxHeight={maxHeight}
        aspectRatio={aspectRatio === '16-9' ? '16/9' : aspectRatio === '9-16' ? '9/16' : aspectRatio === '4-3' ? '4/3' : aspectRatio === '4-5' ? '4/5' : aspectRatio === '1-1' ? '1/1' : aspectRatio === '2-3' ? '2/3' : 'auto'}
        objectFit={objectFit}
        radius={frame !== 'none' ? 'none' : (radius === 'full' ? 'xl' : radius)}
        loading="eager"
        priority={true}
        autoPlay={autoPlay}
        muted={isMuted}
        loop={loop}
        controls={false}
        playsInline={playsInline}
        preload="metadata"
        className={videoClasses}
      />
      {/* Clickable overlay for play/pause - covers entire video */}
      <div 
        className="video-container__click-overlay"
        onClick={handlePlayClick}
        aria-label={isPlaying ? "Pause video" : "Play video"}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handlePlayClick();
          }
        }}
      />
      {showPlayButton && !isPlaying && (
        <button className="play-button" aria-label="Play video" onClick={handlePlayClick}>
          <span className="play-button-icon" />
        </button>
      )}
    </div>
  );

  // Wrap video in device frame if specified
  const wrappedContent = frame !== 'none' ? (
    <div 
      className={cn("device-frame", `device-frame--${frame}`, `device-frame--${frameColor}`)}
      style={frameSize ? { maxWidth: `${frameSize}px` } : undefined}
    >
      <div className="device-frame__screen">
        {videoContent}
      </div>
      <div className="device-frame__bezel" />
      {frame === 'iphone-14-pro' && (
        <>
          {/* Volume buttons (left side) */}
          <button
            className="device-frame__button device-frame__button--volume-up"
            onClick={(e) => {
              e.stopPropagation();
              handleVolumeChange(0.1);
            }}
            aria-label="Volume up"
          />
          <button
            className="device-frame__button device-frame__button--volume-down"
            onClick={(e) => {
              e.stopPropagation();
              handleVolumeChange(-0.1);
            }}
            aria-label="Volume down"
          />
          {/* Volume indicator */}
          {showVolumeIndicator && (
            <div className="device-frame__volume-indicator">
              <div className="device-frame__volume-bar">
                <div 
                  className="device-frame__volume-fill" 
                  style={{ width: `${volume * 100}%` }}
                />
              </div>
              <span className="device-frame__volume-text">{Math.round(volume * 100)}%</span>
            </div>
          )}
        </>
      )}
    </div>
  ) : videoContent;

  // Map EasingType to CSS easing string
  const mapEasing = (easing?: string): 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'linear' => {
    switch (easing) {
      case 'easeIn': return 'ease-in';
      case 'easeOut': return 'ease-out';
      case 'easeInOut': return 'ease-in-out';
      case 'linear': return 'linear';
      default: return 'ease';
    }
  };

  const renderWithAnimation = () => {
    if (!animation) {
      return wrappedContent;
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
          {wrappedContent}
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
          {wrappedContent}
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
          {wrappedContent}
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
          {wrappedContent}
        </Scale>
      );
    }

    return wrappedContent;
  };

  return (
    <Component componentKey={componentKey}>
      {renderWithAnimation()}
    </Component>
  );
});

VideoShowcase.displayName = 'VideoShowcase'; 