import React from 'react';
import styles from './ImageBackground.module.css';
import { FadeEdge } from '../types';
import { AccentTintSvg } from '../AccentTintSvg';

export interface ImageBackgroundProps {
  /** URL to the background image */
  src: string;

  /** cover = fyll (kan croppa), contain = hela bilden syns, auto = naturlig storlek */
  size?: 'cover' | 'contain' | 'auto' | string;

  /** Background position (CSS background-position): center, top, bottom, "top center" osv. */
  position?: string;

  /** Lås bildramen till ett förhållande (t.ex. "16/9", "21/9"). Bilden anpassas inom ramen. */
  aspectRatio?: string;

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
   * accent = platt färg (en nyans). accent-luminance = bildens ljus/mörk-skala bevaras, accent som nyans.
   */
  tint?: 'accent' | 'accent-luminance' | 'none';

  /** Styrka på accent-masken. 0–1 = opacity; >1 = full opacity + maskkontrast. Default 1.2. */
  tintStrength?: number;

  /** Valfri tintfärg (hex, rgb eller var()) för varmare accent-tint. Om ej satt används --foundation-accent-500. */
  tintColor?: string;

  /** Oanvänd (behålls för API). Accent använder alltid samma färg i light/dark. */
  themeAware?: boolean;
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
  aspectRatio,
  repeat = 'repeat',
  opacity = 1,
  overlay = false,
  overlayOpacity = 0.5,
  fadeEdge = 'none',
  fadeStrength = 0.15,
  tint = 'none',
  tintStrength = 1.2,
  tintColor,
  themeAware = false,
}) => {
  const fadeClass = fadeEdge !== 'none' ? styles[`fade${fadeEdge.charAt(0).toUpperCase() + fadeEdge.slice(1)}`] : '';
  const useAccentTint = (tint === 'accent' || tint === 'accent-luminance') && src;
  const tintVariant = tint === 'accent-luminance' ? 'luminance' : 'solid';
  const sizeClass = size === 'contain' ? styles.accentMaskWrapperContain : '';

  const imageLayer =
    useAccentTint ? (
      <div
        className={`${styles.imageBackground} ${styles.accentMaskWrapper} ${sizeClass} ${fadeClass}`.trim()}
        style={{
          opacity,
          // @ts-expect-error CSS custom property
          '--fade-strength': fadeStrength,
        }}
        aria-hidden="true"
      >
        <AccentTintSvg
          src={src}
          variant={tintVariant}
          size={size}
          position={position}
          strength={tintStrength}
          tintColor={tintColor}
          svgClassName={styles.accentMaskSvg}
          darkRectClassName={styles.accentMaskDarkBg}
        />
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
    );

  const overlayEl =
    overlay && typeof overlay === 'string' ? (
      <div
        className={styles.overlay}
        style={{ backgroundColor: overlay, opacity: overlayOpacity }}
        aria-hidden="true"
      />
    ) : null;

  if (aspectRatio) {
    return (
      <>
        <div
          className={styles.imageBackgroundAspectWrap}
          style={{ opacity, ['--bg-aspect-ratio' as string]: aspectRatio }}
          aria-hidden="true"
        >
          <div className={styles.imageBackgroundAspectInner}>{imageLayer}</div>
        </div>
        {overlayEl}
      </>
    );
  }

  return (
    <>
      {imageLayer}
      {overlayEl}
    </>
  );
}
