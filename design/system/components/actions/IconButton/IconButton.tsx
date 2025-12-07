// ===============================================
// src/design-system/components/primitives/IconButton/IconButton.tsx
// FIXED - Now properly handles icon colors for different button variants
// ===============================================

import React, { forwardRef } from 'react';
import { cn } from '../../../utils/cn';
import { Icon } from '../../media';
import { Tooltip, TooltipPlacement, TooltipColor } from '../../overlays/Tooltip/Tooltip';

// Import heroicons properly
import {
  EllipsisHorizontalIcon,
  PencilIcon,
  TrashIcon,
  XMarkIcon,
  PlusIcon,
  MagnifyingGlassIcon,
  BellIcon,
  QuestionMarkCircleIcon,
  HomeIcon,
  GlobeAltIcon,
  ChatBubbleLeftRightIcon,
  RocketLaunchIcon,
  ClockIcon
} from '@heroicons/react/24/outline';

export interface IconButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** The icon element to render - should be Icon component with heroicon */
  icon: React.ReactNode;
  /** Button style variant - matches Button component exactly */
  variant?: 'primary' | 'secondary' | 'accent' | 'ghost' | 'destructive';
  /** Button size - matches Button component exactly */
  size?: 'sm' | 'md' | 'lg' | 'xl';
  /** Badge for notifications */
  badge?: number | string;
  /** Required accessibility label */
  'tooltip-label': string;
  /** Active state (for navigation) */
  active?: boolean;
  /** Loading state */
  loading?: boolean;
  /** Enable automatic tooltip using tooltip-label as content (default: true) */
  tooltip?: boolean;
  /** Custom tooltip content (overrides tooltip-label) */
  tooltipContent?: React.ReactNode;
  /** Tooltip placement */
  tooltipPlacement?: TooltipPlacement;
  /** Tooltip color variant */
  tooltipColor?: TooltipColor;
  /** Tooltip size (default: 'sm') */
  tooltipSize?: 'sm' | 'md' | 'lg';
  /** Tooltip delay in ms (default: 300) */
  tooltipDelay?: number;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(({
  icon,
  variant = 'secondary',
  size = 'lg',
  badge,
  active = false,
  loading = false,
  className,
  disabled,
  'tooltip-label': tooltipLabel,
  tooltip = true,
  tooltipContent,
  tooltipPlacement = 'top',
  tooltipColor = 'default',
  tooltipSize = 'sm',
  tooltipDelay = 300,
  ...props
}, ref) => {
  const isDisabled = disabled || loading;

  // Build classes using the same pattern as Button component
  const buttonClasses = cn(
    'icon-btn',
    `icon-btn--${variant}`,
    `icon-btn--${size}`,
    active && 'icon-btn--active',
    loading && 'icon-btn--loading',
    className
  );

  const button = (
    <button
      ref={ref}
      className={buttonClasses}
      disabled={isDisabled}
      tooltip-label={tooltipLabel}
      type="button"
      {...props}
    >
      {/* Loading Spinner - matches Button component */}
      {loading && (
        <div className="icon-btn__spinner">
          <svg
            className="h-4 w-4 animate-spin"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        </div>
      )}

      {/* Icon container */}
      <div className={cn("icon-btn__icon", loading && "icon-btn__icon--hidden")}>
        {icon}
      </div>

      {/* Badge */}
      {badge && !loading && (
        <div className="icon-btn__badge">
          {typeof badge === 'number' && badge > 99 ? '99+' : badge}
        </div>
      )}
    </button>
  );

  // Wrap with tooltip if enabled and not disabled
  if (tooltip && !isDisabled) {
    return (
      <Tooltip
        content={tooltipContent || tooltipLabel}
        placement={tooltipPlacement}
        color={tooltipColor}
        size={tooltipSize}
        delay={tooltipDelay}
      >
        {button}
      </Tooltip>
    );
  }

  return button;
});

IconButton.displayName = 'IconButton';

