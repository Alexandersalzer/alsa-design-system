// ===============================================
// src/design-system/components/primitives/IconButton/IconButton.tsx
// FIXED - Proper imports and Icon component usage
// ===============================================

import React, { forwardRef } from 'react';
import { cn } from '../../../lib/utils';
// Import your existing Icons from the design system
import { Icons } from '../Icon';

export interface IconButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** The icon element to render */
  icon: React.ReactNode;
  /** Button style variant */
  variant?: 'default' | 'ghost' | 'accent' | 'danger' | 'navigation' | 'subtle';
  /** Button size */
  size?: 'sm' | 'md' | 'lg';
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
  variant = 'default',
  size = 'md',
  badge,
  active = false,
  loading = false,
  className,
  disabled,
  'aria-label': ariaLabel,
  ...props
}, ref) => {
  const isDisabled = disabled || loading;

  // Build classes systematically
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
      {/* Loading spinner */}
      {loading && (
        <div className="icon-btn__spinner">
          <div className="loading-spinner loading-spinner--small" />
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

// ===============================================
// SMART ICON BUTTON BUILDERS
// Using your existing Icons system!
// ===============================================

interface SmartIconButtonProps extends Omit<IconButtonProps, 'icon' | 'aria-label'> {
  /** Optional override for aria-label */
  'aria-label'?: string;
}

export const IconButtons = {
  // ===== USING YOUR EXISTING ICONS =====
  More: ({ 'aria-label': label = 'More options', variant = 'ghost', ...props }: SmartIconButtonProps = {}) => (
    <IconButton
      icon={<Icons.Action.MoreVertical />}
      variant={variant}
      aria-label={label}
      {...props}
    />
  ),

  Edit: ({ 'aria-label': label = 'Edit', variant = 'ghost', ...props }: SmartIconButtonProps = {}) => (
    <IconButton
      icon={<Icons.Action.Edit />}
      variant={variant}
      aria-label={label}
      {...props}
    />
  ),

  Delete: ({ 'aria-label': label = 'Delete', variant = 'danger', ...props }: SmartIconButtonProps = {}) => (
    <IconButton
      icon={<Icons.Action.Delete />}
      variant={variant}
      aria-label={label}
      {...props}
    />
  ),

  Close: ({ 'aria-label': label = 'Close', variant = 'ghost', ...props }: SmartIconButtonProps = {}) => (
    <IconButton
      icon={<Icons.Action.Close />}
      variant={variant}
      aria-label={label}
      {...props}
    />
  ),

  Help: ({ 'aria-label': label = 'Help', variant = 'ghost', ...props }: SmartIconButtonProps = {}) => (
    <IconButton
      icon={<Icons.Action.Help />}
      variant={variant}
      aria-label={label}
      {...props}
    />
  ),

  ExternalLink: ({ 'aria-label': label = 'Open in new tab', variant = 'ghost', ...props }: SmartIconButtonProps = {}) => (
    <IconButton
      icon={<Icons.Action.ExternalLink />}
      variant={variant}
      aria-label={label}
      {...props}
    />
  ),

  // ===== COMMON ACTIONS =====
  Add: ({ 'aria-label': label = 'Add', variant = 'accent', ...props }: SmartIconButtonProps = {}) => (
    <IconButton
      icon={<Icons.Action.Plus />}
      variant={variant}
      aria-label={label}
      {...props}
    />
  ),

  Search: ({ 'aria-label': label = 'Search', variant = 'ghost', ...props }: SmartIconButtonProps = {}) => (
    <IconButton
      icon={<Icons.Action.Search />}
      variant={variant}
      aria-label={label}
      {...props}
    />
  ),

  Bell: ({ 'aria-label': label = 'Notifications', variant = 'ghost', badge, ...props }: SmartIconButtonProps & { badge?: number | string } = {}) => (
    <IconButton
      icon={<Icons.Action.Bell />}
      variant={variant}
      aria-label={label}
      badge={badge}
      {...props}
    />
  ),

  // ===== NAVIGATION HELPERS =====
  Navigation: {
    Home: (active = false, props: Omit<SmartIconButtonProps, 'aria-label'> = {}) => (
      <IconButton
        icon={active ? <Icons.Nav.HomeActive /> : <Icons.Nav.Home />}
        variant="navigation"
        active={active}
        aria-label="Home"
        {...props}
      />
    ),
    
    Website: (active = false, props: Omit<SmartIconButtonProps, 'aria-label'> = {}) => (
      <IconButton
        icon={active ? <Icons.Nav.WebsiteActive /> : <Icons.Nav.Website />}
        variant="navigation"
        active={active}
        aria-label="Website"
        {...props}
      />
    ),
    
    Chat: (active = false, props: Omit<SmartIconButtonProps, 'aria-label'> = {}) => (
      <IconButton
        icon={active ? <Icons.Nav.ChatActive /> : <Icons.Nav.Chat />}
        variant="navigation"
        active={active}
        aria-label="Chat"
        {...props}
      />
    ),
    
    Features: (active = false, props: Omit<SmartIconButtonProps, 'aria-label'> = {}) => (
      <IconButton
        icon={active ? <Icons.Nav.FeaturesActive /> : <Icons.Nav.Features />}
        variant="navigation"
        active={active}
        aria-label="Features"
        {...props}
      />
    ),
    
    Domain: (active = false, props: Omit<SmartIconButtonProps, 'aria-label'> = {}) => (
      <IconButton
        icon={active ? <Icons.Nav.DomainActive /> : <Icons.Nav.Domain />}
        variant="navigation"
        active={active}
        aria-label="Domain"
        {...props}
      />
    )
  }
};

// ===============================================
// USAGE EXAMPLES
// ===============================================

/*

// ✅ Clean semantic usage
<IconButtons.More onClick={toggleMenu} />
<IconButtons.Edit onClick={handleEdit} />
<IconButtons.Delete onClick={handleDelete} />
<IconButtons.Bell badge={3} onClick={showNotifications} />

// ✅ Navigation with active states
<IconButtons.Navigation.Home active={isHomeActive} />
<IconButtons.Navigation.Website active={isWebsiteActive} />

// ✅ Custom variants
<IconButtons.Add variant="accent" size="lg" />
<IconButtons.More variant="subtle" size="sm" />

// ✅ Still flexible for unique cases
<IconButton
  icon={<Icons.Action.CustomIcon />}
  variant="accent"
  aria-label="Custom action"
  onClick={handleCustom}
/>

*/