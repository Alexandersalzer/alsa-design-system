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

// Updated size classes based on new 453x187 aspect ratio (roughly 2.4:1)
const sizeClasses = {
  sm: 'w-12 h-5',     // ~48x20px
  md: 'w-16 h-7',     // ~64x27px  
  lg: 'w-20 h-8',     // ~80x33px
  xl: 'w-28 h-12'     // ~112x47px
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
      width="453" 
      height="187" 
      viewBox="0 0 453 187" 
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
        d="M19.9422 152C-1.92215 92.9116 33.1103 0.567185 182.801 15.6382C354.284 32.9031 421.384 123.831 421.384 123.831L439 146.009V123.831V35.205L396 35.205L380 63" 
        stroke="currentColor" 
        strokeWidth="28" 
        strokeLinecap="square"
      />
    </svg>
  );
};