// ===== SMART ICON BUTTON COMPONENTS - FIXED =====
interface SmartIconButtonProps extends Omit<IconButtonProps, 'icon' | 'tooltip-label'> {
  'tooltip-label'?: string;
  tooltip?: boolean;
  tooltipContent?: React.ReactNode;
  tooltipPlacement?: TooltipPlacement;
  tooltipColor?: TooltipColor;
  tooltipSize?: 'sm' | 'md' | 'lg';
  tooltipDelay?: number;
}

// 🎯 FIXED: Helper function that uses appropriate icon color based on button variant
const createActionIcon = (
  IconComponent: React.ComponentType<any>, 
  variant: IconButtonProps['variant'] = 'secondary',
  size: IconButtonProps['size'] = 'lg'
) => {
  // Map IconButton size to Icon size
  const iconSizeMap = {
    'sm': 'sm' as const,
    'md': 'md' as const, 
    'lg': 'md' as const,  // lg IconButton uses md Icon
    'xl': 'lg' as const   // xl IconButton uses lg Icon
  };

  // 🎯 KEY FIX: Map button variant to appropriate icon color
  const getIconColor = (buttonVariant: IconButtonProps['variant']) => {
    switch (buttonVariant) {
      case 'primary':
        return 'button-primary'; // White text on primary background
      case 'accent':
        return 'button-accent'; // White text on accent background  
      case 'destructive':
        return 'button-destructive'; // White text on destructive background
      case 'secondary':
        return 'button-secondary'; // Dark text on light background
      case 'ghost':
        return 'button-ghost'; // Secondary text color
      default:
        return 'button-secondary';
    }
  };

  return (
    <Icon 
      size={iconSizeMap[size]} 
      color={getIconColor(variant)}
      weight="medium"
    >
      <IconComponent />
    </Icon>
  );
};

