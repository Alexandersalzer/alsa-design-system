// ==============================================
// src/design-system/components/primitives/Banner/Banner.tsx
// BANNER COMPONENT - Material Design approach
// Displays persistent messages with optional actions
// ==============================================

import React, { forwardRef, ReactNode, useState } from 'react';
import { cn } from '../../../lib/utils';
import { Typography } from '../Typography';
import { StatusIcons } from '../Icon';
import { Button } from '../Button';

// ===== TYPE DEFINITIONS =====
export type BannerVariant = 'info' | 'success' | 'warning' | 'error';

export interface BannerRootProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Banner status/type */
  variant?: BannerVariant;
  /** Banner text content */
  text: string;
  /** Primary action button text */
  actionText?: string;
  /** Primary action button handler */
  onAction?: () => void;
  /** Secondary action button text */
  secondaryActionText?: string;
  /** Secondary action button handler */
  onSecondaryAction?: () => void;
  /** Show close button */
  showClose?: boolean;
  /** Close handler */
  onClose?: () => void;
  /** Icon/graphic element */
  icon?: ReactNode;
  /** Additional CSS classes */
  className?: string;
  /** Whether banner is dismissible */
  dismissible?: boolean;
}

export interface BannerContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Content children */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
}

export interface BannerTextProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'color'> {
  /** Text content */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
}

export interface BannerActionsProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Action children (buttons) */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
}

export interface BannerActionProps extends React.HTMLAttributes<HTMLButtonElement> {
  /** Button text */
  children: ReactNode;
  /** Is primary action */
  primary?: boolean;
  /** Button click handler */
  onClick?: () => void;
  /** Additional CSS classes */
  className?: string;
}

export interface BannerGraphicProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Graphic/icon content */
  children?: ReactNode;
  /** Additional CSS classes */
  className?: string;
}

// ===== ICON MAPPING =====
const getVariantIcon = (variant: BannerVariant): ReactNode => {
  switch (variant) {
    case 'success':
      return <StatusIcons.Success />;
    case 'warning':
      return <StatusIcons.Warning />;
    case 'error':
      return <StatusIcons.Error />;
    case 'info':
    default:
      return <StatusIcons.Info />;
  }
};

// ===== ROOT COMPONENT =====
export const BannerRoot = forwardRef<HTMLDivElement, BannerRootProps>(({
  variant = 'info',
  text,
  actionText,
  onAction,
  secondaryActionText,
  onSecondaryAction,
  showClose = false,
  onClose,
  icon,
  className,
  dismissible = true,
  ...props
}, ref) => {
  const [isDismissed, setIsDismissed] = useState(false);

  const handleClose = () => {
    setIsDismissed(true);
    onClose?.();
  };

  if (isDismissed && dismissible) {
    return null;
  }

  const bannerClasses = cn(
    'banner',
    `banner--${variant}`,
    className
  );

  return (
    <div
      ref={ref}
      className={bannerClasses}
      role="banner"
      aria-live="assertive"
      data-variant={variant}
      {...props}
    >
      <div className="banner__content">
        {/* Graphic/Icon */}
        {icon && (
          <div className="banner__graphic">
            {icon}
          </div>
        )}

        {/* Text Content */}
        <div className="banner__text-wrapper">
          <Typography
            variant="body-md"
            className="banner__text"
            as="p"
          >
            {text}
          </Typography>
        </div>
      </div>

      {/* Actions */}
      {(actionText || secondaryActionText) && (
        <div className="banner__actions">
          {secondaryActionText && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onSecondaryAction}
              className="banner__secondary-action"
            >
              {secondaryActionText}
            </Button>
          )}
          {actionText && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onAction}
              className="banner__primary-action"
            >
              {actionText}
            </Button>
          )}
        </div>
      )}

      {/* Close button - optional */}
      {showClose && (
        <button
          className="banner__close-button"
          onClick={handleClose}
          aria-label="Dismiss banner"
          type="button"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      )}
    </div>
  );
});

BannerRoot.displayName = 'Banner.Root';

// ===== CONTENT COMPONENT (for custom layouts) =====
export const BannerContent = forwardRef<HTMLDivElement, BannerContentProps>(({
  children,
  className,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn('banner__content', className)}
      {...props}
    >
      {children}
    </div>
  );
});

BannerContent.displayName = 'Banner.Content';

// ===== TEXT COMPONENT =====
export const BannerText = forwardRef<HTMLDivElement, BannerTextProps>(({
  children,
  className,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn('banner__text-wrapper', className)}
      {...props}
    >
      <Typography
        variant="body-md"
        className="banner__text"
        as="p"
      >
        {children}
      </Typography>
    </div>
  );
});

