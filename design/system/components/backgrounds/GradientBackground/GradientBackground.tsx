import React from 'react';
import styles from './GradientBackground.module.css';

export type GradientType = 'mesh' | 'radial' | 'conic' | 'linear';
export type ColorScheme = 'accent' | 'primary' | 'success' | 'warning' | 'info';
export type FadeEdge = 'top' | 'bottom' | 'both' | 'none';

export interface GradientBackgroundProps {
  type?: GradientType;
  colorScheme?: ColorScheme;
  animated?: boolean;
  intensity?: number; // 0.0 - 1.0
  fadeEdge?: FadeEdge;
  fadeStrength?: number; // 0.0 - 1.0
  className?: string;
}

export const GradientBackground: React.FC<GradientBackgroundProps> = ({
  type = 'mesh',
  colorScheme = 'accent',
  animated = false,
  intensity = 1.0,
  fadeEdge = 'none',
  fadeStrength = 0.15,
  className = '',
}) => {
  const combinedClassName = [
    styles.gradientBackground,
    styles[type],
    styles[colorScheme],
    animated ? styles.animated : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  const getFadeStyle = (): React.CSSProperties => {
    const baseStyle = {
      '--gradient-intensity': intensity,
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
