import React, { useId } from 'react';
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

  /**
   * accent = motivet fylls med exakt accentfärg (--foundation-accent-500).
   * Fungerar för vilken färg som helst. Kräver bild med vit bakgrund + svart motiv (eller tydlig kontrast).
   */
  tint?: 'accent' | 'none';

  /** Oanvänd (behålls för API). Accent använder alltid samma färg i light/dark. */
  themeAware?: boolean;
}

/** SVG preserveAspectRatio som motsvarar background-size/position */
function maskPreserveAspectRatio(size: string, position: string): string {
  if (size === 'cover') return 'xMidYMid slice';
  if (size === 'contain') return 'xMidYMid meet';
  const pos = position.toLowerCase();
  const x = pos.includes('left') ? 'Min' : pos.includes('right') ? 'Max' : 'Mid';
  const y = pos.includes('top') ? 'Min' : pos.includes('bottom') ? 'Max' : 'Mid';
  return `${x}${y} meet`;
}

/**
 * ImageBackground - Static image background for sections and pages
 *
 * Med tint="accent": bilden används som mask och fylls med accentfärgen (valfri färg).
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
  tint = 'none',
  themeAware = false,
}) => {
  const fadeClass = fadeEdge !== 'none' ? styles[`fade${fadeEdge.charAt(0).toUpperCase() + fadeEdge.slice(1)}`] : '';
  const maskId = useId().replace(/:/g, '-');
  const filterId = useId().replace(/:/g, '-');
  const useAccentMask = tint === 'accent' && src;

  return (
    <>
      {/* Image Layer: antingen mask-baserad accent eller vanlig bakgrundsbild */}
      {useAccentMask ? (
        <div
          className={`${styles.imageBackground} ${styles.accentMaskWrapper} ${fadeClass}`.trim()}
          style={{
            opacity,
            color: 'var(--foundation-accent-500)',
            // @ts-expect-error CSS custom property
            '--fade-strength': fadeStrength,
          }}
          aria-hidden="true"
        >
          <svg
            className={styles.accentMaskSvg}
            preserveAspectRatio="none"
            viewBox="0 0 100 100"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
          >
            <defs>
              <filter id={filterId} colorInterpolationFilters="sRGB">
                <feColorMatrix
                  type="matrix"
                  values="-1 0 0 0 1  0 -1 0 0 1  0 0 -1 0 1  0 0 0 1 0"
                />
              </filter>
              <mask id={maskId}>
                <image
                  href={src}
                  width="100%"
                  height="100%"
                  preserveAspectRatio={maskPreserveAspectRatio(size, position)}
                  filter={`url(#${filterId})`}
                />
              </mask>
            </defs>
            <rect width="100%" height="100%" fill="currentColor" mask={`url(#${maskId})`} />
          </svg>
        </div>
      ) : (
        <div
          className={`${styles.imageBackground} ${fadeClass}`.trim()}
          style={{
            backgroundImage: `url(${src})`,
            backgroundSize: size,
            backgroundPosition: position,
            backgroundRepeat: repeat,
            opacity,
            // @ts-expect-error CSS custom property
            '--fade-strength': fadeStrength,
          }}
          aria-hidden="true"
        />
      )}

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
