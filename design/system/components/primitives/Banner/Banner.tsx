// ==============================================
// src/design-system/components/primitives/Banner/Banner.tsx
// SIMPLE DISCRETE BANNER - Full width, token-based
// Single line message with optional icon and action
// ==============================================

import React, { forwardRef, ReactNode } from 'react';
import { cn } from '../../../lib/utils';
import { Typography } from '../Typography';
import { Button } from '../Button';

// ===== TYPE DEFINITIONS =====
export type BannerType = 'default' | 'info' | 'success' | 'warning' | 'error' | 'loading';

export interface BannerProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Banner message text */
  message: string;
  /** Banner type determines color/urgency */
  type?: BannerType;
  /** Optional icon element */
  icon?: ReactNode;
  /** Optional action button text */
  actionText?: string;
  /** Action button click handler */
  onAction?: () => void;
  /** Additional CSS classes */
  className?: string;
}

// ===== SIMPLE BANNER COMPONENT =====
export const Banner = forwardRef<HTMLDivElement, BannerProps>(({
  message,
  type = 'default',
  icon,
  actionText,
  onAction,
  className,
  ...props
}, ref) => {
  const bannerClasses = cn(
    'banner',
    `banner--${type}`,
    className
  );

  return (
    <div
      ref={ref}
      className={bannerClasses}
      role="status"
      aria-live="polite"
      data-type={type}
      {...props}
    >
      {/* Icon + Message container */}
      <div className="banner__content">
        {icon && (
          <div className="banner__icon">
            {icon}
          </div>
        )}
        <Typography
          variant="body-md"
          className="banner__message"
          as="p"
        >
          {message}
        </Typography>
      </div>

      {/* Action button */}
      {actionText && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onAction}
          className="banner__action"
        >
          {actionText}
        </Button>
      )}
    </div>
  );
});

Banner.displayName = 'Banner';

// ===== SPECIALIZED AVAILABILITY BANNER =====
export interface AvailabilityBannerProps extends Omit<BannerProps, 'type' | 'message'> {
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
  icon,
  className,
  ...props
}, ref) => {
  const takenSpots = totalSpots - availableSpots;
  const isFullyBooked = availableSpots === 0;
  const percentageFull = Math.round((takenSpots / totalSpots) * 100);

  // Determine type and message based on status
  let bannerType: BannerType = 'default';
  let message = '';

  if (isLoading) {
    bannerType = 'loading';
    message = 'Kontrollerar tillgängliga platser...';
  } else if (error) {
    bannerType = 'error';
    message = error;
  } else if (isFullyBooked) {
    bannerType = 'error';
    message = `Attans! Alla ${totalSpots} platser är fulla. Vi stöter på stor efterfrågan. Försök igen senare!`;
  } else if (availableSpots === 1) {
    bannerType = 'error';
    message = `Bara 1 plats kvar av ${totalSpots}! Skynda dig innan den är slut.`;
  } else if (availableSpots <= 3) {
    bannerType = 'warning';
    message = `Bara ${availableSpots} platser kvar av ${totalSpots}! Skynda dig innan de är slut.`;
  } else {
    bannerType = 'default';
    message = `${availableSpots} av ${totalSpots} platser lediga (${percentageFull}% fullt)`;
  }

  return (
    <Banner
      ref={ref}
      message={message}
      type={bannerType}
      icon={icon}
      actionText={showAction && !isFullyBooked && !isLoading ? 'Börja nu' : undefined}
      onAction={onAction}
      className={className}
      {...props}
    />
  );
});

AvailabilityBanner.displayName = 'AvailabilityBanner';

// ===== CONVENIENCE EXPORTS =====
export const InfoBanner = (props: Omit<BannerProps, 'type'>) => (
  <Banner {...props} type="info" />
);

export const SuccessBanner = (props: Omit<BannerProps, 'type'>) => (
  <Banner {...props} type="success" />
);

export const WarningBanner = (props: Omit<BannerProps, 'type'>) => (
  <Banner {...props} type="warning" />
);

export const ErrorBanner = (props: Omit<BannerProps, 'type'>) => (
  <Banner {...props} type="error" />
);

export const LoadingBanner = (props: Omit<BannerProps, 'type'>) => (
  <Banner {...props} type="loading" />
);