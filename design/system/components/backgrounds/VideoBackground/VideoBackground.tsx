import React, { useRef, useEffect } from 'react';
import styles from './VideoBackground.module.css';

export type VideoFit = 'cover' | 'contain' | 'fill';
export type OverlayType = 'none' | 'dark' | 'light' | 'gradient';
export type FadeEdge = 'top' | 'bottom' | 'both' | 'none';

export interface VideoBackgroundProps {
  src: string; // Video URL eller path
  poster?: string; // Poster image (visas före video laddar)
  fit?: VideoFit;
  overlayType?: OverlayType;
  overlayOpacity?: number; // 0.0 - 1.0
  fadeEdge?: FadeEdge;
  fadeStrength?: number; // 0.0 - 1.0
  muted?: boolean;
  loop?: boolean;
  autoPlay?: boolean;
  playbackRate?: number; // 0.5 - 2.0 (slow motion / speed up)
  className?: string;
}

export const VideoBackground: React.FC<VideoBackgroundProps> = ({
  src,
  poster,
  fit = 'cover',
  overlayType = 'dark',
  overlayOpacity = 0.3,
  fadeEdge = 'none',
  fadeStrength = 0.15,
  muted = true,
  loop = true,
  autoPlay = true,
  playbackRate = 1.0,
  className = '',
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && playbackRate !== 1.0) {
      videoRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  const combinedClassName = [
    styles.videoBackground,
    styles[fit],
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const overlayClassName = [
    styles.overlay,
    overlayType !== 'none' ? styles[overlayType] : '',
  ]
    .filter(Boolean)
    .join(' ');

  const overlayStyle = {
    '--overlay-opacity': overlayOpacity,
  } as React.CSSProperties;

  const getFadeStyle = (): React.CSSProperties => {
    if (fadeEdge === 'none') return {};
    
    const fadePercentage = Math.round(fadeStrength * 100);
    let maskImage = '';
    
    if (fadeEdge === 'top') {
      maskImage = `linear-gradient(to bottom, transparent 0%, rgba(0,0,0,1) ${fadePercentage}%)`;
    } else if (fadeEdge === 'bottom') {
      maskImage = `linear-gradient(to top, transparent 0%, rgba(0,0,0,1) ${fadePercentage}%)`;
    } else if (fadeEdge === 'both') {
      maskImage = `linear-gradient(to bottom, transparent 0%, rgba(0,0,0,1) ${fadePercentage}%, rgba(0,0,0,1) ${100 - fadePercentage}%, transparent 100%)`;
    }
    
    return {
      maskImage,
      WebkitMaskImage: maskImage,
    };
  };

  return (
    <div className={styles.container} style={getFadeStyle()}>
      <video
        ref={videoRef}
        className={combinedClassName}
        src={src}
        poster={poster}
        muted={muted}
        loop={loop}
        autoPlay={autoPlay}
        playsInline
        disablePictureInPicture
        controlsList="nodownload nofullscreen noremoteplayback"
      />
      {overlayType !== 'none' && (
        <div className={overlayClassName} style={overlayStyle} />
      )}
    </div>
  );
};
