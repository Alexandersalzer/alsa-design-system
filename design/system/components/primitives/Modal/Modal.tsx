// ===============================================
// src/design-system/components/primitives/Modal/Modal.tsx
// CLEAN VERSION - Uses IconButton instead of ugly SVG
// ===============================================

import React, { forwardRef, useEffect, useState } from 'react';
import { cn } from '../../../lib/utils';
import { IconButtons } from '../IconButton';
import './Modal.css';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface ModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  size?: ModalSize;
  title?: string;
  showCloseButton?: boolean;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  className?: string;
}

export const Modal = forwardRef<HTMLDivElement, ModalProps>(({
  children,
  isOpen,
  onClose,
  size = 'md',
  title,
  showCloseButton = true,
  closeOnBackdropClick = true,
  closeOnEscape = true,
  className,
  ...props
}, ref) => {
  const [isClosing, setIsClosing] = useState(false);
  const [shouldRender, setShouldRender] = useState(isOpen);

  // Handle opening/closing states
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsClosing(false);
    } else if (shouldRender) {
      // Start closing animation
      setIsClosing(true);
      // Remove from DOM after animation completes
      const timer = setTimeout(() => {
        setShouldRender(false);
        setIsClosing(false);
      }, 150); // Match --foundation-duration-fast
      
      return () => clearTimeout(timer);
    }
  }, [isOpen, shouldRender]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;
    
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  // Prevent body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Don't render if not needed
  if (!shouldRender) return null;

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && closeOnBackdropClick) {
      onClose();
    }
  };

  // Build modal classes
  const modalClasses = cn(
    'modal',
    `modal--${size}`,
    isClosing && 'modal--closing',
    className
  );

  const backdropClasses = cn(
    'modal-backdrop',
    isClosing && 'modal-backdrop--closing'
  );

  return (
    <div
      className={backdropClasses}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div
        ref={ref}
        className={modalClasses}
        {...props}
      >
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="modal__header">
            {title && (
              <h2 id="modal-title" className="modal__title">
                {title}
              </h2>
            )}
            {showCloseButton && (
              <IconButtons.Close
                onClick={onClose}
                variant="ghost"
                size="md"
                aria-label="Stäng modal"
                className="modal__close-btn"
              />
            )}
          </div>
        )}

        {/* Content */}
        <div className="modal__content">
          {children}
        </div>
      </div>
    </div>
  );
});

Modal.displayName = 'Modal';
export default Modal;