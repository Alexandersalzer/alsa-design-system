// ===============================================
// design/system/components/overlays/Drawer/Drawer.tsx
// Drawer component using Blimpify design-system primitives
// ===============================================

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
}: DrawerProps) => {
  const [isClosing, setIsClosing] = useState(false);

  // === Disable background scroll ===
  useEffect(() => {
    if (isOpen && preventScroll) document.body.style.overflow = 'hidden';
    else document.body.style.overflow = '';
    return () => { document.body.style.overflow = ''; };
  }, [isOpen, preventScroll]);

  // === ESC key ===
  useEffect(() => {
    if (!isOpen || !closeOnEscape) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsClosing(true);
        setTimeout(onClose, 200);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, closeOnEscape, onClose]);

  // === Backdrop click ===
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!closeOnBackdropClick) return;
    if (e.target === e.currentTarget) {
      setIsClosing(true);
      setTimeout(onClose, 200);
    }
  };

  if (!isOpen && !isClosing) return null;

  const drawerContent = (
    <div
      className={cn(
        'drawer-backdrop',
        isClosing && 'drawer-backdrop--closing'
      )}
      onClick={handleBackdropClick}
    >
      <aside
        className={cn(
          'drawer',
          `drawer--${placement}`,
          `drawer--${size}`,
          isClosing && 'drawer--closing',
          className
        )}
        role="dialog"
        aria-modal="true"
      >
        <VStack spacing="lg" className="drawer__content" fullWidth>
          {showCloseButton && (
            <HStack justify="end" className="drawer__close">
              {closeButtonVariant === 'icon' ? (
                <IconButtons.Close
                  aria-label="Close drawer"
                  variant="ghost"
                  size="md"
                  onClick={() => {
                    setIsClosing(true);
                    setTimeout(onClose, 200);
                  }}
                />
              ) : (
                <Button
                  variant="ghost"
                  size="md"
                  onClick={() => {
                    setIsClosing(true);
                    setTimeout(onClose, 200);
                  }}
                >
                  {closeButtonLabel}
                </Button>
              )}
            </HStack>
          )}

          {/* Actual drawer body */}
          <VStack spacing="lg" align="stretch" fullWidth flexChild>
            {children}
          </VStack>
        </VStack>
      </aside>
    </div>
  );

  // Render in portal to ensure proper z-index stacking
  return (
    <Portal>
      {drawerContent}
    </Portal>
  );
};

export default Drawer;