BannerText.displayName = 'Banner.Text';

// ===== ACTIONS COMPONENT =====
export const BannerActions = forwardRef<HTMLDivElement, BannerActionsProps>(({
  children,
  className,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn('banner__actions', className)}
      {...props}
    >
      {children}
    </div>
  );
});

BannerActions.displayName = 'Banner.Actions';

// ===== ACTION BUTTON COMPONENT =====
export const BannerAction = forwardRef<HTMLButtonElement, BannerActionProps>(({
  children,
  primary = false,
  onClick,
  className,
  ...props
}, ref) => {
  return (
    <Button
      ref={ref}
      variant="ghost"
      size="sm"
      onClick={onClick}
      className={cn(
        primary ? 'banner__primary-action' : 'banner__secondary-action',
        className
      )}
      {...props}
    >
      {children}
    </Button>
  );
});

BannerAction.displayName = 'Banner.Action';

// ===== GRAPHIC COMPONENT =====
export const BannerGraphic = forwardRef<HTMLDivElement, BannerGraphicProps>(({
  children,
  className,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      className={cn('banner__graphic', className)}
      {...props}
    >
      {children}
    </div>
  );
});

BannerGraphic.displayName = 'Banner.Graphic';

// ===== COMPOSITE BANNER OBJECT =====
export const Banner = {
  Root: BannerRoot,
  Content: BannerContent,
  Text: BannerText,
  Actions: BannerActions,
  Action: BannerAction,
  Graphic: BannerGraphic,
};

// ===== SPECIALIZED AVAILABILITY BANNER =====
export interface AvailabilityBannerProps extends Omit<BannerRootProps, 'text' | 'children'> {
  /** Available spots count */
  availableSpots: number;
  /** Total spots count */
  totalSpots: number;
  /** Loading state */
  isLoading?: boolean;
  /** Error state */
  error?: string | null;
  /** Show action button to jump to form */
  showAction?: boolean;
}

export const AvailabilityBanner = forwardRef<HTMLDivElement, AvailabilityBannerProps>(({
  availableSpots,
  totalSpots,
  isLoading = false,
  error = null,
  showAction = false,
  onAction,
  className,
  ...props
}, ref) => {
  const takenSpots = totalSpots - availableSpots;
  const isFullyBooked = availableSpots === 0;
  const isLow = availableSpots > 0 && availableSpots <= 2;

  // Determine variant based on status
  let variant: BannerVariant = 'success';
  let text = '';

  if (isLoading) {
    variant = 'info';
    text = 'Kontrollerar tillgängliga platser...';
  } else if (error) {
    variant = 'error';
    text = error;
  } else if (isFullyBooked) {
    variant = 'error';
    text = `Attans! Alla ${totalSpots} platser är fulla. Vi stöter på stor efterfrågan. Försök igen senare!`;
  } else if (isLow) {
    variant = 'warning';
    text = `Bara ${availableSpots} plats${availableSpots === 1 ? '' : 'er'} lediga av ${totalSpots}! Skynda dig innan de är slut.`;
  } else {
    variant = 'success';
    text = `${availableSpots} av ${totalSpots} platser lediga (${Math.round((takenSpots / totalSpots) * 100)}% fullt)`;
  }

  return (
    <BannerRoot
      ref={ref}
      variant={variant}
      text={text}
      actionText={showAction && !isFullyBooked && !isLoading ? 'Börja nu' : undefined}
      onAction={onAction}
      dismissible={false}
      className={className}
      {...props}
    />
  );
});

AvailabilityBanner.displayName = 'AvailabilityBanner';

// ===== CONVENIENCE VARIANTS =====
export const InfoBanner = forwardRef<HTMLDivElement, Omit<BannerRootProps, 'variant'>>(
  (props, ref) => <BannerRoot ref={ref} variant="info" {...props} />
);
InfoBanner.displayName = 'InfoBanner';

export const SuccessBanner = forwardRef<HTMLDivElement, Omit<BannerRootProps, 'variant'>>(
  (props, ref) => <BannerRoot ref={ref} variant="success" {...props} />
);
SuccessBanner.displayName = 'SuccessBanner';

export const WarningBanner = forwardRef<HTMLDivElement, Omit<BannerRootProps, 'variant'>>(
  (props, ref) => <BannerRoot ref={ref} variant="warning" {...props} />
);
WarningBanner.displayName = 'WarningBanner';

export const ErrorBanner = forwardRef<HTMLDivElement, Omit<BannerRootProps, 'variant'>>(
  (props, ref) => <BannerRoot ref={ref} variant="error" {...props} />
);
ErrorBanner.displayName = 'ErrorBanner';