// ===============================================
// src/design-system/components/primitives/IconButton/IconButton.tsx
// RESTRUCTURED - Now matches Button component pattern exactly
// ===============================================

import React, { forwardRef } from 'react';
import { cn } from '../../../lib/utils';

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
  'aria-label': string;
  /** Active state (for navigation) */
  active?: boolean;
  /** Loading state */
  loading?: boolean;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(({
  icon,
  variant = 'secondary', // Default to secondary like ghost buttons
  size = 'lg',
  badge,
  active = false,
  loading = false,
  className,
  disabled,
  'aria-label': ariaLabel,
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

  return (
    <button
      ref={ref}
      className={buttonClasses}
      disabled={isDisabled}
      aria-label={ariaLabel}
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
});

IconButton.displayName = 'IconButton';

// ===== SMART ICON BUTTON COMPONENTS =====
interface SmartIconButtonProps extends Omit<IconButtonProps, 'icon' | 'aria-label'> {
  'aria-label'?: string;
}

const createActionIcon = (iconComponent: React.ComponentType, props?: any) => {
  const { Icon } = require('../Icon/Icon');
  return React.createElement(Icon, {
    size: 'md', // Consistent with button sizes
    color: 'primary',
    weight: 'medium',
    ...props
  }, React.createElement(iconComponent));
};

export const IconButtons = {
  More: ({ 'aria-label': label = 'More options', variant = 'ghost', ...props }: SmartIconButtonProps = {}) => {
    const { EllipsisHorizontalIcon } = require('@heroicons/react/24/outline');
    
    return React.createElement(IconButton, {
      icon: createActionIcon(EllipsisHorizontalIcon),
      variant,
      'aria-label': label,
      ...props
    });
  },

  Edit: ({ 'aria-label': label = 'Edit', variant = 'ghost', ...props }: SmartIconButtonProps = {}) => {
    const { PencilIcon } = require('@heroicons/react/24/outline');
    
    return React.createElement(IconButton, {
      icon: createActionIcon(PencilIcon),
      variant,
      'aria-label': label,
      ...props
    });
  },

  Delete: ({ 'aria-label': label = 'Delete', variant = 'destructive', ...props }: SmartIconButtonProps = {}) => {
    const { TrashIcon } = require('@heroicons/react/24/outline');
    
    return React.createElement(IconButton, {
      icon: createActionIcon(TrashIcon),
      variant,
      'aria-label': label,
      ...props
    });
  },

  Close: ({ 'aria-label': label = 'Close', variant = 'ghost', ...props }: SmartIconButtonProps = {}) => {
    const { XMarkIcon } = require('@heroicons/react/24/outline');
    
    return React.createElement(IconButton, {
      icon: createActionIcon(XMarkIcon),
      variant,
      'aria-label': label,
      ...props
    });
  },

  Add: ({ 'aria-label': label = 'Add', variant = 'accent', ...props }: SmartIconButtonProps = {}) => {
    const { PlusIcon } = require('@heroicons/react/24/outline');
    
    return React.createElement(IconButton, {
      icon: createActionIcon(PlusIcon),
      variant,
      'aria-label': label,
      ...props
    });
  },

  Search: ({ 'aria-label': label = 'Search', variant = 'ghost', ...props }: SmartIconButtonProps = {}) => {
    const { MagnifyingGlassIcon } = require('@heroicons/react/24/outline');
    
    return React.createElement(IconButton, {
      icon: createActionIcon(MagnifyingGlassIcon),
      variant,
      'aria-label': label,
      ...props
    });
  },

  Bell: ({ 'aria-label': label = 'Notifications', variant = 'ghost', ...props }: SmartIconButtonProps = {}) => {
    const { BellIcon } = require('@heroicons/react/24/outline');
    
    return React.createElement(IconButton, {
      icon: createActionIcon(BellIcon),
      variant,
      'aria-label': label,
      ...props
    });
  },

  Help: ({ 'aria-label': label = 'Help', variant = 'ghost', ...props }: SmartIconButtonProps = {}) => {
    const { QuestionMarkCircleIcon } = require('@heroicons/react/24/outline');
    
    return React.createElement(IconButton, {
      icon: createActionIcon(QuestionMarkCircleIcon),
      variant,
      'aria-label': label,
      ...props
    });
  },

  // Navigation helpers - special case with navigation variant
  Navigation: {
    Home: (active = false, additionalProps: Omit<SmartIconButtonProps, 'aria-label'> = {}) => {
      const { HomeIcon } = require('@heroicons/react/24/outline');
      const { Icon } = require('../Icon/Icon');
      
      return React.createElement(IconButton, {
        icon: React.createElement(Icon, {
          size: 'md',
          color: active ? 'nav-item-selected' : 'nav-item',
          weight: 'medium'
        }, React.createElement(HomeIcon)),
        variant: 'ghost', // Navigation uses ghost variant
        active,
        'aria-label': 'Home',
        ...additionalProps
      });
    },
    
    Website: (active = false, additionalProps: Omit<SmartIconButtonProps, 'aria-label'> = {}) => {
      const { GlobeAltIcon } = require('@heroicons/react/24/outline');
      const { Icon } = require('../Icon/Icon');
      
      return React.createElement(IconButton, {
        icon: React.createElement(Icon, {
          size: 'md',
          color: active ? 'nav-item-selected' : 'nav-item',
          weight: 'medium'
        }, React.createElement(GlobeAltIcon)),
        variant: 'ghost',
        active,
        'aria-label': 'Website',
        ...additionalProps
      });
    },
    
    Chat: (active = false, additionalProps: Omit<SmartIconButtonProps, 'aria-label'> = {}) => {
      const { ChatBubbleLeftRightIcon } = require('@heroicons/react/24/outline');
      const { Icon } = require('../Icon/Icon');
      
      return React.createElement(IconButton, {
        icon: React.createElement(Icon, {
          size: 'md',
          color: active ? 'nav-item-selected' : 'nav-item',
          weight: 'medium'
        }, React.createElement(ChatBubbleLeftRightIcon)),
        variant: 'ghost',
        active,
        'aria-label': 'Chat',
        ...additionalProps
      });
    },
    
    Features: (active = false, additionalProps: Omit<SmartIconButtonProps, 'aria-label'> = {}) => {
      const { RocketLaunchIcon } = require('@heroicons/react/24/outline');
      const { Icon } = require('../Icon/Icon');
      
      return React.createElement(IconButton, {
        icon: React.createElement(Icon, {
          size: 'md',
          color: active ? 'nav-item-selected' : 'nav-item',
          weight: 'medium'
        }, React.createElement(RocketLaunchIcon)),
        variant: 'ghost',
        active,
        'aria-label': 'Features',
        ...additionalProps
      });
    },
    
    Domain: (active = false, additionalProps: Omit<SmartIconButtonProps, 'aria-label'> = {}) => {
      const { GlobeAltIcon } = require('@heroicons/react/24/outline');
      const { Icon } = require('../Icon/Icon');
      
      return React.createElement(IconButton, {
        icon: React.createElement(Icon, {
          size: 'md',
          color: active ? 'nav-item-selected' : 'nav-item',
          weight: 'medium'
        }, React.createElement(GlobeAltIcon)),
        variant: 'ghost',
        active,
        'aria-label': 'Domain',
        ...additionalProps
      });
    },
    
    History: (active = false, additionalProps: Omit<SmartIconButtonProps, 'aria-label'> = {}) => {
      const { ClockIcon } = require('@heroicons/react/24/outline');
      const { Icon } = require('../Icon/Icon');
      
      return React.createElement(IconButton, {
        icon: React.createElement(Icon, {
          size: 'md',
          color: active ? 'nav-item-selected' : 'nav-item',
          weight: 'medium'
        }, React.createElement(ClockIcon)),
        variant: 'ghost',
        active,
        'aria-label': 'History',
        ...additionalProps
      });
    }
  }
};