// ==============================================
// src/design-system/components/primitives/Toast/Toast.tsx
// TOAST COMPONENT - WITH SURFACE VARIANTS
// ==============================================

import React, { forwardRef, ReactNode, useEffect, useState, useRef } from 'react';
import { cn } from '../../../utils/cn';
import { Typography } from '../../Typography';
import { 
  Icon,
  StatusIcons,
  XMarkIcon
} from '../../media';

// ===== TYPE DEFINITIONS =====
export type ToastVariant = 'info' | 'success' | 'warning' | 'error';
export type ToastSurface = 'subtle' | 'muted' | 'vibrant';
export type ToastState = 'entering' | 'visible' | 'exiting' | 'exited';

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  onClose?: () => void;
  /** Toast message text */
  children: ReactNode;
  /** Toast status/type */
  variant?: ToastVariant;
  /** Surface variant */
  surface?: ToastSurface;
  /** Optional left icon (defaults to status icon) */
  leftIcon?: ReactNode;
  /** Show close button */
  showClose?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Toast title (optional) */
  title?: string;
  /** Auto-dismiss duration in milliseconds (0 = no auto-dismiss) */
  duration?: number;
  /** Whether the toast should disappear automatically or not */
  autoDismiss?: boolean;
  /** Called when animation completes */
  onAnimationComplete?: (state: ToastState) => void;
  /** Force animation state (for external control) */
  forceState?: ToastState;
}

// ===== ICON MAPPING =====
const getStatusIcon = (variant: ToastVariant): ReactNode => {
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

// ===== MAIN COMPONENT =====
export const Toast = forwardRef<HTMLDivElement, ToastProps>(({
  children,
  variant = 'info',
  surface = 'subtle',
  leftIcon,
  showClose = true,
  onClose,
  title,
  className,
  duration = 5000,
  autoDismiss = false,
  onAnimationComplete,
  forceState,
  style,
  ...props
}, ref) => {
  const [animationState, setAnimationState] = useState<ToastState>('entering');
  const [isPaused, setIsPaused] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Use forced state if provided, otherwise use internal state
  const currentState = forceState || animationState;

  // Handle animation lifecycle
  useEffect(() => {
    if (forceState) return; // Don't manage state if externally controlled

    // Start entrance animation
    const enterTimer = setTimeout(() => {
      setAnimationState('visible');
      onAnimationComplete?.('visible');
    }, 100);

    return () => clearTimeout(enterTimer);
  }, [forceState, onAnimationComplete]);

  // Handle auto-dismiss (if autoDismiss is true)
  useEffect(() => {
    if (autoDismiss && duration > 0 && currentState === 'visible' && !isPaused) {
      timeoutRef.current = setTimeout(() => {
        handleClose();
      }, duration);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [autoDismiss, duration, currentState, isPaused]);

  // Handle close with exit animation
  const handleClose = () => {
    if (currentState === 'exiting' || currentState === 'exited') return;

    setAnimationState('exiting');
    onAnimationComplete?.('exiting');

    // Wait for exit animation to complete
    setTimeout(() => {
      setAnimationState('exited');
      onAnimationComplete?.('exited');
      onClose?.();
    }, 250); // Match animation duration
  };

  // Pause/resume auto-dismiss on hover
  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  // Don't render if exited
  if (currentState === 'exited') {
    return null;
  }

  const toastClasses = cn(
    'toast',
    `toast--${variant}`,
    surface !== 'subtle' && `toast--${surface}`,
    className
  );

  return (
    <div 
      ref={ref} 
      className={toastClasses}
      data-state={currentState}
      data-variant={variant}
      data-surface={surface}
      style={style}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="alert"
      aria-live="polite"
      {...props}
    >
      {/* Left Icon */}
      <div className="toast__icon-left">
        {leftIcon || getStatusIcon(variant)}
      </div>

      {/* Content */}
      <div className="toast__content">
        {title && (
          <Typography
            variant="label-md"
            weight="semibold"
            className="toast__title"
          >
            {title}
          </Typography>
        )}
        <Typography
          variant="body-sm"
          className="toast__message"
        >
          {children}
        </Typography>
      </div>

      {/* Close Button */}
      {showClose && (
        <button
          onClick={handleClose}
          className="toast__close"
          aria-label="Close notification"
          type="button"
        >
          <Icon size="sm" color="primary">
            <XMarkIcon />
          </Icon>
        </button>
      )}
    </div>
  );
});

Toast.displayName = 'Toast';

// ===== CONVENIENCE COMPONENTS =====
export interface ErrorToastProps extends Omit<ToastProps, 'variant'> {}
export const ErrorToast = forwardRef<HTMLDivElement, ErrorToastProps>((props, ref) => (
  <Toast ref={ref} variant="error" {...props} />
));
ErrorToast.displayName = 'ErrorToast';

export interface SuccessToastProps extends Omit<ToastProps, 'variant'> {}
export const SuccessToast = forwardRef<HTMLDivElement, SuccessToastProps>((props, ref) => (
  <Toast ref={ref} variant="success" {...props} />
));
SuccessToast.displayName = 'SuccessToast';

export interface WarningToastProps extends Omit<ToastProps, 'variant'> {}
export const WarningToast = forwardRef<HTMLDivElement, WarningToastProps>((props, ref) => (
  <Toast ref={ref} variant="warning" {...props} />
));
WarningToast.displayName = 'WarningToast';

export interface InfoToastProps extends Omit<ToastProps, 'variant'> {}
export const InfoToast = forwardRef<HTMLDivElement, InfoToastProps>((props, ref) => (
  <Toast ref={ref} variant="info" {...props} />
));
InfoToast.displayName = 'InfoToast';