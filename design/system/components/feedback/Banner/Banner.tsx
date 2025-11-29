// ==============================================
// src/design-system/components/primitives/Banner/Banner.tsx
// BANNER COMPONENT - WITH SURFACE VARIANTS
// ==============================================

import React, { forwardRef, ReactNode, useState } from 'react';
import { cn } from '../../../utils/cn';
import { Typography } from '../../Typography';
import { Button } from '../../actions';
import { IconButtons } from '../../actions';
import { Input } from '../../forms';

// ===== TYPE DEFINITIONS =====
export type BannerVariant = 'default' | 'info' | 'accent' | 'success' | 'warning' | 'error';
export type BannerSurface = 'subtle' | 'muted' | 'vibrant';

export interface BannerProps extends React.HTMLAttributes<HTMLDivElement> {
  message: string;
  variant?: BannerVariant;
  surface?: BannerSurface;
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
      variant = 'default',
      surface = 'subtle',
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
      `banner--${variant}`,
      surface !== 'subtle' && `banner--${surface}`,
      sticky && 'banner--sticky',
      className
    );

    return (
      <div
        ref={ref}
        className={bannerClasses}
        role="variant"
        aria-live="polite"
        data-variant={variant}
        data-surface={surface}
        {...props}
      >
        {/* Icon + Message container */}
        <div className="banner__content">
          {icon && <div className="banner__icon">{icon}</div>}
          <Typography variant="body-md" className="banner__message" as="p">
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
  }
);

Banner.displayName = 'Banner';

// ===== AVAILABILITY BANNER =====
export interface AvailabilityBannerProps
  extends Omit<BannerProps, 'variant' | 'message'> {
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
      surface = 'subtle',
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

    let bannerVariant: BannerVariant = 'default';
    let message = '';

    if (isLoading) {
      bannerVariant = 'info';
      message = 'Kontrollerar tillgänglighet i vår Early Access...';
    } else if (error) {
      bannerVariant = 'error';
      message = 'Kunde inte hämta tillgänglighet just nu. Försök igen om en stund.';
    } else if (isFullyBooked) {
      bannerVariant = 'accent';
      message = `Early Access är fullt just nu!`;
    } else if (availableSpots === 1) {
      bannerVariant = 'warning';
      message = `Sista platsen kvar i Early Access – först till kvarn!`;
    } else if (availableSpots <= 3) {
      bannerVariant = 'warning';
      message = `Endast ${availableSpots} platser kvar i vår Early Access!`;
    } else {
      bannerVariant = 'default';
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
            `banner--${bannerVariant}`,
            surface !== 'subtle' && `banner--${surface}`,
            sticky && 'banner--sticky',
            className
          )}
          data-variant={bannerVariant}
          data-surface={surface}
          {...props}
        >
          <div className="banner__content">
            {icon && <div className="banner__icon">{icon}</div>}

            {/* Message */}
            <Typography
              variant="body-md"
              className="banner__message"
              as="p"
            >
              {message}
            </Typography>
          </div>

          {/* Inline waitlist (if fully booked) */}
          {isFullyBooked && !submitted && (
            <div className="banner__waitlist">
              <Input
                type="email"
                placeholder="Fyll i din e-post"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                radius="sm"
                size="sm"
                className="banner__waitlist-input"
              />
              <Button
                size="sm"
                onClick={handleEmailSubmit}
                disabled={submitting || !email}
                className="banner__waitlist-button"
              >
                {submitting ? 'Skickar...' : 'Bli prioriterad'}
              </Button>
            </div>
          )}

          {isFullyBooked && submitted && (
            <Typography variant="body-sm" className="banner__success-message">
              Tack! Du får ett mejl när vi öppnar igen.
            </Typography>
          )}

          {/* Optional close */}
          {showClose && (
            <div className="banner__actions">
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
export const InfoBanner = (props: Omit<BannerProps, 'variant'>) => (
  <Banner {...props} variant="info" />
);

export const AccentBanner = (props: Omit<BannerProps, 'variant'>) => (
  <Banner {...props} variant="accent" />
);

export const SuccessBanner = (props: Omit<BannerProps, 'variant'>) => (
  <Banner {...props} variant="success" />
);

export const WarningBanner = (props: Omit<BannerProps, 'variant'>) => (
  <Banner {...props} variant="warning" />
);

export const ErrorBanner = (props: Omit<BannerProps, 'variant'>) => (
  <Banner {...props} variant="error" />
);