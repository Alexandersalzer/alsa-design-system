// ===============================================
// src/design-system/components/primitives/Toast/Toast.tsx
// TOAST COMPONENT - Using existing Typography and Icon components
// ===============================================
import React, { forwardRef, ReactNode } from 'react';
import { cn } from '../../../lib/utils';
import { Typography } from '../Typography';
import { Icon } from '../Icon';
import { Icons } from '../Icon'; // Import your icon collection

// ===== TYPE DEFINITIONS =====
export type ToastVariant = 'info' | 'success' | 'warning' | 'error';

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Toast message text */
  children: ReactNode;
  /** Toast variant/type */
  variant?: ToastVariant;
  /** Optional left icon (defaults to variant icon) */
  leftIcon?: ReactNode;
  /** Show close button */
  showClose?: boolean;
  /** Close button handler */
  onClose?: () => void;
  /** Additional CSS classes */
  className?: string;
  /** Toast title (optional) */
  title?: string;
}

// ===== ICON MAPPING =====
const getVariantIcon = (variant: ToastVariant): ReactNode => {
  const iconProps = { size: 'md' as const };
  
  switch (variant) {
    case 'success':
      return <Icons.Status.Success {...iconProps} />;
    case 'warning':
      return <Icons.Status.Warning {...iconProps} />;
    case 'error':
      return <Icons.Status.Error {...iconProps} />;
    case 'info':
    default:
      return <Icons.Status.Info {...iconProps} />;
  }
};

// ===== MAIN COMPONENT =====
export const Toast = forwardRef<HTMLDivElement, ToastProps>(({
  children,
  variant = 'info',
  leftIcon,
  showClose = true,
  onClose,
  title,
  className,
  ...props
}, ref) => {
  const toastClasses = cn(
    'toast',
    `toast--${variant}`,
    className
  );

  return (
    <div ref={ref} className={toastClasses} {...props}>
      {/* Left Icon */}
      <div className="toast__icon-left">
        {leftIcon || getVariantIcon(variant)}
      </div>

      {/* Content */}
      <div className="toast__content">
        {title && (
          <Typography
            variant="label-md"
            weight="semibold"
            className="toast__title"
            // 👈 REMOVED: style={{ color: 'inherit' }}
          >
            {title}
          </Typography>
        )}
        
        <Typography
          variant="body-sm"
          className="toast__message"
          // 👈 REMOVED: style={{ color: 'inherit' }}
        >
          {children}
        </Typography>
      </div>

      {/* Close Button */}
      {showClose && onClose && (
        <button
          onClick={onClose}
          className="toast__close"
          aria-label="Close notification"
        >
          <Icons.Action.Close size="sm" />
        </button>
      )}
    </div>
  );
});

Toast.displayName = 'Toast';

// ===== CONVENIENCE COMPONENTS =====
export type ErrorToastProps = Omit<ToastProps, 'variant'>;
export const ErrorToast = forwardRef<HTMLDivElement, ErrorToastProps>((props, ref) => (
  <Toast ref={ref} variant="error" {...props} />
));
ErrorToast.displayName = 'ErrorToast';

export type SuccessToastProps = Omit<ToastProps, 'variant'>;
export const SuccessToast = forwardRef<HTMLDivElement, SuccessToastProps>((props, ref) => (
  <Toast ref={ref} variant="success" {...props} />
));
SuccessToast.displayName = 'SuccessToast';

export type WarningToastProps = Omit<ToastProps, 'variant'>;
export const WarningToast = forwardRef<HTMLDivElement, WarningToastProps>((props, ref) => (
  <Toast ref={ref} variant="warning" {...props} />
));
WarningToast.displayName = 'WarningToast';

export type InfoToastProps = Omit<ToastProps, 'variant'>;
export const InfoToast = forwardRef<HTMLDivElement, InfoToastProps>((props, ref) => (
  <Toast ref={ref} variant="info" {...props} />
));
InfoToast.displayName = 'InfoToast';