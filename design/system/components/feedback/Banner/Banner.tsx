// ==============================================
// src/design-system/components/primitives/Banner/Banner.tsx
// SIMPLE DISCRETE BANNER - Full width, token-based
// Sticky, with close button support + waitlist inline
// ==============================================

import React, { forwardRef, ReactNode, useState } from 'react';
import { cn } from '../../../utils/cn';
import { Typography } from '../../Typography';
import { Button } from '../../actions';
import { IconButtons } from '../../actions';
import { Input } from '../../forms';

// ===== TYPE DEFINITIONS =====
export type BannerType =
  | 'default'
  | 'info'
  | 'accent'
  | 'success'
  | 'warning'
  | 'error'
  | 'loading';

export interface BannerProps extends React.HTMLAttributes<HTMLDivElement> {
  message: string;
  type?: BannerType;
  icon?: ReactNode;
  actionText?: string;
  onAction?: () => void;
  showClose?: boolean;
  onClose?: () => void;
  sticky?: boolean;
  className?: string;
}

// ===== SIMPLE BANNER COMPONENT =====
export const Banner = forwardRef<HTMLDivElement, BannerProps>(
  (
    {
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
    },
    ref
  ) => {
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
        <div className="banner__content flex items-center gap-2 flex-1">
          {icon && <div className="banner__icon">{icon}</div>}
          <Typography variant="body-md" className="banner__message" as="p">
            {message}
          </Typography>
        </div>

        {/* Action and Close buttons */}
        <div className="banner__actions flex items-center gap-2">
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
  }
);

Banner.displayName = 'Banner';

// ===== AVAILABILITY BANNER =====
export interface AvailabilityBannerProps
  extends Omit<BannerProps, 'type' | 'message'> {
  availableSpots: number;
  totalSpots: number;
  isLoading?: boolean;
  error?: string | null;
  showAction?: boolean;
  onWaitlistSubmit?: (email: string) => Promise<void>;
}

export const AvailabilityBanner = forwardRef<
  HTMLDivElement,
  AvailabilityBannerProps
>(
  (
    {
      availableSpots,
      totalSpots,
      isLoading = false,
      error = null,
      showAction = false,
      onAction,
      onWaitlistSubmit,
      icon,
      showClose = true,
      sticky = true,
      className,
      ...props
    },
    ref
  ) => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [submitting, setSubmitting] = useState(false);

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
      bannerType = 'accent';
      message = `Early Access är fullt just nu!`;
    } else if (availableSpots === 1) {
      bannerType = 'warning';
      message = `Sista platsen kvar i Early Access – först till kvarn!`;
    } else if (availableSpots <= 3) {
      bannerType = 'warning';
      message = `Endast ${availableSpots} platser kvar i vår Early Access!`;
    } else {
      bannerType = 'default';
      message = `${availableSpots} av ${totalSpots} platser tillgängliga i Early Access.`;
    }

    const handleEmailSubmit = async () => {
      if (!email || !email.includes('@')) return;
      if (!onWaitlistSubmit) return;

      setSubmitting(true);
      try {
        await onWaitlistSubmit(email);
        setSubmitted(true);
      } catch (err) {
        console.error('Error submitting email:', err);
      } finally {
        setSubmitting(false);
      }
    };

    return (
      <div className="w-full">
        <div
          ref={ref}
          className={cn(
            'banner',
            `banner--${bannerType}`,
            sticky && 'banner--sticky',
            'flex items-center justify-center gap-3 px-4 py-2',
            className
          )}
          {...props}
        >
          {icon && <div className="banner__icon">{icon}</div>}

          {/* Message */}
          <Typography
            variant="body-md"
            className="banner__message text-center"
            as="p"
          >
            {message}
          </Typography>

          {/* Inline waitlist (if fully booked) */}
          {isFullyBooked && !submitted && (
            <div className="flex items-center gap-2 ml-4 flex-wrap justify-center sm:flex-nowrap">
              <Input
                type="email"
                placeholder="Fyll i din e-post"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                radius="sm"
                size="sm"
                className="w-44 min-w-[160px] sm:w-44"
              />
              <Button
                size="sm"
                onClick={handleEmailSubmit}
                disabled={submitting || !email}
                className="whitespace-nowrap"
              >
                {submitting ? 'Skickar...' : 'Bli prioriterad'}
              </Button>
            </div>
          )}

          {isFullyBooked && submitted && (
            <Typography variant="body-sm" className="ml-4 text-[var(--text-banner-success)] text-center">
              Tack! Du får ett mejl när vi öppnar igen.
            </Typography>
          )}

          {/* Optional close */}
          {showClose && (
            <div className="ml-auto">
              <IconButtons.Close
                onClick={onAction}
                aria-label="Stäng banner"
                variant="ghost"
                size="sm"
              />
            </div>
          )}
        </div>
      </div>
    );
  }
);

AvailabilityBanner.displayName = 'AvailabilityBanner';

// ===== CONVENIENCE EXPORTS =====
export const InfoBanner = (props: Omit<BannerProps, 'type'>) => (
  <Banner {...props} type="info" />
);

export const AccentBanner = (props: Omit<BannerProps, 'type'>) => (
  <Banner {...props} type="accent" />
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
