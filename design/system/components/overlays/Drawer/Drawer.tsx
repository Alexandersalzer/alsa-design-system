'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../../lib/utils';
import { HStack } from '../../layout/hStack/HStack';
import { VStack } from '../../layout/vStack/VStack';
import { Button, IconButtons } from '../../../components';

export type DrawerPlacement = 'start' | 'end' | 'top' | 'bottom';
export type DrawerSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'full';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  placement?: DrawerPlacement;
  size?: DrawerSize;
  showCloseButton?: boolean;
  closeButtonVariant?: 'icon' | 'text';
  className?: string;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  preventScroll?: boolean;
  mobileOverlay?: boolean;
}

/**
 * Clean & stable Drawer with CSS transitions.
 * Uses opacity/transform instead of unmount flicker.
 */
export const Drawer = ({
  isOpen,
  onClose,
  children,
  placement = 'end',
  size = 'md',
  showCloseButton = true,
  closeButtonVariant = 'icon',
  className = '',
  closeOnBackdropClick = true,
  closeOnEscape = true,
  preventScroll = true,
  mobileOverlay = false,
}: DrawerProps) => {
  const [mounted, setMounted] = useState(false);

  // mount safety for SSR
  useEffect(() => setMounted(true), []);

  // lock scroll
  useEffect(() => {
    if (isOpen && preventScroll) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen, preventScroll]);

  // escape key
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isOpen, closeOnEscape, onClose]);

  if (!mounted) return null;

  return createPortal(
    <div
      className={cn(
        'drawer-wrapper',
        isOpen ? 'drawer-wrapper--open' : 'drawer-wrapper--closed',
      )}
      onClick={(e) => {
        if (closeOnBackdropClick && e.target === e.currentTarget) onClose();
      }}
    >
      <aside
        className={cn(
          'drawer',
          `drawer--${placement}`,
          `drawer--${size}`,
          mobileOverlay && 'drawer--mobile-overlay',
          isOpen ? 'drawer--open' : 'drawer--closed',
          className
        )}
        role="dialog"
        aria-modal="true"
      >
        {showCloseButton && (
          <HStack justify="end" className="drawer__close">
            {closeButtonVariant === 'icon' ? (
              <IconButtons.Close
                aria-label="Close drawer"
                variant="ghost"
                size="md"
                onClick={onClose}
              />
            ) : (
              <Button variant="ghost" size="md" onClick={onClose}>
                Close
              </Button>
            )}
          </HStack>
        )}

        <VStack spacing="lg" align="stretch" fullWidth className="drawer__content">
          {children}
        </VStack>
      </aside>
    </div>,
    document.body
  );
};

export default Drawer;
