import React from 'react';
import { cn } from '../../../lib/utils';

export interface LogoIconProps {
  /** Size of the logo */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Custom className */
  className?: string;
  /** Custom styles */
  style?: React.CSSProperties;
  /** Color variant - defaults to current text color */
  color?: 'primary' | 'secondary' | 'accent' | 'current';
}

const sizeClasses = {
  sm: 'w-12 h-5',     // ~48x20px
  md: 'w-16 h-7',     // ~64x28px  
  lg: 'w-20 h-8',     // ~80x32px
  xl: 'w-24 h-10'     // ~96x40px
};

const colorClasses = {
  primary: 'text-text-primary',
  secondary: 'text-text-secondary', 
  accent: 'text-accent-500',
  current: 'text-current'
};

export const LogoIcon: React.FC<LogoIconProps> = ({ 
  size = 'lg',
  className,
  style,
  color = 'current'
}) => {
  return (
    <svg 
      width="260" 
      height="107" 
      viewBox="0 0 260 107" 
      fill="none" 
      className={cn(
        sizeClasses[size],
        colorClasses[color],
        className
      )}
      style={style}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-label="Blimpify Logo"
    >
      <path 
        d="M250.619 77.2176C250.619 77.2176 250.619 28.1639 250.619 23.1156M250.619 77.2176C250.619 77.2176 212.623 21.7105 115.52 11.171C30.7571 1.97081 0.267481 48.8958 12.6483 84.9666M250.619 77.2176V23.1156M250.619 23.1156H233.548L228.042 36.4655" 
        stroke="currentColor" 
        strokeWidth="18.1371" 
        strokeLinecap="square"
      />
    </svg>
  );
};