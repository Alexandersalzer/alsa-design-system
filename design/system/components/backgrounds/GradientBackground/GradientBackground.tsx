import React from 'react';
import styles from './GradientBackground.module.css';

export type GradientType = 'mesh' | 'radial' | 'conic' | 'linear';
export type ColorScheme = 'accent' | 'primary' | 'success' | 'warning' | 'info';

export interface GradientBackgroundProps {
  type?: GradientType;
  colorScheme?: ColorScheme;
  animated?: boolean;
  intensity?: number; // 0.0 - 1.0
  className?: string;
}

export const GradientBackground: React.FC<GradientBackgroundProps> = ({
  type = 'mesh',
  colorScheme = 'accent',
  animated = false,
  intensity = 1.0,
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

  const style = {
    '--gradient-intensity': intensity,
  } as React.CSSProperties;

  return <div className={combinedClassName} style={style} />;
};
