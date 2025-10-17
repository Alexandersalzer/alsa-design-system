// ==============================================
// src/design-system/components/primitives/Banner/Banner.tsx
// SIMPLE DISCRETE BANNER - Full width, token-based
// Sticky, with close button support
// ==============================================

import React, { forwardRef, ReactNode, useState } from 'react';
import { cn } from '../../../lib/utils';
import { Typography } from '../Typography';
import { Button } from '../Button';
import { IconButtons } from '../IconButton/IconButton';
import { Input } from '../Input';


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
  /** Show close button */
  showClose?: boolean;
  /** Close button handler */
  onClose?: () => void;
  /** Sticky positioning */
  sticky?: boolean;
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
  showClose = false,
  onClose,
  sticky = false,
  className,
  ...props
}, ref) => {
  const [isClosed, setIsClosed] = useState(false);

  const handleClose = () => {
    setIsClosed(true);
    onClose?.();
  };

  if (isClosed) return null;

  const bannerClasses = cn(
    'banner',
    `banner--${type}`,
    sticky && 'banner--sticky',
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

      {/* Action and Close buttons */}
      <div className="banner__actions">
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
        
        {showClose && (
          <IconButtons.Close
            onClick={handleClose}
            aria-label="Close banner"
            variant="ghost"
            size="sm"
          />
        )}
      </div>
    </div>
  );
});

Banner.displayName = 'Banner';

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
  /** Callback when user submits email for waitlist */
 onWaitlistSubmit?: (email: string) => Promise<void>;
}

export const AvailabilityBanner = forwardRef<HTMLDivElement, AvailabilityBannerProps>(({
  availableSpots,
  totalSpots,
  isLoading = false,
  error = null,
  showAction = false,
  onAction,
  onWaitlistSubmit, // 👈 LÄGG TILL DEN HÄR
  icon,
  showClose = true,
  sticky = true,
  className,
  ...props
}, ref) => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const takenSpots = totalSpots - availableSpots;
  const isFullyBooked = availableSpots === 0;

  let bannerType: BannerType = 'default';
  let message = '';

  if (isLoading) {
    bannerType = 'loading';
    message = 'Kontrollerar tillgänglighet i vår Early Access...';
  } else if (error) {
    bannerType = 'error';
    message = 'Kunde inte hämta tillgänglighet just nu. Försök igen om en stund.';
  } else if (isFullyBooked) {
    bannerType = 'error';
    message = `Alla ${totalSpots} platser i vår Early Access är nu fyllda. Få ett mejl när vi öppnar upp igen!`;
  } else if (availableSpots === 1) {
    bannerType = 'error';
    message = `Sista platsen kvar i vår Early Access – först till kvarn!`;
  } else if (availableSpots <= 3) {
    bannerType = 'warning';
    message = `Endast ${availableSpots} platser kvar i vår Early Access – först till kvarn.`;
  } else {
    bannerType = 'default';
    message = `${availableSpots} av ${totalSpots} platser tillgängliga i vår Early Access just nu.`;
  }

  const handleEmailSubmit = async () => {
    if (!email || !email.includes('@')) return; // enkel validering
    if (!onWaitlistSubmit) return; // 👈 kolla om callback finns

    setSubmitting(true);

    try {
        await onWaitlistSubmit(email); // 👈 anropa callback från parent
        setSubmitted(true);
    } catch (err) {
        console.error('Error submitting email:', err);
    } finally {
        setSubmitting(false);
    }
    };


  return (
    <div className="w-full">
      <Banner
        ref={ref}
        message={message}
        type={bannerType}
        icon={icon}
        showClose={showClose}
        sticky={sticky}
        className={className}
        {...props}
      />

      {/* Email waitlist input – shown only when fully booked */}
      {isFullyBooked && !submitted && (
        <div className="flex flex-col md:flex-row items-center gap-2 p-4 md:p-5 border-t border-[var(--border-subtle)] bg-[var(--surface-banner-error)]">
          <Input
            type="email"
            placeholder="Din e-postadress"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            radius="md"
            size="md"
            className="flex-1"
          />
          <Button
            size="sm"
            onClick={handleEmailSubmit}
            disabled={submitting || !email}
          >
            {submitting ? 'Skickar...' : 'Notifiera mig'}
          </Button>
        </div>
      )}

      {isFullyBooked && submitted && (
        <div className="p-4 md:p-5 text-center bg-[var(--surface-banner-success)]">
          <Typography variant="body-md">
            Tack! Du får ett mejl när vi öppnar nästa Early Access.
          </Typography>
        </div>
      )}
    </div>
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