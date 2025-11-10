'use client';
import React, { useEffect, useState } from 'react';
import { cn } from '../../../lib/utils';
import { HStack } from '../../layout/hStack/HStack';
import { VStack } from '../../layout/vStack/VStack';
import { Portal } from '../../layout/portal/Portal';
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
  closeButtonLabel?: string;
  className?: string;
  closeOnEscape?: boolean;
  closeOnBackdropClick?: boolean;
  preventScroll?: boolean;
  mobileOverlay?: boolean; // ✅ NEW: turns Drawer into full overlay for mobile
}

export const Drawer = ({
  isOpen,
  onClose,
  children,
  placement = 'end',
  size = 'md',
  showCloseButton = true,
  closeButtonVariant = 'icon',
  closeButtonLabel = 'Close',
  className = '',
  closeOnEscape = true,
  closeOnBackdropClick = true,
  preventScroll = true,
  mobileOverlay = false,
}: DrawerProps) => {
  const [isClosing, setIsClosing] = useState(false);

  // === Disable background scroll ===
  useEffect(() => {
    if (isOpen && preventScroll) document.body.style.overflow = 'hidden';
    return () => {
      if (preventScroll) document.body.style.overflow = '';
    };
  }, [isOpen, preventScroll]);

  // === Handle Escape key ===
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') handleClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeOnEscape]);

  const handleClose = () => {
    setIsClosing(true);
    // Wait for CSS animation (300ms)
    setTimeout(() => {
      setIsClosing(false);
      onClose();
    }, 300);
  };

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!closeOnBackdropClick) return;
    if (e.target === e.currentTarget) handleClose();
  };

  if (!isOpen && !isClosing) return null;

  return (
    <Portal>
      <div
        className={cn(
          'drawer-backdrop',
          mobileOverlay && 'drawer-backdrop--overlay',
          isClosing && 'drawer-backdrop--closing'
        )}
        onClick={handleBackdropClick}
      >
        <aside
          className={cn(
            'drawer',
            `drawer--${placement}`,
            `drawer--${size}`,
            mobileOverlay && 'drawer--mobile-overlay',
            isClosing && 'drawer--closing',
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
                  onClick={handleClose}
                />
              ) : (
                <Button variant="ghost" size="md" onClick={handleClose}>
                  {closeButtonLabel}
                </Button>
              )}
            </HStack>
          )}

          <VStack spacing="lg" align="stretch" fullWidth className="drawer__content">
            {children}
          </VStack>
        </aside>
      </div>
    </Portal>
  );
};

export default Drawer;
