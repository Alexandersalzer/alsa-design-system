// ===============================================
// src/design-system/components/navigation/BackButton/BackButton.tsx
// BACK BUTTON COMPONENT - Navigation back button
// ===============================================

import React from 'react';
import { cn } from '../../../utils/cn';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { Icon } from '../../media/Icon/Icon';

export interface BackButtonProps {
  /** Button content (defaults to "Back") */
  children?: React.ReactNode;
  /** Visual variant */
  variant?: 'ghost' | 'subtle' | 'bordered';
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Show arrow icon */
  showIcon?: boolean;
  /** Disable the button */
  isDisabled?: boolean;
  /** Click handler */
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  /** Additional className */
  className?: string;
}

export const BackButton = React.forwardRef<HTMLButtonElement, BackButtonProps>(
  (
    {
      children = 'Back',
      variant = 'ghost',
      size = 'md',
      showIcon = true,
      isDisabled = false,
      onClick,
      className
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type="button"
        disabled={isDisabled}
        onClick={onClick}
        className={cn(
          'back-button',
          `back-button--${variant}`,
          `back-button--${size}`,
          isDisabled && 'back-button--disabled',
          className
        )}
        aria-label={typeof children === 'string' ? children : 'Go back'}
      >
        {showIcon && (
          <Icon size={size === 'sm' ? 'xs' : size === 'lg' ? 'md' : 'sm'}>
            <ChevronLeftIcon />
          </Icon>
        )}
        <span className="back-button__text">{children}</span>
      </button>
    );
  }
);

BackButton.displayName = 'BackButton';

export default BackButton;
