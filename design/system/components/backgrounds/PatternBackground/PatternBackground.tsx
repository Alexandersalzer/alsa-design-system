import React from 'react';
import styles from './PatternBackground.module.css';

export type PatternType = 'dots' | 'lines' | 'grid' | 'diagonal' | 'hexagon';
export type ColorScheme = 'accent' | 'primary' | 'success' | 'warning' | 'info' | 'neutral';

export interface PatternBackgroundProps {
  type?: PatternType;
  colorScheme?: ColorScheme;
  density?: 'sparse' | 'normal' | 'dense';
  animated?: boolean;
  opacity?: number; // 0.0 - 1.0
  className?: string;
}

export const PatternBackground: React.FC<PatternBackgroundProps> = ({
  type = 'dots',
  colorScheme = 'neutral',
  density = 'normal',
  animated = false,
  opacity = 0.15,
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

  const style = {
    '--pattern-opacity': opacity,
  } as React.CSSProperties;

  return <div className={combinedClassName} style={style} />;
};
