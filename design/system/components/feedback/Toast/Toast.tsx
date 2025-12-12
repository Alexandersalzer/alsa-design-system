// ==============================================
// src/design-system/components/primitives/Toast/Toast.tsx
// TOAST COMPONENT - WITH SURFACE VARIANTS AND PROGRESS BAR
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
  /** Show close button (shows on hover by default) */
  showClose?: boolean;
  /** Additional CSS classes */
  className?: string;
  /** Toast title (optional) */
  title?: string;
  /** Auto-dismiss duration in milliseconds (0 = no auto-dismiss, defaults vary by variant) */
  duration?: number;
  /** Whether the toast should disappear automatically or not */
  autoDismiss?: boolean;
  /** Show timeout progress bar */
  showProgress?: boolean;
  /** Custom end content (e.g., action buttons) */
  endContent?: ReactNode;
  /** Promise to track (shows loading state until resolved/rejected) */
  promise?: Promise<any>;
  /** Loading component to show while promise is pending */
  loadingComponent?: ReactNode;
  /** Called when animation completes */
  onAnimationComplete?: (state: ToastState) => void;
  /** Force animation state (for external control) */
  forceState?: ToastState;
}

// ===== VARIANT-SPECIFIC DURATIONS =====
const getDefaultDuration = (variant: ToastVariant): number => {
  switch (variant) {
    case 'success':
      return 4000; // Quick confirmation
    case 'info':
      return 5000; // Default
    case 'warning':
      return 6000; // More time to read
    case 'error':
      return 8000; // Critical, needs attention
    default:
      return 5000;
  }
};

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
      return <StatusIcons.Info />;
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
  duration,
  autoDismiss = false,
  showProgress = false,
  endContent,
  promise,
  loadingComponent,
  onAnimationComplete,
  forceState,
  style,
  ...props
}, ref) => {
  const [animationState, setAnimationState] = useState<ToastState>('entering');
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(100);
  const [promiseState, setPromiseState] = useState<'pending' | 'resolved' | 'rejected' | null>(
    promise ? 'pending' : null
  );

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const progressIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Get effective duration (use prop or variant-specific default)
  const effectiveDuration = duration ?? getDefaultDuration(variant);

  // Use forced state if provided, otherwise use internal state
  const currentState = forceState || animationState;

  // Handle promise tracking
  useEffect(() => {
    if (!promise) return;

    setPromiseState('pending');

    promise
      .then(() => {
        setPromiseState('resolved');
      })
      .catch(() => {
        setPromiseState('rejected');
      });
  }, [promise]);

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

  // Handle auto-dismiss with progress bar
  useEffect(() => {
    if (
      autoDismiss &&
      effectiveDuration > 0 &&
      currentState === 'visible' &&
      !isPaused &&
      promiseState !== 'pending' // Don't auto-dismiss while promise is pending
    ) {
      const startTime = Date.now();

      // Progress bar update
      if (showProgress) {
        setProgress(100);
        progressIntervalRef.current = setInterval(() => {
          const elapsed = Date.now() - startTime;
          const remaining = Math.max(0, 100 - (elapsed / effectiveDuration) * 100);
          setProgress(remaining);
        }, 16); // ~60fps
      }

      // Auto-dismiss timeout
      timeoutRef.current = setTimeout(() => {
        handleClose();
      }, effectiveDuration);
    }

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (progressIntervalRef.current) {
        clearInterval(progressIntervalRef.current);
      }
    };
  }, [autoDismiss, effectiveDuration, currentState, isPaused, showProgress, promiseState]);

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
    }, 300); // Match CSS animation duration (toastSlideOut)
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

  // Show loading state if promise is pending
  const showLoading = promiseState === 'pending';
  const displayIcon = showLoading && loadingComponent ? loadingComponent : (leftIcon || getStatusIcon(variant));

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
        {displayIcon}
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

      {/* End Content (action buttons, etc.) */}
      {endContent && (
        <div className="toast__end-content">
          {endContent}
        </div>
      )}

      {/* Close Button (shows on hover) */}
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

      {/* Progress Bar */}
      {showProgress && autoDismiss && !showLoading && (
        <div className="toast__progress">
          <div
            className="toast__progress-bar"
            style={{
              transform: `scaleX(${progress / 100})`,
            }}
          />
        </div>
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
