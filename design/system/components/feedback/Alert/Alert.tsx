// ==============================================
// src/design-system/components/primitives/Alert/Alert.tsx
// ALERT COMPONENT - WITH SURFACE VARIANTS
// ==============================================

import React, { forwardRef, ReactNode } from 'react';
import { cn } from '../../../utils/cn';
import { Typography } from '../../Typography';
import { StatusIcons } from '../../media';
import { IconButtons } from '../../actions';

// ===== TYPE DEFINITIONS =====
export type AlertVariant = 'info' | 'success' | 'warning' | 'error';
export type AlertSurface = 'subtle' | 'muted' | 'vibrant';

export interface AlertRootProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Alert status/type */
  variant?: AlertVariant;
  /** Surface variant */
  surface?: AlertSurface;
  /** Additional CSS classes */
  className?: string;
  /** Alert children */
  children: ReactNode;
}

export interface AlertIndicatorProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Custom icon (defaults to status icon) */
  children?: ReactNode;
  /** Additional CSS classes */
  className?: string;
}

export interface AlertContentProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Content children */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
}

export interface AlertTitleProps extends Omit<React.HTMLAttributes<HTMLHeadingElement>, 'color'> {
  /** Title text */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
}

export interface AlertDescriptionProps extends Omit<React.HTMLAttributes<HTMLParagraphElement>, 'color'> {
  /** Description text */
  children: ReactNode;
  /** Additional CSS classes */
  className?: string;
}

export interface AlertCloseButtonProps extends Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'children'> {
  /** Close handler */
  onClose?: () => void;
  /** Additional CSS classes */
  className?: string;
}

// ===== ICON MAPPING =====
const getStatusIcon = (status: AlertVariant): ReactNode => {
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
export const AlertRoot = forwardRef<HTMLDivElement, AlertRootProps>(({
  variant = 'info',
  surface = 'subtle',
  className,
  children,
  ...props
}, ref) => {
  const alertClasses = cn(
    'alert',
    `alert--${variant}`,
    surface !== 'subtle' && `alert--${surface}`,
    className
  );

  return (
    <div 
      ref={ref} 
      className={alertClasses}
      role="alert"
      aria-live="polite"
      data-variant={variant}
      data-surface={surface}
      {...props}
    >
      {children}
    </div>
  );
});

AlertRoot.displayName = 'Alert.Root';

// ===== INDICATOR COMPONENT =====
export const AlertIndicator = forwardRef<HTMLDivElement, AlertIndicatorProps>(({
  children,
  className,
  ...props
}, ref) => {
  const indicatorClasses = cn(
    'alert__indicator',
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

AlertIndicator.displayName = 'Alert.Indicator';

// ===== CONTENT COMPONENT =====
export const AlertContent = forwardRef<HTMLDivElement, AlertContentProps>(({
  children,
  className,
  ...props
}, ref) => {
  const contentClasses = cn(
    'alert__content',
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

AlertContent.displayName = 'Alert.Content';

// ===== TITLE COMPONENT =====
export const AlertTitle = forwardRef<HTMLHeadingElement, AlertTitleProps>(({
  children,
  className,
  ...props
}, ref) => {
  return (
    <Typography
      ref={ref}
      variant="label-md"
      weight="semibold"
      className={cn('alert__title', className)}
      as="h5"
      {...props}
    >
      {children}
    </Typography>
  );
});

AlertTitle.displayName = 'Alert.Title';

// ===== DESCRIPTION COMPONENT =====
export const AlertDescription = forwardRef<HTMLParagraphElement, AlertDescriptionProps>(({
  children,
  className,
  ...props
}, ref) => {
  return (
    <Typography
      ref={ref}
      variant="body-sm"
      className={cn('alert__description', className)}
      as="p"
      {...props}
    >
      {children}
    </Typography>
  );
});

AlertDescription.displayName = 'Alert.Description';

// ===== CLOSE BUTTON COMPONENT =====
export const AlertCloseButton = forwardRef<HTMLButtonElement, AlertCloseButtonProps>(({
  onClose,
  className,
  ...props
}, ref) => {
  return (
    <div className={cn('alert__close-wrapper', className)}>
      <IconButtons.Close
        onClick={onClose}
        variant="ghost"
        size="sm"
        {...props}
      />
    </div>
  );
});

AlertCloseButton.displayName = 'Alert.CloseButton';

// ===== COMPOSITE ALERT OBJECT =====
export const Alert = {
  Root: AlertRoot,
  Indicator: AlertIndicator,
  Content: AlertContent,
  Title: AlertTitle,
  Description: AlertDescription,
  CloseButton: AlertCloseButton,
};

// ===== CLOSED COMPONENT COMPOSITION (Optional) =====
export interface AlertClosedProps extends Omit<AlertRootProps, 'children' | 'title'> {
  /** Alert title */
  title?: ReactNode;
  /** Alert description/message */
  children: ReactNode;
  /** Custom icon */
  icon?: ReactNode;
  /** Show close button */
  showClose?: boolean;
  /** Close handler */
  onClose?: () => void;
  /** Start element (replaces indicator) */
  startElement?: ReactNode;
  /** End element (additional content on right) */
  endElement?: ReactNode;
}

export const AlertClosed = forwardRef<HTMLDivElement, AlertClosedProps>(({
  variant = 'info',
  surface = 'subtle',
  title,
  children,
  icon,
  showClose = false,
  onClose,
  startElement,
  endElement,
  className,
  ...props
}, ref) => {
  return (
    <AlertRoot 
      ref={ref} 
      variant={variant} 
      surface={surface}
      className={className}
      {...props}
    >
      {startElement || (
        <AlertIndicator>
          {icon || getStatusIcon(variant)}
        </AlertIndicator>
      )}
      
      {title ? (
        <AlertContent>
          <AlertTitle>{title}</AlertTitle>
          <AlertDescription>{children}</AlertDescription>
        </AlertContent>
      ) : (
        <AlertContent>
          <AlertDescription>{children}</AlertDescription>
        </AlertContent>
      )}

      {showClose && <AlertCloseButton onClose={onClose} />}
      {endElement}
    </AlertRoot>
  );
});

AlertClosed.displayName = 'AlertClosed';

// ===== CONVENIENCE COMPONENTS =====
export interface ErrorAlertProps extends Omit<AlertClosedProps, 'variant'> {}
export const ErrorAlert = forwardRef<HTMLDivElement, ErrorAlertProps>((props, ref) => (
  <AlertClosed ref={ref} variant="error" {...props} />
));
ErrorAlert.displayName = 'ErrorAlert';

export interface SuccessAlertProps extends Omit<AlertClosedProps, 'variant'> {}
export const SuccessAlert = forwardRef<HTMLDivElement, SuccessAlertProps>((props, ref) => (
  <AlertClosed ref={ref} variant="success" {...props} />
));
SuccessAlert.displayName = 'SuccessAlert';

export interface WarningAlertProps extends Omit<AlertClosedProps, 'variant'> {}
export const WarningAlert = forwardRef<HTMLDivElement, WarningAlertProps>((props, ref) => (
  <AlertClosed ref={ref} variant="warning" {...props} />
));
WarningAlert.displayName = 'WarningAlert';

export interface InfoAlertProps extends Omit<AlertClosedProps, 'variant'> {}
export const InfoAlert = forwardRef<HTMLDivElement, InfoAlertProps>((props, ref) => (
  <AlertClosed ref={ref} variant="info" {...props} />
));
InfoAlert.displayName = 'InfoAlert';