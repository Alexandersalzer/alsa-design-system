import React from 'react';
import styles from './PatternBackground.module.css';

export type PatternType = 'dots' | 'lines' | 'grid' | 'diagonal' | 'hexagon';
export type ColorScheme = 'accent' | 'primary' | 'success' | 'warning' | 'info' | 'neutral';
export type FadeEdge = 'top' | 'bottom' | 'both' | 'none';

export interface PatternBackgroundProps {
  type?: PatternType;
  colorScheme?: ColorScheme;
  density?: 'sparse' | 'normal' | 'dense';
  animated?: boolean;
  opacity?: number; // 0.0 - 1.0
  fadeEdge?: FadeEdge;
  fadeStrength?: number; // 0.0 - 1.0
  className?: string;
}

export const PatternBackground: React.FC<PatternBackgroundProps> = ({
  type = 'dots',
  colorScheme = 'neutral',
  density = 'normal',
  animated = false,
  opacity = 0.15,
  fadeEdge = 'none',
  fadeStrength = 0.15,
  className = '',
}) => {
  const combinedClassName = [
    styles.patternBackground,
    styles[type],
    styles[colorScheme],
    styles[density],
    animated ? styles.animated : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const getFadeStyle = (): React.CSSProperties => {
    const baseStyle = {
      '--pattern-opacity': opacity,
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
