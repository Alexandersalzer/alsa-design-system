// ==============================================
// src/design-system/components/primitives/Banner/Banner.tsx
// BANNER COMPONENT - Displays alerts, announcements, and availability info
// ==============================================

import React, { forwardRef, ReactNode } from 'react';
import { cn } from '../../../lib/utils';
import { Typography } from '../Typography';
import { StatusIcons } from '../Icon';
import { IconButtons } from '../IconButton';

// ===== TYPE DEFINITIONS =====
export type BannerVariant = 'subtle' | 'solid' | 'outline';
export type BannerStatus = 'info' | 'success' | 'warning' | 'error';
export type BannerSize = 'sm' | 'md' | 'lg';

export interface BannerRootProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Banner status/type */
  status?: BannerStatus;
  /** Visual variant */
  variant?: BannerVariant;
  /** Banner size */
  size?: BannerSize;
  /** Additional CSS classes */
  className?: string;
  /** Banner children */
  children: ReactNode;
  /** Close button handler */
  onClose?: () => void;
  /** Show close button */
  showClose?: boolean;
}

export interface BannerIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Custom icon (defaults to status icon) */
  children?: ReactNode;
  /** Additional CSS classes */
  className?: string;
}

export interface BannerContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Content children */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
}

export interface BannerTitleProps extends Omit<React.HTMLAttributes<HTMLHeadingElement>, 'color'> {
  /** Title text */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
}

export interface BannerDescriptionProps extends Omit<React.HTMLAttributes<HTMLParagraphElement>, 'color'> {
  /** Description text */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
}

export interface BannerMetricsProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Metrics children */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
}

export interface BannerMetricProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Metric label */
  label: ReactNode;
  /** Metric value */
  value: ReactNode;
  /** Metric variant (accent, success, warning, error) */
  variant?: 'accent' | 'success' | 'warning' | 'error' | 'secondary';
  /** Additional CSS classes */
  className?: string;
}

export interface BannerActionProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Action children */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
}

// ===== ICON MAPPING =====
const getStatusIcon = (status: BannerStatus): ReactNode => {
  switch (status) {
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
  status = 'info',
  variant = 'subtle',
  size = 'md',
  className,
  children,
  onClose,
  showClose = false,
  ...props
}, ref) => {
  const bannerClasses = cn(
    'banner',
    `banner--${status}`,
    `banner--${variant}`,
    `banner--${size}`,
    className
  );

  return (
    <div
      ref={ref}
      className={bannerClasses}
      role="status"
      aria-live="polite"
      data-status={status}
      data-variant={variant}
      data-size={size}
      {...props}
    >
      <div className="banner__inner">
        {children}
      </div>
      {showClose && (
        <div className="banner__close-wrapper">
          <IconButtons.Close
            onClick={onClose}
            variant="ghost"
            size="sm"
            aria-label="Close banner"
          />
        </div>
      )}
    </div>
  );
});

BannerRoot.displayName = 'Banner.Root';

// ===== INDICATOR COMPONENT =====
export const BannerIndicator = forwardRef<HTMLDivElement, BannerIndicatorProps>(({
  children,
  className,
  ...props
}, ref) => {
  const indicatorClasses = cn(
    'banner__indicator',
    className
  );

  return (
    <div
      ref={ref}
      className={indicatorClasses}
      {...props}
    >
      {children}
    </div>
  );
});

BannerIndicator.displayName = 'Banner.Indicator';

// ===== CONTENT COMPONENT =====
export const BannerContent = forwardRef<HTMLDivElement, BannerContentProps>(({
  children,
  className,
  ...props
}, ref) => {
  const contentClasses = cn(
    'banner__content',
    className
  );

  return (
    <div
      ref={ref}
      className={contentClasses}
      {...props}
    >
      {children}
    </div>
  );
});

BannerContent.displayName = 'Banner.Content';