export const IconButtons = {
  More: ({ 'tooltip-label': label = 'More options', variant = 'ghost', size = 'lg', ...props }: SmartIconButtonProps = {}) => (
    <IconButton
      icon={createActionIcon(EllipsisHorizontalIcon, variant, size)}
      variant={variant}
      size={size}
      tooltip-label={label}
      {...props}
    />
  ),

  Edit: ({ 'tooltip-label': label = 'Edit', variant = 'ghost', size = 'lg', ...props }: SmartIconButtonProps = {}) => (
    <IconButton
      icon={createActionIcon(PencilIcon, variant, size)}
      variant={variant}
      size={size}
      tooltip-label={label}
      {...props}
    />
  ),

  Delete: ({ 'tooltip-label': label = 'Delete', variant = 'destructive', size = 'lg', ...props }: SmartIconButtonProps = {}) => (
    <IconButton
      icon={createActionIcon(TrashIcon, variant, size)}
      variant={variant}
      size={size}
      tooltip-label={label}
      {...props}
    />
  ),

  Close: ({ 'tooltip-label': label = 'Close', variant = 'ghost', size = 'lg', ...props }: SmartIconButtonProps = {}) => (
    <IconButton
      icon={createActionIcon(XMarkIcon, variant, size)}
      variant={variant}
      size={size}
      tooltip-label={label}
      {...props}
    />
  ),

  Add: ({ 'tooltip-label': label = 'Add', variant = 'accent', size = 'lg', ...props }: SmartIconButtonProps = {}) => (
    <IconButton
      icon={createActionIcon(PlusIcon, variant, size)}
      variant={variant}
      size={size}
      tooltip-label={label}
      {...props}
    />
  ),

  Search: ({ 'tooltip-label': label = 'Search', variant = 'ghost', size = 'lg', ...props }: SmartIconButtonProps = {}) => (
    <IconButton
      icon={createActionIcon(MagnifyingGlassIcon, variant, size)}
      variant={variant}
      size={size}
      tooltip-label={label}
      {...props}
    />
  ),

  Bell: ({ 'tooltip-label': label = 'Notifications', variant = 'ghost', size = 'lg', ...props }: SmartIconButtonProps = {}) => (
    <IconButton
      icon={createActionIcon(BellIcon, variant, size)}
      variant={variant}
      size={size}
      tooltip-label={label}
      {...props}
    />
  ),

  Help: ({ 'tooltip-label': label = 'Help', variant = 'ghost', size = 'lg', ...props }: SmartIconButtonProps = {}) => (
    <IconButton
      icon={createActionIcon(QuestionMarkCircleIcon, variant, size)}
      variant={variant}
      size={size}
      tooltip-label={label}
      {...props}
    />
  ),

  // Navigation helpers - special case with navigation colors
  Navigation: {
    Home: ({ active = false, size = 'lg', ...additionalProps }: { active?: boolean; size?: IconButtonProps['size'] } & Omit<SmartIconButtonProps, 'tooltip-label'> = {}) => (
      <IconButton
        icon={
          <Icon 
            size={size === 'sm' ? 'sm' : size === 'md' ? 'md' : 'md'} 
            color={active ? 'nav-item-selected' : 'nav-item'} 
            weight="medium"
          >
            <HomeIcon />
          </Icon>
        }
        variant="ghost"
        size={size}
        active={active}
        tooltip-label="Home"
        {...additionalProps}
      />
    ),
    
    Website: ({ active = false, size = 'lg', ...additionalProps }: { active?: boolean; size?: IconButtonProps['size'] } & Omit<SmartIconButtonProps, 'tooltip-label'> = {}) => (
      <IconButton
        icon={
          <Icon 
            size={size === 'sm' ? 'sm' : size === 'md' ? 'md' : 'md'} 
            color={active ? 'nav-item-selected' : 'nav-item'} 
            weight="medium"
          >
            <GlobeAltIcon />
          </Icon>
        }
        variant="ghost"
        size={size}
        active={active}
        tooltip-label="Website"
        {...additionalProps}
      />
    ),
    
    Chat: ({ active = false, size = 'lg', ...additionalProps }: { active?: boolean; size?: IconButtonProps['size'] } & Omit<SmartIconButtonProps, 'tooltip-label'> = {}) => (
      <IconButton
        icon={
          <Icon 
            size={size === 'sm' ? 'sm' : size === 'md' ? 'md' : 'md'} 
            color={active ? 'nav-item-selected' : 'nav-item'} 
            weight="medium"
          >
            <ChatBubbleLeftRightIcon />
          </Icon>
        }
        variant="ghost"
        size={size}
        active={active}
        tooltip-label="Chat"
        {...additionalProps}
      />
    ),
    
    Features: ({ active = false, size = 'lg', ...additionalProps }: { active?: boolean; size?: IconButtonProps['size'] } & Omit<SmartIconButtonProps, 'tooltip-label'> = {}) => (
      <IconButton
        icon={
          <Icon 
            size={size === 'sm' ? 'sm' : size === 'md' ? 'md' : 'md'} 
            color={active ? 'nav-item-selected' : 'nav-item'} 
            weight="medium"
          >
            <RocketLaunchIcon />
          </Icon>
        }
        variant="ghost"
        size={size}
        active={active}
        tooltip-label="Features"
        {...additionalProps}
      />
    ),
    
    Domain: ({ active = false, size = 'lg', ...additionalProps }: { active?: boolean; size?: IconButtonProps['size'] } & Omit<SmartIconButtonProps, 'tooltip-label'> = {}) => (
      <IconButton
        icon={
          <Icon 
            size={size === 'sm' ? 'sm' : size === 'md' ? 'md' : 'md'} 
            color={active ? 'nav-item-selected' : 'nav-item'} 
            weight="medium"
          >
            <GlobeAltIcon />
          </Icon>
        }
        variant="ghost"
        size={size}
        active={active}
        tooltip-label="Domain"
        {...additionalProps}
      />
    ),
    
    History: ({ active = false, size = 'lg', ...additionalProps }: { active?: boolean; size?: IconButtonProps['size'] } & Omit<SmartIconButtonProps, 'tooltip-label'> = {}) => (
      <IconButton
        icon={
          <Icon 
            size={size === 'sm' ? 'sm' : size === 'md' ? 'md' : 'md'} 
            color={active ? 'nav-item-selected' : 'nav-item'} 
            weight="medium"
          >
            <ClockIcon />
          </Icon>
        }
        variant="ghost"
        size={size}
        active={active}
        tooltip-label="History"
        {...additionalProps}
      />
    )
  }
};