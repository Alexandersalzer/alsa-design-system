// ==============================================
// src/design-system/components/primitives/Modal/Modal.tsx
// MODAL COMPONENT - WITH FOOTER SUPPORT
// ==============================================

import React, { forwardRef, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../../utils/cn';
import { IconButtons } from '../../actions';
import { H3 } from '../../Typography';

export type ModalSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | 'full';

export interface ModalProps {
  children: React.ReactNode;
  isOpen: boolean;
  onClose: () => void;
  size?: ModalSize;
  title?: string;
  /** Footer content (typically actions/buttons) - will be sticky at bottom */
  footer?: React.ReactNode;
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
  footer,
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
      setIsClosing(true);
      const timer = setTimeout(() => {
        setShouldRender(false);
        setIsClosing(false);
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isOpen, shouldRender]);

  // Handle escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, closeOnEscape, onClose]);

  // Prevent body scroll
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

  if (!shouldRender) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget && closeOnBackdropClick) onClose();
  };

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

  const modalElement = (
    <div
      className={backdropClasses}
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      aria-labelledby={title ? 'modal-title' : undefined}
    >
      <div ref={ref} className={modalClasses} {...props}>
        {/* Header */}
        {(title || showCloseButton) && (
          <div className="modal__header">
            {title && (
              <H3 id="modal-title" className="modal__title">
                {title}
              </H3>
            )}
            {showCloseButton && (
              <IconButtons.Close
                onClick={onClose}
                variant="ghost"
                size="md"
                aria-label="Close modal"
                className="modal__close-btn"
              />
            )}
          </div>
        )}

        {/* Content - scrollable area */}
        <div className="modal__content">
          {children}
        </div>

        {/* Footer - sticky at bottom */}
        {footer && (
          <div className="modal__footer">
            {footer}
          </div>
        )}
      </div>
    </div>
  );

  return createPortal(modalElement, document.body);
});

Modal.displayName = 'Modal';

export default Modal;