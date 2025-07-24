import React, { ReactNode } from 'react';
import { TabVariant } from './Tab';

interface TabGroupProps {
  children: ReactNode;
  variant?: TabVariant;
  orientation?: 'horizontal' | 'vertical';
  className?: string;
}

export const TabGroup: React.FC<TabGroupProps> = ({
  children,
  variant = 'navigation',
  orientation = 'horizontal',
  className = ''
}) => {
  // For navigation variant, use your existing sidebar__nav class
  if (variant === 'navigation') {
    return (
      <div className={`sidebar__nav ${className}`}>
        {children}
      </div>
    );
  }

  // For other variants, use tab-group classes
  const classes = [
    'tab-group',
    `tab-group--${variant}`,
    `tab-group--${orientation}`,
    className
  ].filter(Boolean).join(' ');

  return (
    <div className={classes} role="tablist">
      {children}
    </div>
  );
};