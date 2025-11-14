// ===============================================
// ButtonGroup Pattern Component (Shared)
// ===============================================

import React from 'react';
import { Button } from '../../../components/actions/Button/Button';


export interface ButtonGroupProps {
  buttons?: { label: string; value: string }[];
  onClick?: (value: string) => void;
  activeValue?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  radius?: 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'destructive';
  className?: string;
  // For pattern renderer compatibility
  props?: any;
}


export const ButtonGroup: React.FC<ButtonGroupProps> = (props) => {
  // Support both top-level and nested props (pattern renderer)
  const {
    buttons: directButtons,
    onClick,
    activeValue,
    size = 'md',
    radius = 'md',
    variant = 'secondary',
    className = '',
    props: nestedProps
  } = props;

  // Prefer direct, fallback to nested
  const buttons = directButtons || (nestedProps && nestedProps.buttons) || [];

  return (
    <div className={`button-group ${className}`} style={{ display: 'flex', gap: '0.5rem' }}>
      {Array.isArray(buttons) && buttons.length > 0 ? (
        buttons.map((btn) => (
          <Button
            key={btn.value}
            variant={activeValue === btn.value ? 'primary' : variant}
            size={size}
            radius={radius}
            onClick={() => onClick?.(btn.value)}
            aria-pressed={activeValue === btn.value}
          >
            {btn.label}
          </Button>
        ))
      ) : null}
    </div>
  );
};

ButtonGroup.displayName = 'ButtonGroup';

export default ButtonGroup;
