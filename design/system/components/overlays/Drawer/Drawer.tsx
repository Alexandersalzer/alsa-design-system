'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { cn } from '../../../lib/utils';
import { HStack } from '../../layout/hStack/HStack';
import { VStack } from '../../layout/vStack/VStack';
import { Button, IconButtons } from '../../../components';

export interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  showCloseButton?: boolean;
  closeButtonVariant?: 'icon' | 'text';
  closeButtonLabel?: string;
  className?: string;
  preventScroll?: boolean;
}

const Drawer = ({
  isOpen,
  onClose,
  children,
  showCloseButton = true,
  closeButtonVariant = 'icon',
  closeButtonLabel = 'Close',
  className,
  preventScroll = true,
}: DrawerProps) => {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (isOpen) {
      setVisible(true);
      if (preventScroll) document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      const t = setTimeout(() => setVisible(false), 250);
      return () => clearTimeout(t);
    }
  }, [isOpen, preventScroll]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  if (!mounted || !visible) return null;

  return createPortal(
    <div
      className={cn(
        'drawer-overlay',
        isOpen ? 'drawer-overlay--open' : 'drawer-overlay--closing',
      )}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <aside
        className={cn(
          'drawer',
          isOpen ? 'drawer--open' : 'drawer--close',
          className,
        )}
        role="dialog"
        aria-modal="true"
      >
        {showCloseButton && (
          <HStack justify="end" className="drawer__close">
            {closeButtonVariant === 'icon' ? (
              <IconButtons.Close
                aria-label="Close menu"
                variant="ghost"
                size="md"
                onClick={onClose}
              />
            ) : (
              <Button variant="ghost" size="md" onClick={onClose}>
                {closeButtonLabel}
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
