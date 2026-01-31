import React from 'react';
import styles from './ImageBackground.module.css';
import { FadeEdge } from '../types';

export interface ImageBackgroundProps {
  /** URL to the background image */
  src: string;
  
  /** Background size (CSS background-size) */
  size?: 'cover' | 'contain' | 'auto' | string;
  
  /** Background position (CSS background-position) */
  position?: string;
  
  /** Background repeat (CSS background-repeat) */
  repeat?: 'repeat' | 'no-repeat' | 'repeat-x' | 'repeat-y' | 'space' | 'round';
  
  /** Image opacity (0-1) */
  opacity?: number;
  
  /** Optional overlay color on top of image */
  overlay?: string | false;
  
  /** Overlay opacity (0-1) */
  overlayOpacity?: number;
  
  /** Fade edge direction */
  fadeEdge?: FadeEdge;
  
  /** Fade strength (0-1) */
  fadeStrength?: number;
}

/**
 * ImageBackground - Static image background for sections and pages
 * 
 * Features:
 * - Configurable size, position, repeat
 * - Opacity control
 * - Optional color overlay
 * - Edge fading support
 * 
 * @example
 * <ImageBackground 
 *   src="/hero.jpg"
 *   size="cover"
 *   position="center"
 *   opacity={0.6}
 * />
 */
export const ImageBackground: React.FC<ImageBackgroundProps> = ({
  src,
  size = 'auto',
  position = 'center',
  repeat = 'repeat',
  opacity = 1,
  overlay = false,
  overlayOpacity = 0.5,
  fadeEdge = 'none',
  fadeStrength = 0.15,
}) => {
  const fadeClass = fadeEdge !== 'none' ? styles[`fade${fadeEdge.charAt(0).toUpperCase() + fadeEdge.slice(1)}`] : '';

  return (
    <>
      {/* Image Layer */}
      <div
        className={`${styles.imageBackground} ${fadeClass}`}
        style={{
          backgroundImage: `url(${src})`,
          backgroundSize: size,
          backgroundPosition: position,
          backgroundRepeat: repeat,
          opacity,
          // @ts-ignore - CSS custom property
          '--fade-strength': fadeStrength,
        }}
        aria-hidden="true"
      />

      {/* Optional Overlay */}
      {overlay && typeof overlay === 'string' && (
        <div
          className={styles.overlay}
          style={{
            backgroundColor: overlay,
            opacity: overlayOpacity,
          }}
          aria-hidden="true"
        />
      )}
    </>
  );
};
