// ===============================================
// src/design-system/components/primitives/Toast/Toast.tsx
// ENHANCED TOAST COMPONENT - SMOOTH ANIMATIONS
// ===============================================

import React, { forwardRef, ReactNode, useEffect, useState, useRef } from 'react';
import { cn } from '../../../lib/utils';
import { Typography } from '../Typography';
import { 
  Icon,
  StatusIcons,
  XMarkIcon
} from '../Icon';

// ===== TYPE DEFINITIONS =====
export type ToastVariant = 'info' | 'success' | 'warning' | 'error';
export type ToastState = 'entering' | 'visible' | 'exiting' | 'exited';

export interface ToastProps extends React.HTMLAttributes<HTMLDivElement> {
  onClose?: () => void;
  /** Toast message text */
  children: ReactNode;
  /** Toast variant/type */
  variant?: ToastVariant;
  /** Optional left icon (defaults to variant icon) */
  leftIcon?: ReactNode;
  /** Show close button */
  showClose?: boolean;

  /** Additional CSS classes */
  className?: string;
  /** Toast title (optional) */
  title?: string;
  /** Auto-dismiss duration in milliseconds (0 = no auto-dismiss) */
  duration?: number;
  /** Show progress bar for auto-dismiss */
  showProgress?: boolean;
  /** Called when animation completes */
  onAnimationComplete?: (state: ToastState) => void;
  /** Force animation state (for external control) */
  forceState?: ToastState;
}

// ===== ICON MAPPING =====
const getVariantIcon = (variant: ToastVariant): ReactNode => {
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
  leftIcon,
  showClose = true,
  onClose,
  title,
  className,
  duration = 5000,
  showProgress = true,
  onAnimationComplete,
  forceState,
  style,
  ...props
}, ref) => {
  const [animationState, setAnimationState] = useState<ToastState>('entering');
  const [isPaused, setIsPaused] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const progressRef = useRef<HTMLDivElement>(null);

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

  // Handle auto-dismiss
  useEffect(() => {
    if (duration <= 0 || currentState !== 'visible' || isPaused) return;

    timeoutRef.current = setTimeout(() => {
      handleClose();
    }, duration);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [duration, currentState, isPaused]);

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
    if (progressRef.current) {
      progressRef.current.style.animationPlayState = 'paused';
    }
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
    if (progressRef.current) {
      progressRef.current.style.animationPlayState = 'running';
    }
  };

  // Don't render if exited
  if (currentState === 'exited') {
    return null;
  }

  const toastClasses = cn(
    'toast',
    `toast--${variant}`,
    className
  );

  const toastStyle: React.CSSProperties = {
    ...style,
    '--toast-duration': duration > 0 ? `${duration}ms` : undefined,
  } as React.CSSProperties;

  return (
    <div 
      ref={ref} 
      className={toastClasses}
      data-state={currentState}
      style={toastStyle}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      role="alert"
      aria-live="polite"
      {...props}
    >
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

      {/* Progress Bar */}
      {showProgress && duration > 0 && currentState === 'visible' && (
        <div 
          ref={progressRef}
          className="toast__progress" 
          aria-hidden="true"
        />
      )}
    </div>
  );
});

Toast.displayName = 'Toast';

// ===== TOAST MANAGER HOOK =====
export interface ToastItem {
  id: string;
  component: React.ReactElement<ToastProps>;  // Ensure it's React.ReactElement that can accept ToastProps
  duration?: number;
}
export const useToastManager = () => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = (toast: Omit<ToastItem, 'id'>) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    setToasts(prev => [...prev, { ...toast, id }]);
    return id;
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const clearAllToasts = () => {
    setToasts([]);
  };

  return {
    toasts,
    addToast,
    removeToast,
    clearAllToasts
  };
};

// ===== TOAST CONTAINER COMPONENT =====
export interface ToastContainerProps {
  toasts: ToastItem[];
  onRemoveToast: (id: string) => void;
  className?: string;
}

export const ToastContainer: React.FC<ToastContainerProps> = ({
  toasts,
  onRemoveToast,
  className
}) => {
  if (toasts.length === 0) return null;

  return (
    <div className={cn('toast-container', className)}>
      {toasts.map((toast, index) => (
        <div key={toast.id} style={{ '--toast-delay': `${index * 100}ms` } as React.CSSProperties}>
          {React.cloneElement(toast.component, {
            onClose: () => onRemoveToast(toast.id),
            duration: toast.duration
          })}
        </div>
      ))}
    </div>
  );
};


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

// ===== UTILITY FUNCTIONS =====
export const toast = {
  success: (message: ReactNode, options?: Partial<SuccessToastProps>) => ({
    component: <SuccessToast {...options}>{message}</SuccessToast>,
    duration: options?.duration || 5000
  }),
  
  error: (message: ReactNode, options?: Partial<ErrorToastProps>) => ({
    component: <ErrorToast {...options}>{message}</ErrorToast>,
    duration: options?.duration || 7000 // Errors stay longer
  }),
  
  warning: (message: ReactNode, options?: Partial<WarningToastProps>) => ({
    component: <WarningToast {...options}>{message}</WarningToast>,
    duration: options?.duration || 6000
  }),
  
  info: (message: ReactNode, options?: Partial<InfoToastProps>) => ({
    component: <InfoToast {...options}>{message}</InfoToast>,
    duration: options?.duration || 4000
  })
};