// ===== TITLE COMPONENT =====
export const BannerTitle = forwardRef<HTMLHeadingElement, BannerTitleProps>(({
  children,
  className,
  ...props
}, ref) => {
  return (
    <Typography
      ref={ref}
      variant="label-md"
      weight="semibold"
      className={cn('banner__title', className)}
      as="h4"
      {...props}
    >
      {children}
    </Typography>
  );
});

BannerTitle.displayName = 'Banner.Title';

// ===== DESCRIPTION COMPONENT =====
export const BannerDescription = forwardRef<HTMLParagraphElement, BannerDescriptionProps>(({
  children,
  className,
  ...props
}, ref) => {
  return (
    <Typography
      ref={ref}
      variant="body-sm"
      className={cn('banner__description', className)}
      as="p"
      {...props}
    >
      {children}
    </Typography>
  );
});

BannerDescription.displayName = 'Banner.Description';

// ===== METRICS CONTAINER COMPONENT =====
export const BannerMetrics = forwardRef<HTMLDivElement, BannerMetricsProps>(({
  children,
  className,
  ...props
}, ref) => {
  const metricsClasses = cn(
    'banner__metrics',
    className
  );

  return (
    <div
      ref={ref}
      className={metricsClasses}
      {...props}
    >
      {children}
    </div>
  );
});

BannerMetrics.displayName = 'Banner.Metrics';

// ===== METRIC COMPONENT =====
export const BannerMetric = forwardRef<HTMLDivElement, BannerMetricProps>(({
  label,
  value,
  variant = 'secondary',
  className,
  ...props
}, ref) => {
  const metricClasses = cn(
    'banner__metric',
    `banner__metric--${variant}`,
    className
  );

  return (
    <div
      ref={ref}
      className={metricClasses}
      {...props}
    >
      <Typography
        variant="body-xs"
        weight="medium"
        className="banner__metric-label"
        as="span"
      >
        {label}
      </Typography>
      <Typography
        variant="h4"
        weight="bold"
        className="banner__metric-value"
        as="span"
      >
        {value}
      </Typography>
    </div>
  );
});

BannerMetric.displayName = 'Banner.Metric';

// ===== ACTION COMPONENT =====
export const BannerAction = forwardRef<HTMLDivElement, BannerActionProps>(({
  children,
  className,
  ...props
}, ref) => {
  const actionClasses = cn(
    'banner__action',
    className
  );

  return (
    <div
      ref={ref}
      className={actionClasses}
      {...props}
    >
      {children}
    </div>
  );
});

BannerAction.displayName = 'Banner.Action';

// ===== COMPOSITE BANNER OBJECT =====
export const Banner = {
  Root: BannerRoot,
  Indicator: BannerIndicator,
  Content: BannerContent,
  Title: BannerTitle,
  Description: BannerDescription,
  Metrics: BannerMetrics,
  Metric: BannerMetric,
  Action: BannerAction,
};

// ===== CLOSED COMPONENT COMPOSITION (Convenience) =====
export interface BannerClosedProps
  extends Omit<BannerRootProps, 'children' | 'title'> {
  /** Banner title */
  title?: ReactNode;
  /** Banner description/message */
  description?: ReactNode;
  /** Metrics to display */
  metrics?: Array<{
    label: ReactNode;
    value: ReactNode;
    variant?: 'accent' | 'success' | 'warning' | 'error' | 'secondary';
  }>;
  /** Custom icon */
  icon?: ReactNode;
  /** Action element/button */
  action?: ReactNode;
}


