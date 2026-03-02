// ===============================================
// design/system/components/primitives/VideoShowcase/VideoShowcase.tsx
// VIDEO SHOWCASE PRIMITIVE COMPONENT
// ===============================================

import React, { forwardRef, useRef, useState, useId, useEffect, useCallback } from 'react';
import { cn } from '../../../utils/cn';
import { Component } from '../../frames/component/Component';
import { Video } from '../Video/Video';
import { Flag } from '../Flag/Flag';
import { FadeIn } from '../../animations/FadeIn/FadeIn';
import { SlideIn } from '../../animations/SlideIn/SlideIn';
import { Opacity } from '../../animations/Opacity/Opacity';
import { Scale } from '../../animations/Scale/Scale';
import { AnimationConfig } from '../../animations/types';
import { CDN_BASE_URL } from '../../../core/utils/env';
import { getVideoThumbnailUrl } from '../../../core/utils/media';
import { IframeEmbed } from '../../thirdparty/embed/IframeEmbed';
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
  /** Mobile-specific frame size in pixels */
  mobileFrameSize?: number;
  /** Max width in pixels for video on mobile (for videos without frame) */
  mobileMaxWidth?: number;
  /** Overlay element (e.g., flag badge) positioned in top-right corner */
  overlay?: React.ReactNode;
  /** Country code or emoji for flag badge overlay (e.g., 'de', '🇩🇪', 'germany') */
  flagCountry?: string;
  /** YouTube embed URL - when provided, clicking the thumbnail will load YouTube video instead of native video */
  youtubeUrl?: string;
  /** When set, clicking the video/thumbnail opens this URL instead of playing inline. Opens in new tab when openInNewTab is true. */
  href?: string;
  /** When href is set, open link in new tab. Default true. */
  openInNewTab?: boolean;
  /** Callback när videon börjar spela (t.ex. för att pausa karusell). */
  onPlay?: () => void;
  /** Callback när videon pausas. */
  onPause?: () => void;
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
  mobileFrameSize,
  mobileMaxWidth,
  overlay,
  flagCountry,
  youtubeUrl,
  href,
  openInNewTab = true,
  onPlay: onPlayCallback,
  onPause: onPauseCallback,
  ...props
}, ref) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(initialMuted);
  const [volume, setVolume] = useState(0.7); // Default 70%
  const [showVolumeIndicator, setShowVolumeIndicator] = useState(false);
  const [showYouTube, setShowYouTube] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const volumeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const allowPauseByIntersectionRef = useRef(true);
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

  // Pause video when it scrolls out of view (skip right after user clicks play to avoid play() interrupted by pause())
  useEffect(() => {
    if (!containerRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (
            allowPauseByIntersectionRef.current &&
            !entry.isIntersecting &&
            videoRef.current &&
            !videoRef.current.paused
          ) {
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

  // Priority 2: Auto-derive thumbnail from video path (only if not using YouTube)
  // Backend stores thumbnails at: user-{id}/thumbnails/{video-name}.jpg
  if (!derivedPosterUrl && !youtubeUrl && videoSrc) {
    derivedPosterUrl = getVideoThumbnailUrl(videoUrl);
  }

  // Poster-only mode: no video src – show only thumbnail (no "video missing")
  const hasNoVideo = !videoSrc || String(videoSrc).trim() === '';

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
          onPlayCallback?.();
          // Unmute when starting to play
          if (videoElement.muted) {
            videoElement.muted = false;
            setIsMuted(false);
          }
        };
        
        // Handle native pause event (from browser controls)
        const handleNativePause = () => {
          setIsPlaying(false);
          onPauseCallback?.();
        };
        
        videoElement.addEventListener('play', handleNativePlay);
        videoElement.addEventListener('pause', handleNativePause);
        
        return () => {
          videoElement.removeEventListener('play', handleNativePlay);
          videoElement.removeEventListener('pause', handleNativePause);
        };
      }
    }
  }, [instanceId, onPlayCallback, onPauseCallback]);

  const handlePlayClick = () => {
    if (youtubeUrl) {
      setShowYouTube(true);
      setIsPlaying(true);
      return;
    }
    if (href) {
      if (openInNewTab) {
        window.open(href, '_blank', 'noopener,noreferrer');
      } else {
        window.location.href = href;
      }
      return;
    }
    const video = videoRef.current ?? (containerRef.current?.querySelector('video') as HTMLVideoElement | null);
    if (video) {
      if (!videoRef.current) videoRef.current = video;
      if (video.paused) {
        onPlayCallback?.();
        window.dispatchEvent(new CustomEvent<VideoPlayEventDetail>(VIDEO_PLAY_EVENT, {
          detail: { instanceId }
        }));
        allowPauseByIntersectionRef.current = false;
        setTimeout(() => {
          allowPauseByIntersectionRef.current = true;
        }, 500);
        video.play();
        setIsPlaying(true);
        if (isMuted) {
          video.muted = false;
          setIsMuted(false);
        }
      } else {
        onPauseCallback?.();
        video.pause();
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

  const aspectRatioCss = aspectRatio === '16-9' ? '16/9' : aspectRatio === '9-16' ? '9/16' : aspectRatio === '4-3' ? '4/3' : aspectRatio === '4-5' ? '4/5' : aspectRatio === '1-1' ? '1/1' : aspectRatio === '2-3' ? '2/3' : 'auto';

  const getIframeRadius = (): 'none' | 'sm' | 'md' | 'lg' => {
    if (frame !== 'none') return 'none';
    if (radius === 'xl' || radius === 'full') return 'lg';
    return radius as 'none' | 'sm' | 'md' | 'lg';
  };

  const getAspectRatioStyle = (): React.CSSProperties => {
    const ratioMap: Record<string, string> = {
      '16-9': '56.25%',
      '9-16': '177.78%',
      '4-3': '75%',
      '4-5': '125%',
      '1-1': '100%',
      '2-3': '150%',
    };
    const paddingBottom = ratioMap[aspectRatio] || 'auto';
    if (paddingBottom === 'auto') {
      return { height: maxHeight || '600px' };
    }
    return {
      position: 'relative',
      width: '100%',
      paddingBottom,
      height: 0,
      overflow: 'hidden',
    };
  };

  const youtubeEmbedUrl = youtubeUrl && showYouTube
    ? youtubeUrl.includes('?')
      ? `${youtubeUrl}&autoplay=1`
      : `${youtubeUrl}?autoplay=1`
    : youtubeUrl;

  const videoContent = showYouTube && youtubeEmbedUrl ? (
    <div
      ref={containerRef}
      className={cn(
        "video-container",
        `video-container--radius-${radius}`,
        mobileMaxWidth !== undefined && "video-container--mobile-max-width"
      )}
      style={mobileMaxWidth ? { '--mobile-max-width': `${mobileMaxWidth}px` } as React.CSSProperties : undefined}
    >
      <div style={getAspectRatioStyle()}>
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
        }}>
          <IframeEmbed
            src={youtubeEmbedUrl}
            width="100%"
            height="100%"
            radius={getIframeRadius()}
            border={false}
            title="Video showcase"
            allowFullscreen={true}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          />
        </div>
      </div>
      {(overlay || flagCountry) && (
        <div
          className="video-container__overlay"
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            zIndex: 10,
            pointerEvents: 'none'
          }}
        >
          {overlay}
          {flagCountry && <Flag country={flagCountry} size="sm" variant="rounded" />}
        </div>
      )}
    </div>
  ) : (
    <div
      ref={containerRef}
      className={cn(
        "video-container",
        "video-container--clickable",
        `video-container--radius-${radius}`,
        mobileMaxWidth !== undefined && "video-container--mobile-max-width"
      )}
      style={mobileMaxWidth ? { '--mobile-max-width': `${mobileMaxWidth}px` } as React.CSSProperties : undefined}
    >
      {youtubeUrl && !showYouTube ? (
        <div
          style={{
            width: '100%',
            aspectRatio: aspectRatioCss,
            maxHeight: maxHeight,
            position: 'relative',
            overflow: 'hidden',
            borderRadius: frame !== 'none' ? '0' : radius === 'full' ? 'var(--radius-xl)' : `var(--radius-${radius})`,
          }}
        >
          <img
            src={derivedPosterUrl}
            alt="Video thumbnail"
            style={{
              width: '100%',
              height: '100%',
              objectFit: objectFit,
              display: 'block',
            }}
          />
        </div>
      ) : hasNoVideo ? (
        <div
          className={cn(videoClasses, "video-showcase--poster-only")}
          style={{
            width: '100%',
            aspectRatio: aspectRatioCss,
            maxHeight: maxHeight ?? undefined,
            position: 'relative',
            overflow: 'hidden',
            borderRadius: 'var(--radius-lg)',
            background: derivedPosterUrl ? undefined : 'var(--surface-muted)'
          }}
        >
          {derivedPosterUrl ? (
            <img
              src={derivedPosterUrl}
              alt=""
              className={cn(
                `video-element--object-fit-${objectFit}`,
                frame !== 'none' ? '' : (radius === 'full' ? 'video-element--radius-xl' : `video-element--radius-${radius}`)
              )}
              style={{
                width: '100%',
                height: '100%',
                objectFit: objectFit,
                display: 'block'
              }}
            />
          ) : null}
        </div>
      ) : (
        <Video
          src={videoUrl}
          poster={derivedPosterUrl}
          width="100%"
          maxHeight={maxHeight}
          aspectRatio={aspectRatioCss}
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
      )}
      {/* Clickable overlay for play/pause - covers entire video */}
      <div 
        className="video-container__click-overlay"
        onClick={handlePlayClick}
        aria-label={href || youtubeUrl ? "Öppna video" : (isPlaying ? "Pause video" : "Play video")}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handlePlayClick();
          }
        }}
      />
      {showPlayButton && (!isPlaying || href || youtubeUrl || hasNoVideo) && (
        <button className="play-button" aria-label={href || youtubeUrl ? "Öppna video" : "Play video"} onClick={handlePlayClick}>
          <span className="play-button-icon" />
        </button>
      )}
      {(overlay || flagCountry) && (
        <div
          className="video-container__overlay"
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            zIndex: 10,
            pointerEvents: 'none'
          }}
        >
          {overlay}
          {flagCountry && <Flag country={flagCountry} size="sm" variant="rounded" />}
        </div>
      )}
    </div>
  );

  // Build frame style with responsive size support
  const frameStyle: React.CSSProperties | undefined = frameSize ? {
    '--frame-size': `${frameSize}px`,
    '--mobile-frame-size': mobileFrameSize ? `${mobileFrameSize}px` : `${frameSize}px`,
  } as React.CSSProperties : undefined;

  // Wrap video in device frame if specified
  const wrappedContent = frame !== 'none' ? (
    <div 
      className={cn("device-frame", `device-frame--${frame}`, `device-frame--${frameColor}`)}
      style={frameStyle}
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

  const rootStyle = 'style' in props && props.style && typeof props.style === 'object' ? props.style as React.CSSProperties : undefined;
  return (
    <Component componentKey={componentKey} className={className} style={rootStyle}>
      {renderWithAnimation()}
    </Component>
  );
});

VideoShowcase.displayName = 'VideoShowcase'; 