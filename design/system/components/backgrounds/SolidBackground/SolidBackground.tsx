import React from 'react';
import styles from './SolidBackground.module.css';

export type FadeEdge = 'top' | 'bottom' | 'both' | 'none';
export type ColorPreset = 'white' | 'black' | 'surface' | 'surface-raised' | 'surface-elevated' | 'accent' | 'accent-subtle';

export interface SolidBackgroundProps {
  /** Preset color from design system */
  colorPreset?: ColorPreset;
  /** Background opacity (0-1), defaults to 1 */
  opacity?: number;
  /** Which edge(s) to fade */
  fadeEdge?: FadeEdge;
  /** How strong the fade effect is (0-1), defaults to 0.15 */
  fadeStrength?: number;
  /** Additional CSS class */
  className?: string;
}

/**
 * SolidBackground - Simple solid color background with optional fade edges
 * 
 * Usage:
 * - colorPreset="white" for white background
 * - colorPreset="surface-raised" for raised surface
 * - fadeEdge="bottom" with fadeStrength={0.3} for 30% fade at bottom
 */
export const SolidBackground: React.FC<SolidBackgroundProps> = ({
  colorPreset = 'white',
  opacity = 1,
  fadeEdge = 'none',
  fadeStrength = 0.15,
  className = '',
}) => {
  // Map presets to actual colors
  const getColorFromPreset = (preset: ColorPreset): string => {
    const presetMap: Record<ColorPreset, string> = {
      'white': '#ffffff',
      'black': '#000000',
      'surface': 'var(--surface-default)',
      'surface-raised': 'var(--surface-raised)',
      'surface-elevated': 'var(--surface-elevated)',
      'accent': 'var(--color-accent)',
      'accent-subtle': 'var(--color-accent-subtle)',
    };
    return presetMap[preset];
  };

  const backgroundColor = getColorFromPreset(colorPreset);

  const combinedClassName = [
    styles.solidBackground,
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const getFadeStyle = (): React.CSSProperties => {
    const baseStyle = {
      backgroundColor,
      opacity,
    } as React.CSSProperties;
    
    if (fadeEdge === 'none') return baseStyle;
    
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
      ...baseStyle,
      maskImage,
      WebkitMaskImage: maskImage,
    };
  };

  return <div className={combinedClassName} style={getFadeStyle()} />;
};
