import React, { useRef, useEffect } from 'react';
import styles from './VideoBackground.module.css';

export type VideoFit = 'cover' | 'contain' | 'fill';
export type OverlayType = 'none' | 'dark' | 'light' | 'gradient';

export interface VideoBackgroundProps {
  src: string; // Video URL eller path
  poster?: string; // Poster image (visas före video laddar)
  fit?: VideoFit;
  overlayType?: OverlayType;
  overlayOpacity?: number; // 0.0 - 1.0
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

  return (
    <div className={styles.container}>
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