export const BannerClosed = forwardRef<HTMLDivElement, BannerClosedProps>(({
  status = 'info',
  variant = 'subtle',
  size = 'md',
  title,
  description,
  metrics,
  icon,
  action,
  className,
  onClose,
  showClose,
  ...props
}, ref) => {
  return (
    <BannerRoot
      ref={ref}
      status={status}
      variant={variant}
      size={size}
      className={className}
      onClose={onClose}
      showClose={showClose}
      {...props}
    >
      <BannerIndicator>
        {icon || getStatusIcon(status)}
      </BannerIndicator>

      <BannerContent>
        {title && <BannerTitle>{title}</BannerTitle>}
        {description && <BannerDescription>{description}</BannerDescription>}

        {metrics && metrics.length > 0 && (
          <BannerMetrics>
            {metrics.map((metric, index) => (
              <BannerMetric
                key={index}
                label={metric.label}
                value={metric.value}
                variant={metric.variant}
              />
            ))}
          </BannerMetrics>
        )}
      </BannerContent>

      {action && <BannerAction>{action}</BannerAction>}
    </BannerRoot>
  );
});

BannerClosed.displayName = 'BannerClosed';

// ===== CONVENIENCE COMPONENTS =====
export interface ErrorBannerProps extends Omit<BannerClosedProps, 'status'> {}
export const ErrorBanner = forwardRef<HTMLDivElement, ErrorBannerProps>((props, ref) => (
  <BannerClosed ref={ref} status="error" {...props} />
));
ErrorBanner.displayName = 'ErrorBanner';

export interface SuccessBannerProps extends Omit<BannerClosedProps, 'status'> {}
export const SuccessBanner = forwardRef<HTMLDivElement, SuccessBannerProps>((props, ref) => (
  <BannerClosed ref={ref} status="success" {...props} />
));
SuccessBanner.displayName = 'SuccessBanner';

export interface WarningBannerProps extends Omit<BannerClosedProps, 'status'> {}
export const WarningBanner = forwardRef<HTMLDivElement, WarningBannerProps>((props, ref) => (
  <BannerClosed ref={ref} status="warning" {...props} />
));
WarningBanner.displayName = 'WarningBanner';

export interface InfoBannerProps extends Omit<BannerClosedProps, 'status'> {}
export const InfoBanner = forwardRef<HTMLDivElement, InfoBannerProps>((props, ref) => (
  <BannerClosed ref={ref} status="info" {...props} />
));
InfoBanner.displayName = 'InfoBanner';

export interface AvailabilityBannerProps extends Omit<BannerClosedProps, 'status'> {
  /** Available spots count */
  availableSpots: number;
  /** Total spots count */
  totalSpots: number;
  /** Loading state */
  isLoading?: boolean;
  /** Error state */
  error?: string | null;
}

export const AvailabilityBanner = forwardRef<HTMLDivElement, AvailabilityBannerProps>(({
  availableSpots,
  totalSpots,
  isLoading = false,
  error = null,
  className,
  onClose,
  showClose,
  action,
  ...props
}, ref) => {
  const takenSpots = totalSpots - availableSpots;
  const percentageFull = Math.round((takenSpots / totalSpots) * 100);
  const isFullyBooked = availableSpots === 0;

  const status = isFullyBooked ? 'error' : availableSpots <= 2 ? 'warning' : 'success';
  const title = isLoading ? 'Hämtar tillgänglighet...' : isFullyBooked ? 'Fullt bokad' : 'Platser lediga';
  const description = isLoading
    ? 'Vänta medan vi kontrollerar tillgängliga platser'
    : error
    ? error
    : `${availableSpots} av ${totalSpots} platser lediga (${percentageFull}% full)`;

  return (
    <BannerClosed
      ref={ref}
      status={status}
      variant="solid"
      size="md"
      title={title}
      description={description}
      metrics={
        !isLoading && !error
          ? [
              {
                label: 'Lediga',
                value: availableSpots,
                variant: isFullyBooked ? 'error' : 'success',
              },
              {
                label: 'Tagna',
                value: takenSpots,
                variant: 'warning',
              },
            ]
          : undefined
      }
      action={action}
      className={className}
      onClose={onClose}
      showClose={showClose}
      {...props}
    />
  );
});

AvailabilityBanner.displayName = 'AvailabilityBanner';